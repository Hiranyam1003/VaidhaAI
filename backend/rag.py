"""Retrieval over the scheme and document data shared with the frontend (frontend/src/data/*.json).

Each scheme and each document guide becomes one text chunk. Chunks are embedded with Gemini once and cached
in backend/.cache/embeddings.json, keyed by a hash of their text, so only new or edited entries are re-embedded.
The corpus is small (tens of entries), so search is a plain cosine similarity over all vectors.
"""

import asyncio
import hashlib
import json
import logging
import math
import os
from dataclasses import dataclass
from pathlib import Path

from google import genai
from google.genai import types

DATA_DIR = Path(os.getenv("VAIDHA_DATA_DIR", Path(__file__).parent.parent / "frontend" / "src" / "data"))
CACHE_FILE = Path(__file__).parent / ".cache" / "embeddings.json"
EMBED_MODEL = os.getenv("GEMINI_EMBED_MODEL", "gemini-embedding-001")
EMBED_DIMS = 768

logger = logging.getLogger("vaidha")


@dataclass
class Chunk:
    kind: str  # "scheme" or "document"
    id: str
    text: str
    record: dict
    vector: list[float] | None = None


def scheme_text(s: dict) -> str:
    docs = s["requiredDocuments"]
    process = s["applicationProcess"]
    return "\n".join(
        [
            f"Scheme: {s['name']} ({s['level']} government, {s['category']})",
            f"For: {', '.join(s.get('beneficiaryGroups') or [s['beneficiaryGroup']])}",
            f"Benefits: {' '.join(s['benefits'])}",
            f"Eligibility: {' '.join(s['eligibilityCriteria'])}",
            f"Documents: {', '.join(docs['mandatory'] + docs.get('conditional', []))}",
            f"How to apply ({process['mode']}): {process['description']}",
            f"Keywords: {', '.join(s.get('searchKeywords', []))}",
        ]
    )


def document_text(d: dict) -> str:
    return "\n".join(
        [
            f"Document: {d['name']} (issued by {d['issuedBy']})",
            d["summary"],
            f"Who can apply: {d['whoCanApply']}",
            f"Papers needed: {', '.join(d['papers'])}",
        ]
    )


def load_chunks() -> list[Chunk]:
    schemes = json.loads((DATA_DIR / "schemes.json").read_text())
    documents = json.loads((DATA_DIR / "documents.json").read_text())
    return [Chunk("scheme", s["id"], scheme_text(s), s) for s in schemes] + [
        Chunk("document", d["id"], document_text(d), d) for d in documents
    ]


def normalize(v: list[float]) -> list[float]:
    # Gemini only normalises full-size embeddings; reduced ones (EMBED_DIMS) must be normalised here.
    norm = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / norm for x in v]


def text_key(text: str) -> str:
    return hashlib.sha256(f"{EMBED_MODEL}:{EMBED_DIMS}:{text}".encode()).hexdigest()


async def embed(client: genai.Client, texts: list[str], task: str) -> list[list[float]]:
    result = await client.aio.models.embed_content(
        model=EMBED_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task, output_dimensionality=EMBED_DIMS),
    )
    return [normalize(e.values) for e in result.embeddings]


class Index:
    def __init__(self) -> None:
        self.chunks: list[Chunk] = []
        self._lock = asyncio.Lock()
        self._data_mtime = 0.0

    def _data_changed(self) -> bool:
        mtime = max((DATA_DIR / name).stat().st_mtime for name in ("schemes.json", "documents.json"))
        return mtime != self._data_mtime

    async def ensure_ready(self, client: genai.Client) -> None:
        """Builds the index on first use, and again whenever the JSON data files change."""
        if self.chunks and not self._data_changed():
            return
        async with self._lock:
            if self.chunks and not self._data_changed():
                return
            self._data_mtime = max((DATA_DIR / n).stat().st_mtime for n in ("schemes.json", "documents.json"))
            chunks = load_chunks()
            cache = json.loads(CACHE_FILE.read_text()) if CACHE_FILE.exists() else {}
            missing = [c for c in chunks if text_key(c.text) not in cache]
            for start in range(0, len(missing), 50):
                batch = missing[start : start + 50]
                for chunk, vector in zip(batch, await embed(client, [c.text for c in batch], "RETRIEVAL_DOCUMENT")):
                    cache[text_key(chunk.text)] = vector
            if missing:
                CACHE_FILE.parent.mkdir(exist_ok=True)
                CACHE_FILE.write_text(json.dumps({text_key(c.text): cache[text_key(c.text)] for c in chunks}))
                logger.info("Embedded %d new or changed chunks", len(missing))
            for chunk in chunks:
                chunk.vector = cache[text_key(chunk.text)]
            self.chunks = chunks

    async def search(self, client: genai.Client, query: str, kind: str, k: int, exclude=lambda record: False) -> list[Chunk]:
        await self.ensure_ready(client)
        [q] = await embed(client, [query], "RETRIEVAL_QUERY")
        scored = [
            (sum(a * b for a, b in zip(q, c.vector)), c)
            for c in self.chunks
            if c.kind == kind and not exclude(c.record)
        ]
        scored.sort(key=lambda pair: pair[0], reverse=True)
        return [c for _, c in scored[:k]]


index = Index()
