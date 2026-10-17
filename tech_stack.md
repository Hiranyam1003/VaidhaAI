# Tech stack

How Vaidha AI is built: the commands, architecture, data, backend and deployment.

## Project

Vaidha AI is a citizen-services assistant that helps Indian citizens understand government schemes, eligibility and required documents. It is currently a **frontend-only prototype**: all data and "AI" responses are local mocks. `backend/` only holds a README describing a planned FastAPI/Node service (scheme directory, rule-based eligibility engine, document matrix, UMANG/DigiLocker integrations).

## Commands

All commands run from `frontend/`:

```bash
npm install
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # tsc -b (type check) + vite build
npm run lint      # oxlint (config: .oxlintrc.json)
npm run preview   # serve the production build
```

There is no test framework set up. `npm run build` is the type check.

Stack: React 19, TypeScript 6, Vite 8, `lucide-react` for icons. No router, state library or CSS framework.

## Architecture

- **No router.** `src/App.tsx` holds `activeTab: NavTab` and conditionally renders a page from `src/pages/`. To add a page: extend `NavTab` in `src/types/index.ts`, add an entry to `navItems` in `components/Sidebar.tsx`, and add a branch in `App.tsx`. Sidebar order: Home, News & Updates, Explore Schemes, Eligibility Checker, Document Library, Saved Schemes, Settings, with My Profile pinned at the bottom. There is no separate Ask Vaidha tab; the chat lives on Home.
- **Responsive shell:** below 768px (`MOBILE_QUERY` in `App.tsx`) the sidebar becomes an off-canvas drawer opened from the menu button in `ChatHeader`.
- **All app state lives in `App.tsx`** and is passed down as props: chat messages, loading flag, saved scheme IDs, bookmarked news IDs, user profile, language, text size. Saved schemes, bookmarked news, profile and text size persist to `localStorage` (`vaidha_saved_schemes`, `vaidha_bookmarked_news`, `vaidha_user_profile`, `vaidha_text_size`).
- **Language (English / Hindi / Marathi)** translates the whole UI and is persisted as `vaidha_language`. `App.tsx` provides it through `LanguageContext` (`src/i18n.ts`); components call `const t = useT()` and wrap every visible string, `title`, `aria-label`, `placeholder` and chat prompt in `t('English text')`. The English text is the key into `src/translations.ts` (`'English': ['हिन्दी', 'मराठी']`); missing keys fall back to English. Use `{name}` placeholders for values (`t('How do I apply for {name}?', { name })`), and translate data at render time (`t(scheme.benefit)`), never the stored values that filters compare against. When adding text, add its translation too. Live news headlines stay in their source language; dates go through `useFormatDate()`. The selected language is also sent to the model (Groq) so answers come back in it.
- **Text size** (Settings page) scales the whole app with CSS `zoom` on the root container, because sizes are hard-coded in px. The container's width/height are divided by the same factor so it still fills the window. Scale factors live in `src/utils/textSize.ts`.
- **Every page funnels into the chat.** Pages receive callbacks like `onAskScheme` / `onAskDoc` / `onCheckCriteria` that switch to the `home` tab and call `handleSendMessage(text)`. The welcome screen's image cards (`components/ImageCard.tsx`, photos in `public/assets/`) and quick prompts either send a prompt or navigate via `onNavigateTab`.
- **Chat → Groq:** `handleSendMessage` calls `askVaidha()` in `src/utils/chatApi.ts`, which POSTs the message, prior turns and selected language to `/api/chat` (proxied to the FastAPI backend by `vite.config.ts`). It never throws; failures come back as an assistant message explaining the problem. Answers use a small markdown subset (`###`, `####`, numbered items, `-` bullets, `**bold**`, `[text](https://…)`) rendered by `MessageBubble`, which HTML-escapes the text before adding `<strong>`/`<a>` — keep that escaping, since the content comes from the model. `src/utils/responseEngine.ts` now only holds welcome-screen data (image cards, quick prompts).
- **Mock data:** `src/data/mockData.ts` (`SCHEMES_DATA`, `MOCK_NEWS_DATA`, `USER_PROFILE_DEFAULT`). News goes through `src/utils/newsService.ts` (`NewsService.getNews/getNewsById`, async), which is intended to be swapped for a future `GET /api/news` without UI changes.
- **Styling:** almost entirely inline `style={{...}}` objects referencing CSS custom properties defined in `src/index.css` (`--sidebar-*`, `--brand-*` such as `--brand-sun` red and `--brand-parchment` warm white, `--workspace-*`, `--shadow-*`, `--font-sans`/`--font-heading`). Keep the warm white and red palette; use these tokens rather than new hard-coded colors.
- **Unused files:** `components/Composer.tsx`, `components/ConversationView.tsx`, `components/VaidhaLogo.tsx`, `components/SuggestionCard.tsx` and `src/App.css` are not imported anywhere. The live chat UI is `Home` → `WelcomeScreen` (image cards + suggested questions) / `MessageBubble` / `ChatComposer`.

