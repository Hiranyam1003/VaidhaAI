# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **Text size** (Settings page) scales the whole app with CSS `zoom` on the root container, because sizes are hard-coded in px. The container's width/height are divided by the same factor so it still fills the window. Scale factors live in `src/utils/textSize.ts`.
- **Every page funnels into the chat.** Pages receive callbacks like `onAskScheme` / `onAskDoc` / `onCheckCriteria` that switch to the `home` tab and call `handleSendMessage(text)`. The welcome screen's image cards (`components/ImageCard.tsx`, photos in `public/assets/`) and quick prompts either send a prompt or navigate via `onNavigateTab`.
- **Chat → Gemini:** `handleSendMessage` calls `askVaidha()` in `src/utils/chatApi.ts`, which POSTs the message, prior turns and selected language to `/api/chat` (proxied to the FastAPI backend by `vite.config.ts`). It never throws; failures come back as an assistant message explaining the problem. Answers use a small markdown subset (`###`, `####`, numbered items, `-` bullets, `**bold**`, `[text](https://…)`) rendered by `MessageBubble`, which HTML-escapes the text before adding `<strong>`/`<a>` — keep that escaping, since the content comes from the model. `src/utils/responseEngine.ts` now only holds welcome-screen data (image cards, quick prompts).
- **Mock data:** `src/data/mockData.ts` (`SCHEMES_DATA`, `MOCK_NEWS_DATA`, `USER_PROFILE_DEFAULT`). News goes through `src/utils/newsService.ts` (`NewsService.getNews/getNewsById`, async), which is intended to be swapped for a future `GET /api/news` without UI changes.
- **Styling:** almost entirely inline `style={{...}}` objects referencing CSS custom properties defined in `src/index.css` (`--sidebar-*`, `--brand-*` such as `--brand-sun` red and `--brand-parchment` warm white, `--workspace-*`, `--shadow-*`, `--font-sans`/`--font-heading`). Keep the warm white and red palette; use these tokens rather than new hard-coded colors.
- **Unused files:** `components/Composer.tsx`, `components/ConversationView.tsx`, `components/VaidhaLogo.tsx`, `components/SuggestionCard.tsx` and `src/App.css` are not imported anywhere. The live chat UI is `Home` → `WelcomeScreen` (image cards + suggested questions) / `MessageBubble` / `ChatComposer`.

## Backend

`backend/main.py` is a FastAPI app with `POST /api/chat` and `GET /api/health`. It calls Gemini (`google-genai`) with a system prompt and structured JSON output (`ChatReply` → `content`, `citations`, `followUps`), low thinking level for speed, and tries models in order (`GEMINI_MODEL`, default `gemini-3.1-flash-lite`, then `GEMINI_FALLBACK_MODELS`) when one returns 5xx, times out, or hits its 429 quota. The SDK's own retries are disabled so a busy model fails over quickly.

```bash
cd backend && .venv/bin/uvicorn main:app --reload --port 8000   # run alongside `npm run dev`
```

`backend/.venv` is a Python 3.12 virtualenv (created with `uv`) from `backend/requirements.txt`. The key goes in `backend/.env` as `GEMINI_API_KEY` (see `.env.example`; `.env` and `.venv` are git-ignored). Free-tier quotas are small (for example 5 requests/minute on some models), which is why the fallback chain exists.
