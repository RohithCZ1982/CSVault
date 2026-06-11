# CS Vault — Claude Code Guide

## Project Overview

CS Vault is a full-stack web application for Company Secretary (CS) students in India. It covers ICSI Foundation, Executive, and Professional levels with AI-powered study tools, practice tests, compliance simulators, and document templates.

## Architecture

```
CSVault/
├── client/          # React 18 + TypeScript + Vite frontend (port 5173)
├── server/          # Express + Prisma + SQLite backend (port 3001)
└── package.json     # Root workspace config (npm workspaces)
```

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, TanStack Query v5, Zustand, React Router v6, Recharts, Lucide React, Axios

**Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite, JWT (jsonwebtoken), bcryptjs, Zod, Anthropic SDK

## Development Commands

```bash
# Install all dependencies (from root)
cd client && npm install
cd ../server && npm install

# Run both servers concurrently
npm run dev                    # from root (uses concurrently)

# Or run individually
cd server && npm run dev       # Express API on :3001
cd client && npm run dev       # Vite dev server on :5173

# Database
cd server
npx prisma generate            # regenerate Prisma client after schema changes
npx prisma db push             # sync schema to SQLite (no migrations)
DATABASE_URL="file:/home/user/CSVault/server/prisma/dev.db" npx tsx prisma/seed.ts  # reseed

# TypeScript checks
cd client && npx tsc --noEmit
cd server && npx tsc --noEmit
```

## Environment Variables

### `server/.env`
```
DATABASE_URL="file:/home/user/CSVault/server/prisma/dev.db"
JWT_SECRET="csvault_super_secret_key_2024_change_in_production"
PORT=3001
CLIENT_URL="http://localhost:5173"
ANTHROPIC_API_KEY=""           # Required for AI Assistant feature
```

The Vite dev server proxies `/api/*` → `http://localhost:3001` (configured in `client/vite.config.ts`).

## Database

- **Engine:** SQLite via Prisma
- **Location:** `server/prisma/dev.db`
- **Schema:** `server/prisma/schema.prisma`
- **Seed script:** `server/prisma/seed.ts` — populates 10 CS topics, 10 MCQ questions, 6 document templates

**Models:** User, Topic, Question, TestResult, TestResultItem, Progress, StudyPlan, ChatMessage, Document, Bookmark

Always use absolute path for `DATABASE_URL` when running seed from terminal (relative paths resolve differently from tsx vs prisma CLI).

## API Routes

All routes are prefixed with `/api/`:

| Route | Auth | Description |
|---|---|---|
| `POST /auth/register` | No | Create account |
| `POST /auth/login` | No | Login, returns JWT |
| `GET /auth/me` | Yes | Current user profile |
| `PUT /auth/profile` | Yes | Update name/level |
| `GET /topics` | Yes | List/search topics (`?search=&level=&subject=`) |
| `GET /topics/:id` | Yes | Single topic with user progress |
| `POST /topics/:id/bookmark` | Yes | Toggle bookmark |
| `GET /topics/bookmarks/all` | Yes | All user bookmarks |
| `GET /questions` | Yes | List questions (`?level=&subject=&type=&difficulty=`) |
| `GET /questions/random` | Yes | Random questions for test (`?count=&level=&subject=`) |
| `POST /tests/submit` | Yes | Grade test answers, save result |
| `GET /tests/history` | Yes | User's test history |
| `GET /tests/stats` | Yes | Aggregate stats (avg, best, by subject) |
| `POST /ai/chat` | Yes | Claude AI chat (requires `ANTHROPIC_API_KEY`) |
| `GET /ai/history` | Yes | Chat message history |
| `DELETE /ai/history` | Yes | Clear chat history |
| `POST /ai/explain-section` | Yes | Explain a specific law section |
| `GET /documents` | Yes | List templates (`?category=`) |
| `GET /documents/:id` | Yes | Single document template |
| `GET /progress` | Yes | All user topic progress |
| `POST /progress/:topicId` | Yes | Upsert topic progress status |
| `GET /progress/summary` | Yes | Progress counts and avg score |
| `GET /study-plan` | Yes | Weekly plans (`?week=ISO_DATE`) |
| `POST /study-plan` | Yes | Add study session |
| `PUT /study-plan/:id/complete` | Yes | Mark session complete |
| `DELETE /study-plan/:id` | Yes | Delete session |

## Frontend Pages & Components

### Pages (`client/src/pages/`)
- `Landing.tsx` — Public marketing page
- `Auth.tsx` — Login/Register with JWT
- `Dashboard.tsx` — Overview, quick links, progress, recent updates
- `LawExplorer.tsx` — Search and filter CS topics
- `TopicDetail.tsx` — Full topic content with tabs (Plain English / Detailed / Keywords)
- `PracticeHub.tsx` — Subject selection, stats, test history
- `MockTest.tsx` — Live timed MCQ test with review
- `AIAssistant.tsx` — Claude-powered CS chat interface
- `Documents.tsx` — Template browser with preview and download
- `StudyPlanner.tsx` — Weekly calendar planner
- `ComplianceSimulator.tsx` — Scenario-based interactive checklists
- `Profile.tsx` — User profile, score charts, achievements

### Components (`client/src/components/`)
- `Layout.tsx` — App shell with sidebar + header
- `Sidebar.tsx` — Collapsible nav with mobile overlay
- `Header.tsx` — Top bar with page title and user avatar

### State Management
- `src/store/authStore.ts` — Zustand store with localStorage persistence (user + token)
- `src/utils/api.ts` — Axios instance with JWT interceptor and 401 redirect

## Auth Flow

1. User registers/logs in → backend returns `{ user, token }`
2. Token stored in Zustand + localStorage via `persist` middleware
3. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
4. On 401 response, interceptor calls `logout()` and redirects to `/auth`
5. `ProtectedRoute` in `App.tsx` checks token existence

## AI Assistant

Uses `claude-haiku-4-5-20251001` with a detailed system prompt (`CS_SYSTEM_PROMPT` in `server/src/routes/ai.ts`) tuned to:
- Companies Act 2013, SEBI regulations, IBC, FEMA
- ICSI syllabus across all three levels
- Drafting board resolutions, notices, minutes

Requires `ANTHROPIC_API_KEY` in `server/.env`. Returns graceful error if not configured.

## CS Domain Data Seeded

**Topics include:**
- Section 2 (Definitions), Section 96 (AGM), Section 135 (CSR), Section 149 (Board), Section 177 (Audit Committee), Section 185 (Loan to Directors), MOA, SEBI LODR, IBC Overview, Section 204 (Secretarial Audit)

**Document templates include:**
- Board Resolutions (CS appointment, bank account)
- AGM Notice, Board Meeting Minutes
- Annual Compliance Checklist
- Secretarial Audit Report (Form MR-3)

## Styling Conventions

- Dark theme only (`dark` class on `<html>`)
- Custom colors in `tailwind.config.js`: `dark-bg`, `dark-card`, `dark-border`, `dark-text`, `dark-muted`, `primary-*`, `gold-*`
- Reusable CSS classes in `index.css`: `.btn-primary`, `.btn-secondary`, `.card`, `.input`, `.badge`, `.badge-blue`, `.badge-gold`, `.badge-green`, `.badge-red`
- Animation utilities: `.animate-fade-in`, `.animate-slide-up`, `.text-gradient`

## Git Branch

Active development branch: `claude/cs-vault-app-wsp0sv`
