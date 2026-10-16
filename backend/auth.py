"""Mobile number + password accounts, sessions and the user's account details.

Stored in SQLite: locally in backend/vaidha.db (git-ignored), or in a Turso database when TURSO_DATABASE_URL is set,
because a serverless host such as Vercel has no lasting disk.
Passwords are hashed with scrypt and session tokens are stored only as hashes.
"""

import hashlib
import hmac
import json
import logging
import os
import re
import secrets
import time
from pathlib import Path
from typing import Literal

import libsql
from fastapi import APIRouter, Cookie, HTTPException, Request, Response
from pydantic import BaseModel, Field

from guardrails import retry_after, visitor_id

DB_PATH = Path(os.getenv("VAIDHA_DB", Path(__file__).parent / "vaidha.db"))
SESSION_COOKIE = "vaidha_session"
SESSION_TTL_SECONDS = 30 * 24 * 3600
MIN_PASSWORD_LENGTH = 8
SCRYPT = {"n": 2**14, "r": 8, "p": 1}

logger = logging.getLogger("vaidha")
router = APIRouter(prefix="/api")

_db = (
    libsql.connect(os.environ["TURSO_DATABASE_URL"], auth_token=os.getenv("TURSO_AUTH_TOKEN", ""))
    if os.getenv("TURSO_DATABASE_URL")
    else libsql.connect(str(DB_PATH))
)
_db.executescript(
    """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        phone TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        details TEXT NOT NULL DEFAULT '{}',
        created_at REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        expires_at REAL NOT NULL
    );
    DROP TABLE IF EXISTS otps;
    """
)
# Databases created before passwords existed lack the column.
if "password_hash" not in {row[1] for row in _db.execute("PRAGMA table_info(users)").fetchall()}:
    _db.execute("ALTER TABLE users ADD COLUMN password_hash TEXT")
_db.commit()


def _one(sql: str, params: tuple = ()) -> dict | None:
    """First matching row as a dict (libsql has no row_factory)."""
    cursor = _db.execute(sql, params)
    row = cursor.fetchone()
    return dict(zip([col[0] for col in cursor.description], row)) if row else None


class AccountDetails(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    gender: Literal["Female", "Male", "Other"]
    age: int = Field(ge=1, le=120)
    state: str = Field(min_length=1, max_length=60)
    district: str = Field(default="", max_length=60)
    language: Literal["English", "Hindi", "Marathi"]


class AccountUpdate(BaseModel):
    """Partial update, e.g. only the language from Settings."""

    name: str | None = Field(default=None, min_length=1, max_length=100)
    gender: Literal["Female", "Male", "Other"] | None = None
    age: int | None = Field(default=None, ge=1, le=120)
    state: str | None = Field(default=None, min_length=1, max_length=60)
    district: str | None = Field(default=None, max_length=60)
    language: Literal["English", "Hindi", "Marathi"] | None = None


class Account(BaseModel):
    phone: str
    details: dict
    needsDetails: bool


class Credentials(BaseModel):
    phone: str = Field(max_length=20)
    password: str = Field(max_length=128)


def normalize_phone(raw: str) -> str:
    """Accepts 10-digit Indian mobile numbers, with or without +91 / 0, and returns +91XXXXXXXXXX."""
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    elif len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]
    if not re.fullmatch(r"[6-9]\d{9}", digits):
        raise HTTPException(422, "Enter a valid 10-digit Indian mobile number.")
    return f"+91{digits}"


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, **SCRYPT)
    return f"scrypt${salt.hex()}${digest.hex()}"


def password_matches(password: str, stored: str | None) -> bool:
    if not stored:
        return False
    _, salt, digest = stored.split("$")
    candidate = hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), **SCRYPT)
    return hmac.compare_digest(candidate.hex(), digest)


# Spent on unknown numbers too, so a login attempt takes the same time whether or not the number is registered.
_DUMMY_HASH = hash_password(secrets.token_urlsafe(16))


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def rate_limit(request: Request, limits: list[tuple[str, int, int]]) -> None:
    ip = visitor_id(request.client.host) if request.client else "unknown"
    wait = retry_after([(key.replace("{ip}", ip), limit, window) for key, limit, window in limits])
    if wait:
        raise HTTPException(429, "Too many attempts. Please wait a few minutes and try again.", headers={"Retry-After": str(wait)})


