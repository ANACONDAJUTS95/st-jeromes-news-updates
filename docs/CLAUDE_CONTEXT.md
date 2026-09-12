# Claude Context — Jeromian Voice / St. Jerome's News Updates

This is the reference doc for what this project is, how it's built, and what "good" looks like here. Read this before doing substantial work, alongside `CLAUDE.md` (root) and `docs/DESIGN.md`.

## What this is

**Jeromian Voice** is an AI-powered digital news platform for St. Jerome's Academy. It watches the school's public Facebook page, turns raw posts into editorial-style news articles using Google Gemini, and publishes them on a Next.js site styled like a scholarly newspaper archive rather than a typical SaaS app.

The whole point of the automation is: staff don't have to manually write up every Facebook announcement as a news article — the pipeline scrapes, rewrites, and republishes it.

## How data flows

```
Facebook Page (public posts)
    └─► GitHub Actions (news-sync.yml) — scheduled every 3 days, or manual dispatch,
        or repository_dispatch triggered by POST /api/news/sync
            └─► scripts/sync-news.js
                    - Playwright launches an authenticated browser context and scrapes posts
                    - Each post's image is downloaded through that SAME browser context
                      (cookies/referrer intact) — never a blind server-to-server fetch,
                      since Facebook's hotlink protection rejects those
                    - Image bytes are uploaded to Cloudinary for permanent hosting
                    - Gemini rewrites the raw post text into an editorial article
                    - Result is written to Firestore `articles` collection
                            └─► Next.js reads Firestore via lib/articles.ts
                                    └─► Pages render with ISR, revalidated via /api/revalidate
```

Key non-obvious details:
- **Stable IDs**: posts are deduped by a hash (`stableId()`); a prior bug hashed only the first 300 chars of text, so posts sharing boilerplate openers (rally cries, "SPORTS|" templates) collided and got silently skipped. This was fixed — if sync ever "misses" a real new post again, this hashing logic is the first place to check.
- **Images never silently drop**: if the authenticated-context buffer upload to Cloudinary fails, it falls back to a remote-fetch upload, and only as a last resort keeps the raw (expiring) `fbcdn` URL. If `CLOUDINARY_CLOUD_NAME` isn't set, all images end up as raw fbcdn URLs that expire.
- **Repairing broken images**: run `node scripts/repair-images.js` (re-visits `originalUrl`, re-downloads, re-uploads to Cloudinary). Do **not** run `scripts/clear-expired-images.js` for this — it wipes the `image` field instead of fixing it (kept only for reference/rollback, not a repair tool).

## Stack

- Next.js 16 (App Router), React 19, Tailwind v4, TypeScript
- Firebase: client SDK (`lib/firebase.ts`) for Auth + reads, Admin SDK (`lib/firebase-admin.ts`) for privileged server-side operations
- Firestore as the database (no separate backend/API server beyond Next.js route handlers)
- Google Gemini (`@google/genai`) for post → article rewriting
- Playwright (Chromium) for scraping — installed via `--with-deps` in CI since it needs system deps
- Cloudinary for permanent image hosting
- pnpm — **never npm/yarn** in this repo

## Directory map

| Path | Purpose |
|---|---|
| `app/` | Next.js App Router pages + API routes |
| `app/page.tsx` | Homepage |
| `app/news/page.tsx`, `app/news/[id]/` | News listing + article detail (`ArticleClient.tsx` is the client half) |
| `app/archives/page.tsx` | Archive view of past articles |
| `app/sections/[section]/page.tsx` | Category/section-filtered views |
| `app/spotlight/`, `app/gallery/`, `app/literary-folio/`, `app/about/` | Other editorial sections |
| `app/admin/`, `app/admin/AdminClient.tsx` | Admin dashboard (manual sync trigger, delete articles) |
| `app/login/page.tsx` | Firebase Google OAuth login |
| `app/api/news/sync/route.ts` | Admin-only: dispatches GitHub Actions `sync-news` event |
| `app/api/news/import/route.ts` | Webhook ingest endpoint, `x-api-key` auth |
| `app/api/news/[id]/route.ts` | Admin-only delete |
| `app/api/revalidate/route.ts` | ISR revalidation, secret query param |
| `app/api/auth/check-admin/route.ts` | Checks Firestore `admins` collection for a UID |
| `app/api/admin/test-connection/route.ts` | Connectivity/debug check |
| `components/Masthead.tsx` | Site header, styled like a newspaper masthead |
| `components/SectionsCarousel.tsx`, `components/Footer.tsx` | Shared layout pieces |
| `lib/firebase.ts` | Client-side Firebase (Firestore + Auth) |
| `lib/firebase-admin.ts` | Server-side Admin SDK; parses `FIREBASE_SERVICE_ACCOUNT`, fixes escaped `\n` in the PEM private key |
| `lib/articles.ts` | Firestore queries: `getAllArticles`, `getArticleById`, `getArticleBySlug` |
| `hooks/useAuth.ts` | Firebase Google OAuth + admin-role check against Firestore |
| `scripts/sync-news.js` | Standalone Node script run by GitHub Actions — the actual scrape+transform pipeline |
| `scripts/repair-images.js` | Re-fetches and re-uploads images for articles with broken/expired image URLs |
| `scripts/migrate-images.js`, `scripts/clear-expired-images.js` | One-off/legacy image migration scripts — clear-expired wipes rather than fixes, avoid unless intentionally clearing |
| `docs/DESIGN.md` | "Scholarly Archive" design system — **read before any UI work** |
| `docs/QA_AUDIT.md` | Living audit of where the current UI deviates from `DESIGN.md`, with a prioritized fix list |

