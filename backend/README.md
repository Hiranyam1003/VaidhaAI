# Vaidha AI — Backend Service

This directory is designated for the future backend architecture of Vaidha AI (Virtual Assistant for Indian Documentation & High-level Administration).

### Planned Architecture
- **API Framework**: FastAPI / Node.js
- **Services**:
  - Scheme Directory & Categorization Engine
  - Rule-based & Deterministic Eligibility Verification Engine
  - Document Requirements & Verification Matrix
  - Citizen Query Processing
- **Integration Points**: Official public state APIs, UMANG, DigiLocker, and state portal directories.

*Note: Currently running in frontend-only prototype mode.*

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
