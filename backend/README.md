# Vaidha AI — Backend Service

FastAPI service that answers the chat with Google Gemini, runs the RAG eligibility checker, manages accounts and serves live government news. `main.py` holds the endpoints and the Gemini model fallback chain; `rag.py` the embedding index; `auth.py` accounts and sessions (SQLite); `guardrails.py` rate limits, PII redaction, the prompt-injection filter and the official-link allow-list. See the [main README](../README.md) for the architecture and the roadmap.

### Python environment (Gemini API)

A virtual environment with the Google Gen AI SDK (`google-genai`) lives in `backend/.venv` (Python 3.12, created with `uv`).

```bash
cd backend
source .venv/bin/activate              # or: .venv/bin/python ...
cp .env.example .env                   # then paste your key into GEMINI_API_KEY
```

To recreate it from scratch:

```bash
uv venv --python 3.12 .venv
uv pip install --python .venv/bin/python -r requirements.txt
```

`.venv` and `.env` are git-ignored; never commit the API key.

### Running the chat API

```bash
cd backend
.venv/bin/uvicorn main:app --reload --port 8000
```

- `POST /api/chat` takes `{ "message", "history": [{ "role": "user" | "assistant", "content" }], "language" }` and returns `{ "content", "citations", "followUps" }` using Gemini structured output.
- `GET /api/health` shows the model order and whether a key is configured.
- Models are tried in order (`GEMINI_MODEL`, then `GEMINI_FALLBACK_MODELS`): if one is overloaded, times out (15–25 s) or hits its free-tier quota, the next one answers.
- In development the frontend calls `/api/...`, which Vite proxies to `http://127.0.0.1:8000` (see `frontend/vite.config.ts`). Run both servers.
