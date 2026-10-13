"""Vaidha AI backend: one chat endpoint answered by Gemini.

Run from backend/:  .venv/bin/uvicorn main:app --reload --port 8000
"""

import logging
import os
from pathlib import Path
from typing import Literal

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from google import genai
from google.genai import errors, types
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).parent / ".env")

# Tried in order: if a model is overloaded, too slow or out of quota, the next one answers instead.
# Each model has its own free-tier quota, so falling back also stretches the rate limit.
MODELS = [
    os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite"),
    *filter(None, os.getenv("GEMINI_FALLBACK_MODELS", "gemini-3.6-flash,gemini-3.5-flash").split(",")),
]
REQUEST_TIMEOUT_MS = 25_000
MAX_HISTORY_TURNS = 10

SYSTEM_PROMPT = """You are Vaidha AI, a citizen services assistant that helps people in India understand
government schemes, check whether they might be eligible, and find out which documents they need.
Your users include elderly people, students, farmers and people who are not comfortable with technology.

How to answer:
- Use plain, simple words. Explain any official term (like DBT, EWS or domicile) the first time you use it.
- Be concise: usually under 250 words. Lead with the direct answer.
- Prefer official central and state government schemes and portals (for example myScheme, UMANG,
  DigiLocker, National Scholarship Portal, MahaDBT, Aaple Sarkar).
- Never invent schemes, amounts, deadlines or eligibility rules. If you are not sure, say so and tell the
  person where to confirm it (the official portal, a Common Service Centre, or the relevant office).
- Do not ask for or repeat sensitive personal data such as Aadhaar numbers, bank details or OTPs.
- Politely steer unrelated requests back to government schemes, eligibility and documents.

Format the "content" field using only this small markdown subset:
- "### " for one main heading and "#### " for sub-headings
- numbered items like "1. **Scheme name**: short description"
- "- " bullets, with "  - " for a nested bullet under a numbered item
- "**bold**" for emphasis
- "[portal name](https://...)" to link an official government website (only https links to real official sites)
No tables, code blocks or HTML.

"citations": up to 3 real official sources you relied on (scheme guidelines, government portals or
departments). Use an empty list if you did not rely on a specific official source.
"followUps": 2 or 3 short, natural next questions the person might ask."""


class Turn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=8000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[Turn] = Field(default_factory=list)
    language: Literal["English", "Hindi", "Marathi"] = "English"


class Citation(BaseModel):
    title: str
    department: str
    documentType: str


class ChatReply(BaseModel):
    content: str
    citations: list[Citation]
    followUps: list[str]


logger = logging.getLogger("vaidha")
app = FastAPI(title="Vaidha AI")
_client: genai.Client | None = None


def get_client() -> genai.Client:
    global _client
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(503, "The Gemini API key is missing. Add GEMINI_API_KEY to backend/.env.")
    if _client is None:
        # One attempt per model; falling back to the next model is faster than retrying a busy one.
        _client = genai.Client(
            http_options=types.HttpOptions(
                timeout=REQUEST_TIMEOUT_MS,
                retry_options=types.HttpRetryOptions(attempts=1),
            )
        )
    return _client


@app.get("/api/health")
def health() -> dict:
    return {"ok": True, "models": MODELS, "keyConfigured": bool(os.getenv("GEMINI_API_KEY"))}


@app.post("/api/chat", response_model=ChatReply)
async def chat(req: ChatRequest) -> ChatReply:
    client = get_client()

    contents = [
        types.Content(role="model" if turn.role == "assistant" else "user", parts=[types.Part(text=turn.content)])
        for turn in req.history[-MAX_HISTORY_TURNS:]
    ]
    contents.append(types.Content(role="user", parts=[types.Part(text=req.message)]))

    config = types.GenerateContentConfig(
        system_instruction=f"{SYSTEM_PROMPT}\n\nWrite every field of your reply in {req.language}.",
        response_mime_type="application/json",
        response_schema=ChatReply,
        # Low thinking keeps answers fast and is plenty for these citizen-service questions.
        thinking_config=types.ThinkingConfig(thinking_level="low"),
    )

    for model in MODELS:
        try:
            response = await client.aio.models.generate_content(model=model, contents=contents, config=config)
            break
        except (errors.ServerError, httpx.TimeoutException) as e:
            logger.warning("%s is busy or slow (%s); trying the next model", model, getattr(e, "code", type(e).__name__))
        except errors.ClientError as e:
            if e.code != 429:
                logger.warning("Gemini request to %s failed: %s %s", model, e.code, e.message)
                raise HTTPException(502, explain_gemini_error(e, model)) from e
            logger.warning("%s is out of quota; trying the next model", model)
        except errors.APIError as e:
            logger.warning("Gemini request to %s failed: %s %s", model, e.code, e.message)
            raise HTTPException(502, explain_gemini_error(e, model)) from e
    else:
        raise HTTPException(503, "Gemini is busy or its usage limit was reached. Please try again in a minute.")

    reply = response.parsed
    if not isinstance(reply, ChatReply):
        logger.warning("Gemini returned unparseable output: %r", response.text)
        raise HTTPException(502, "Gemini returned an answer in an unexpected format. Please try again.")
    return reply


def explain_gemini_error(e: errors.APIError, model: str) -> str:
    message = e.message or ""
    if "API key" in message or e.status == "PERMISSION_DENIED":
        return "The Gemini API key was rejected. Check GEMINI_API_KEY in backend/.env."
    if e.code == 429:
        return "Gemini's usage limit was reached. Please wait a minute and try again."
    if e.code == 404:
        return f"The Gemini model '{model}' is not available. Set GEMINI_MODEL in backend/.env."
    return "Gemini could not answer right now. Please try again in a moment."
