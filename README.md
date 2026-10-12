# Vaidha AI (Virtual Assistant for Indian Documentation & High-level Administration)

An AI-powered citizen services assistant designed to help Indian citizens understand government schemes, check eligibility criteria, and discover required official documentation.

## Project Structure

```text
vaidha-ai/
├── frontend/                     # React + TypeScript + Vite UI Application
│   ├── public/
│   │   └── assets/
│   │       └── vaidha-logo.jpeg  # Official Vaidha brand emblem
│   ├── src/
│   │   ├── assets/               # Brand & graphics assets
│   │   ├── components/           # Modular UI components
│   │   │   ├── Sidebar.tsx       # Minimal icon-based navigation sidebar
│   │   │   ├── ChatHeader.tsx    # Clean header with identity & language control
│   │   │   ├── ChatComposer.tsx  # Persistent pill-shaped bottom composer
│   │   │   ├── WelcomeScreen.tsx # Centered welcome screen with actual logo
│   │   │   ├── SuggestionCard.tsx# Contextual prompt suggestion cards
│   │   │   └── MessageBubble.tsx # User and Assistant message blocks with citations
│   │   ├── pages/                # Functional navigation views
│   │   │   ├── Home.tsx          # Chat-first assistant workspace
│   │   │   ├── ExploreSchemes.tsx# Scheme discovery catalog
│   │   │   ├── EligibilityChecker.tsx # Interactive criteria checker
│   │   │   ├── DocumentLibrary.tsx# Verification checklist & formats
│   │   │   └── SavedSchemes.tsx  # Bookmark and tracked welfare schemes
│   │   ├── data/
│   │   │   └── mockData.ts       # Mock schemes, responses, and citations
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                      # Backend services and API specifications (Planned)
│   └── README.md
├── .gitignore
└── README.md
```

## Running the Application

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

The application runs locally at `http://localhost:5173/`.
