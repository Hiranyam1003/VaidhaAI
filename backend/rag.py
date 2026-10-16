"""Retrieval over the scheme and document data shared with the frontend (frontend/src/data/*.json).

Each scheme and each document guide becomes one text chunk. The corpus is small (tens of entries), so search is
plain BM25 keyword scoring in memory: no embedding API and nothing to cache. The index rebuilds itself when the
JSON data files change.
"""

import json
import math
import os
import re
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path

DATA_DIR = Path(os.getenv("VAIDHA_DATA_DIR", Path(__file__).parent.parent / "frontend" / "src" / "data"))
DATA_FILES = ("schemes.json", "documents.json")
BM25_K1 = 1.5
BM25_B = 0.75
STOPWORDS = set(
    "a an and are as at be by for from has have in is it of on or the to who with this that not does do "
    "your you can any all per its their they".split()
)


@dataclass
class Chunk:
    kind: str  # "scheme" or "document"
    id: str
    text: str
    record: dict
    terms: Counter = field(default_factory=Counter)


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


def tokenize(text: str) -> list[str]:
    return [w for w in re.findall(r"[a-z0-9]+", text.lower()) if len(w) > 1 and w not in STOPWORDS]


class Index:
    def __init__(self) -> None:
        self.chunks: list[Chunk] = []
        self.idf: dict[str, float] = {}
        self.avg_len = 1.0
        self._data_mtime = 0.0

    def ensure_ready(self) -> None:
        """Builds the index on first use, and again whenever the JSON data files change."""
        mtime = max((DATA_DIR / name).stat().st_mtime for name in DATA_FILES)
        if self.chunks and mtime == self._data_mtime:
            return
        chunks = load_chunks()
        for chunk in chunks:
            chunk.terms = Counter(tokenize(chunk.text))
        doc_freq = Counter(term for c in chunks for term in c.terms)
        n = len(chunks)
        self.idf = {term: math.log(1 + (n - df + 0.5) / (df + 0.5)) for term, df in doc_freq.items()}
        self.avg_len = sum(c.terms.total() for c in chunks) / n
        self.chunks, self._data_mtime = chunks, mtime

    def score(self, query_terms: set[str], chunk: Chunk) -> float:
        norm = BM25_K1 * (1 - BM25_B + BM25_B * chunk.terms.total() / self.avg_len)
        return sum(
            self.idf[term] * tf * (BM25_K1 + 1) / (tf + norm)
            for term in query_terms
            if (tf := chunk.terms.get(term, 0))
        )

    def search(self, query: str, kind: str, k: int, exclude=lambda record: False) -> list[Chunk]:
        self.ensure_ready()
        query_terms = set(tokenize(query))
        scored = [(self.score(query_terms, c), c) for c in self.chunks if c.kind == kind and not exclude(c.record)]
        scored.sort(key=lambda pair: pair[0], reverse=True)
        return [c for _, c in scored[:k]]


index = Index()
