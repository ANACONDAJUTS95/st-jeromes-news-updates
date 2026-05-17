# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

**Jeromian Voice** — an AI-powered digital news platform for St. Jerome's Academy. It scrapes the school's Facebook page via Playwright, transforms posts into editorial articles using Google Gemini, stores them in Firestore, and serves them through a Next.js frontend with an editorial broadsheet aesthetic.

## Commands

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint (eslint@9 flat config)
```

> This project uses **pnpm**. Do not use `npm` or `yarn`.

## Architecture

### Data Flow

```
Facebook Page (public posts)
    └─► GitHub Actions (news-sync.yml)  ← triggered by schedule / /api/news/sync POST
            └─► scripts/sync-news.js (Playwright scrape → Gemini AI transform)
                    └─► Firestore `articles` collection
                            └─► Next.js pages via lib/articles.ts
```

### Key Directories

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router — pages + API routes |
| `app/api/news/` | `sync` (trigger GitHub Actions), `import` (webhook ingest), `[id]` (delete) |
| `app/api/revalidate/` | ISR revalidation endpoint |
| `lib/firebase.ts` | Client-side Firebase (Firestore + Auth) |
| `lib/firebase-admin.ts` | Server-side Admin SDK — handles PEM key parsing from `FIREBASE_SERVICE_ACCOUNT` JSON string |
| `lib/articles.ts` | Firestore queries (`getAllArticles`, `getArticleById`, `getArticleBySlug`) |
| `hooks/useAuth.ts` | Firebase Google OAuth hook + admin role check against Firestore `admins` collection |
| `scripts/sync-news.js` | Standalone Node.js sync script run by GitHub Actions |
| `docs/DESIGN.md` | "Scholarly Archive" design system — read this before touching UI |

### API Route Auth Pattern

- **Admin routes** (`/api/news/sync`, `/api/news/[id]` DELETE): verify Firebase Bearer token, then check `admins/{uid}` doc in Firestore.
- **Webhook** (`/api/news/import`): API key via `x-api-key` header, matched against `WEBHOOK_API_KEY` env var.
- **Revalidation** (`/api/revalidate`): secret query param matched against `REVALIDATE_SECRET`.

### Admin Role

Admin users must exist in the Firestore `admins` collection with a `{role: "admin"}` document. This is a manual setup step — there is no UI to add admins from the app itself.

## Environment Variables

**Client-side** (must be set in Vercel + local `.env.local`):
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

**Server-side only**:
```
FIREBASE_SERVICE_ACCOUNT    # Full service account JSON as a single string; lib/firebase-admin.ts auto-fixes PEM newlines
GEMINI_API_KEY
WEBHOOK_API_KEY
WEBHOOK_URL
REVALIDATE_SECRET
```

**GitHub Actions secrets** (for the sync pipeline):
```
FB_URL                      # Public Facebook page URL to scrape
GEMINI_API_KEY
WEBHOOK_URL
WEBHOOK_API_KEY
FIREBASE_SERVICE_ACCOUNT
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

A `GITHUB_PAT` (Personal Access Token) is also needed in server env for `/api/news/sync` to dispatch the `sync-news` repository_dispatch event.

## Design System

The UI follows the **"Scholarly Archive"** design system documented in `docs/DESIGN.md`. Key rules:

- **Colors**: Ink primary `#592100`, parchment background `#fff9ec`, text `#201c02` (never pure black)
- **Typography**: Newsreader (serif, headlines) + Inter (sans, body/labels)
- **Layout**: Intentional asymmetry; avoid rigid equal-column grids
- **No 1px borders** — use tonal shifts and whitespace instead
- **Glassmorphism** for floating UI: 80% opacity + 24px blur
- Custom utility classes like `text-headline-lg`, `text-label-caps`, `text-body-editorial` are defined in `globals.css`

## Firebase Admin Key Parsing

`lib/firebase-admin.ts` expects `FIREBASE_SERVICE_ACCOUNT` as a JSON string where the `private_key` field may have literal `\n` sequences (common when setting secrets in CI). The file handles this by replacing `\\n` → `\n` before constructing the credential. If auth errors appear, check that the JSON string is not double-escaped.

## Firestore Schema

**`articles`** collection fields: `id`, `title`, `slug`, `content`, `excerpt`, `image`, `category`, `timestamp`, `originalUrl`, `syncedAt`, `credits`

**`admins`** collection: documents keyed by Firebase UID, each with `{role: "admin"}`

## GitHub Actions

`.github/workflows/news-sync.yml` runs `scripts/sync-news.js` on a 3-day schedule, on manual dispatch, or when triggered via `repository_dispatch` (event type `sync-news`) from `/api/news/sync`. The script requires Playwright Chromium, which the workflow installs via `npx playwright install chromium --with-deps`.