## Auth model

Three distinct auth patterns depending on the route type — see root `CLAUDE.md` for the exact mechanics:
- **Admin routes** — Firebase Bearer token, then `admins/{uid}` Firestore doc check (`{role: "admin"}`). No self-service UI to add admins; it's a manual Firestore write.
- **Webhook** (`/api/news/import`) — `x-api-key` header vs `WEBHOOK_API_KEY`.
- **Revalidation** — secret query param vs `REVALIDATE_SECRET`.

## Design system — "Scholarly Archive"

This is the most important non-code-derivable context for any frontend work. Full spec in `docs/DESIGN.md`; summary:

- **North star**: "The Digital Curator" — an editorial broadsheet feel, not a SaaS dashboard. Intentional asymmetry over centered grids.
- **Palette**: Ink `#592100` (primary), warm brown `#9b4500` (secondary/CTA), parchment `#fff9ec` (surface/background), text `#201c02` — **never pure black**.
- **No 1px lines rule**: no plain borders/dividers for sectioning. Use tonal surface shifts (`surface` → `surface-container-low` → `surface-container-lowest`) and whitespace (32–48px) instead of `<hr>` or grey divider lines.
- **Shadows are brown-tinted** ("Academic Shadows"): `0 12px 32px rgba(89, 33, 0, 0.08)` — not generic grey `shadow-xl`.
- **Typography**: Newsreader/Crimson Pro for display & headlines (tight tracking, mastheads); Inter for body/labels (labels in all-caps, +5% tracking).
- **Glassmorphism**: floating nav/search uses `surface_container_low` at 80% opacity + 24px backdrop blur (not 8px `blur-md`).
- **Rounding**: standard is `sm` (0.125rem, "printed" feel); `xl` (0.75rem) is the max, reserved mostly for pill-shaped labels.
- **Gold accent** (`#FDE68A`) used sparingly as a 1px highlight (blockquote edge, "Featured" top border) — not a general accent color.

**Important**: `docs/QA_AUDIT.md` documents that the current implementation still deviates from this spec in places (grey `border-white/10` dividers, standard grey shadows, blur-md instead of 24px, inconsistent rounding). Treat `DESIGN.md` as the target, `QA_AUDIT.md` as the known gap list — check it before assuming existing UI code is already "correct" per the design system.

There's also a separate `design-system/st.-jerome's-news-updates/MASTER.md` (auto-generated by a design tool) with a *different* palette (editorial black `#18181B` + pink `#EC4899` CTA, "Exaggerated Minimalism" style). This conflicts with `docs/DESIGN.md`. **`docs/DESIGN.md` (Scholarly Archive) is the authoritative, hand-written design system for this project** — the MASTER.md file appears to be generic scaffolding from a design-system generator and should not be followed for this project's actual UI unless the user says otherwise.

## Environment variables

See root `CLAUDE.md` for the full list (client Firebase config, server-side `FIREBASE_SERVICE_ACCOUNT`/`GEMINI_API_KEY`/`WEBHOOK_API_KEY`/`WEBHOOK_URL`/`REVALIDATE_SECRET`/Cloudinary keys, plus GitHub Actions secrets and `GITHUB_PAT` for dispatching sync).

## Firestore schema

- **`articles`**: `id`, `title`, `slug`, `content`, `excerpt`, `image`, `category`, `timestamp`, `originalUrl`, `syncedAt`, `credits`
- **`admins`**: doc ID = Firebase UID, fields `{role: "admin"}`

## Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Special note on this Next.js version

`AGENTS.md` at the repo root warns this Next.js version has breaking changes vs. training data — check `node_modules/next/dist/docs/` before writing Next.js-specific code (routing, data fetching, config) and heed deprecation notices there.
