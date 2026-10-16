"""Vercel entry point: serves the FastAPI app in backend/main.py as a serverless function for /api/*."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware  # noqa: E402

from main import app as backend_app  # noqa: E402

# Vercel sets X-Forwarded-For to the visitor's real IP (it can't be spoofed), which the rate limits key on,
# and X-Forwarded-Proto so the session cookie is marked Secure.
app = ProxyHeadersMiddleware(backend_app, trusted_hosts="*")