## Document Library

`src/pages/DocumentLibrary.tsx` lists the documents in `src/data/documents.ts` (27 documents that can be applied for online: who issues them, official portal, who can apply, papers needed, steps, tip). Hindi/Marathi text for the guides is in `src/data/documentTranslations.ts`, typed by `DocumentId` so every document needs both translations; the page's own labels go through `t()` and `src/translations.ts` like the rest of the UI. Only link official `gov.in` / `nic.in` portals, and check each URL loads. Fees and processing times are deliberately left out because they change; guides point to the portal instead.

Each card shows `public/assets/documents/<id>.jpg` (the file name is the document `id`). Until a picture exists the card shows a placeholder icon. The pictures are made with Nano Banana in the Gemini web app (the API key's free tier has no image quota), using one shared style so they match:

> A friendly, flat, illustrated (cartoon-style) picture of an Indian <document name> lying on a warm parchment-coloured background (#faf8f5) with soft terracotta-red accents (#d9482b). Clearly a stylised illustration, with the word SPECIMEN across it. No real names, numbers, photos of real people, QR codes, signatures, government emblems or seals. Landscape 4:3.

The "no real details, SPECIMEN" rule keeps the pictures recognisable without looking like usable ID documents. Save each as JPEG, about 640px wide and under 100 KB (`sips -Z 640 -s format jpeg -s formatOptions 70 in.png --out <id>.jpg`).

## Eligibility checker (RAG)

- **Shared data:** schemes and document guides live in `frontend/src/data/schemes.json` and `documents.json`. The frontend imports them through `schemes.ts` / `documents.ts` (which keep the TypeScript types); the backend reads the same files. Edit the JSON, not a copy.
- **Flow:** `pages/EligibilityChecker.tsx` sends a structured profile (state, age, gender, income bracket, category, occupation, yes/no facts) via `utils/eligibilityApi.ts` to `POST /api/eligibility`. The backend (`backend/main.py`) turns it into a plain-language description, retrieves the closest schemes and then the document guides closest to those schemes' required papers (`backend/rag.py`), and asks the Groq model to judge each retrieved scheme only from those records (likely / maybe / unlikely, reason, things to confirm, papers, matching document guide ids, steps). Unknown scheme or document ids from the model are dropped.
- **Retrieval:** one chunk per scheme or guide, ranked with in-memory BM25 keyword scoring (Groq has no embeddings API, and the corpus is small); the index rebuilds automatically when the JSON files change. The scheme query is `search_terms()` in `main.py`: only distinctive profile keywords, because generic words like "income" swamp keyword ranking. State-level schemes in the data are Maharashtra schemes, so they are excluded for other states.
- Results live in `App` state (`eligibilitySession`) so they survive opening a document guide, which deep-links via `DocumentLibrary`'s `initialOpenId`.

## Login (mobile number + password)

- **Flow:** `App.tsx` checks `GET /api/auth/me` on load (it returns `null` when logged out). Logged out → `pages/Login.tsx`, which opens on Register for a first visit and on Log in once this device has been used (`vaidha_has_account` in localStorage). A new account → `pages/Onboarding.tsx` (full name, gender, age, state, district, preferred language) once; then the app. Login is required for the whole UI. The account's language and details are applied through `applyAccount`, which also fills My Profile; changing the language in Settings (or name/state/district in My Profile) saves it to the account. Settings has the Log out button.
- **Backend:** `backend/auth.py` (router included in `main.py`): `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`, `PUT`/`PATCH /api/account`. Stored in SQLite through `libsql`: locally at `backend/vaidha.db` (git-ignored), or in a Turso database when `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` are set (needed on Vercel). Passwords (min 8 characters) are hashed with scrypt; login is rate-limited per number and per visitor, and a wrong password and an unknown number get the same message and timing. Sessions are random tokens in an HttpOnly `vaidha_session` cookie (30 days), stored only as hashes. Accounts created by the earlier OTP login have no password; registering with that number sets one.
- There is no "forgot password" yet (it needs a way to prove who you are, such as SMS or email).
- The chat, eligibility and news APIs don't check the session themselves; login is enforced by the UI.

## Backend

`backend/main.py` is a FastAPI app with `POST /api/chat` and `GET /api/health`. It calls Groq's OpenAI-compatible chat API over `httpx` (`generate()`, no SDK) with a system prompt and a JSON schema from the Pydantic model (`ChatReply` → `content`, `citations`, `followUps`), validated on return, low reasoning effort for speed, and tries models in order (`GROQ_MODEL`, default `openai/gpt-oss-120b`, then `GROQ_FALLBACK_MODELS`, default `openai/gpt-oss-20b,qwen/qwen3.8-27b`) when one returns 5xx/429, times out, or returns invalid JSON. Each model has its own free-tier quota (8,000 tokens/minute), so the chain stretches capacity.

```bash
cd backend && .venv/bin/uvicorn main:app --reload --port 8000   # run alongside `npm run dev`
```

To keep answers current, the system instruction carries today's date in India, and the newest `NEWS_HEADLINES_IN_PROMPT` headlines from the news cache go into the latest user turn as a fenced `NEWS HEADLINES` data block (`news_context()`). Headlines come from outside publishers, so they stay out of the system instruction, are flattened by `clean_text()` and filtered with `looks_like_injection()`. A chat waits at most `NEWS_CONTEXT_TIMEOUT_S` for them and answers without headlines if the feed is slow or failing. There is no web search: Google Search grounding needs a paid key, so scheme facts otherwise come from the model's training.

`GET /api/news` serves live news from Google News RSS (one search per News page category in `NEWS_QUERIES`), cached in memory for 15 minutes.

Guardrails live in `backend/guardrails.py` (self-check: `python guardrails.py`): per-IP and global sliding-window rate limits (`CHAT_LIMITS`, `NEWS_LIMITS` in `main.py`, answered with 429 + `Retry-After`), Aadhaar/PAN/phone/bank/OTP/email redaction before text reaches the model and on the reply, a keyword prompt-injection check that returns a fixed refusal without calling the model, and `strip_unofficial_links` so only https links to `OFFICIAL_DOMAINS` stay clickable. Rate limits are in-memory per process.

`backend/.venv` is a Python 3.12 virtualenv (created with `uv`) from `backend/requirements.txt`. The key goes in `backend/.env` as `GROQ_API_KEY` (see `.env.example`; `.env` and `.venv` are git-ignored). Free-tier quotas are small, which is why the fallback chain exists.

## Deploy (Vercel, free tier)

One Vercel project from the repo root: `vercel.json` builds `frontend/` as static files and rewrites `/api/*` to `api/index.py`, which serves `backend/main.py` as a Python function (behind `ProxyHeadersMiddleware` so rate limits see the visitor IP). Python deps are in the root `requirements.txt` (Vercel can't read `-r`; `backend/requirements.txt` includes it). Vercel has no lasting disk, so accounts go to Turso. Env vars on Vercel: `GROQ_API_KEY`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`. `.vercelignore` keeps `.env` and `*.db` out of CLI uploads. Rate limits and the news cache are per function instance.