def account_for(user: dict) -> Account:
    details = json.loads(user["details"])
    return Account(phone=user["phone"], details=details, needsDetails="name" not in details)


def start_session(user: dict, request: Request, response: Response) -> Account:
    token = secrets.token_urlsafe(32)
    _db.execute(
        "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
        (token_hash(token), user["id"], time.time() + SESSION_TTL_SECONDS),
    )
    _db.execute("DELETE FROM sessions WHERE expires_at < ?", (time.time(),))
    _db.commit()
    response.set_cookie(
        SESSION_COOKIE,
        token,
        max_age=SESSION_TTL_SECONDS,
        httponly=True,
        samesite="lax",
        secure=request.url.scheme == "https",
        path="/",
    )
    return account_for(user)


def current_user(token: str | None) -> dict:
    if not token:
        raise HTTPException(401, "Please log in.")
    row = _one(
        "SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ?",
        (token_hash(token), time.time()),
    )
    if not row:
        raise HTTPException(401, "Your session has ended. Please log in again.")
    return row


@router.post("/auth/register", response_model=Account)
def register(body: Credentials, request: Request, response: Response) -> Account:
    phone = normalize_phone(body.phone)
    rate_limit(request, [("register-ip:{ip}", 10, 3600)])
    if len(body.password) < MIN_PASSWORD_LENGTH:
        raise HTTPException(422, "Use a password with at least 8 characters.")
    existing = _one("SELECT * FROM users WHERE phone = ?", (phone,))
    if existing and existing["password_hash"]:
        raise HTTPException(409, "An account with this mobile number already exists. Please log in instead.")
    if existing:
        # Accounts made with the old OTP login have no password yet; registering sets one and keeps their details.
        _db.execute("UPDATE users SET password_hash = ? WHERE id = ?", (hash_password(body.password), existing["id"]))
    else:
        _db.execute(
            "INSERT INTO users (phone, password_hash, created_at) VALUES (?, ?, ?)",
            (phone, hash_password(body.password), time.time()),
        )
    user = _one("SELECT * FROM users WHERE phone = ?", (phone,))
    return start_session(user, request, response)


@router.post("/auth/login", response_model=Account)
def login(body: Credentials, request: Request, response: Response) -> Account:
    phone = normalize_phone(body.phone)
    # Per number: stops password guessing on one account. Per visitor: stops guessing across many accounts.
    rate_limit(request, [(f"login-phone:{phone}", 10, 900), ("login-ip:{ip}", 30, 900)])
    user = _one("SELECT * FROM users WHERE phone = ?", (phone,))
    if not password_matches(body.password, user["password_hash"] if user else _DUMMY_HASH) or not user:
        raise HTTPException(401, "The mobile number or password is not right.")
    return start_session(user, request, response)


@router.get("/auth/me", response_model=Account | None)
def me(vaidha_session: str | None = Cookie(default=None)) -> Account | None:
    """The logged-in account, or null. Not being logged in is a normal answer here, not an error."""
    try:
        return account_for(current_user(vaidha_session))
    except HTTPException:
        return None


@router.post("/auth/logout")
def logout(response: Response, vaidha_session: str | None = Cookie(default=None)) -> dict:
    if vaidha_session:
        _db.execute("DELETE FROM sessions WHERE token_hash = ?", (token_hash(vaidha_session),))
        _db.commit()
    response.delete_cookie(SESSION_COOKIE, path="/")
    return {"ok": True}


@router.put("/account", response_model=Account)
def save_details(body: AccountDetails, vaidha_session: str | None = Cookie(default=None)) -> Account:
    """Saves the details from the first-login form."""
    return update_details(body.model_dump(), vaidha_session)


@router.patch("/account", response_model=Account)
def patch_details(body: AccountUpdate, vaidha_session: str | None = Cookie(default=None)) -> Account:
    """Changes some details later, e.g. the language from Settings or the name from My Profile."""
    return update_details(body.model_dump(exclude_none=True), vaidha_session)


def update_details(changes: dict, token: str | None) -> Account:
    user = current_user(token)
    details = {**json.loads(user["details"]), **changes}
    _db.execute("UPDATE users SET details = ? WHERE id = ?", (json.dumps(details), user["id"]))
    _db.commit()
    return account_for(_one("SELECT * FROM users WHERE id = ?", (user["id"],)))
