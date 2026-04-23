# Implementation Plan: Automated Facebook-to-Website News Pipeline

## Objective
Establish a 100% free, automated system to fetch posts from a public Facebook page (no admin access required), transform them into structured news articles using AI, and publish them to the website with a latency of 2-3 hours.

## Architecture Overview
1. **Data Source**: Public Facebook Page.
2. **Ingestion**: [PolitePol](https://politepol.com/) or [Inoreader](https://www.inoreader.com/) to generate an RSS feed from the public FB page.
3. **Processing Engine**: GitHub Actions (Running on a 2-hour CRON schedule).
4. **AI Transformation**: Google Gemini 1.5 Flash (Free Tier) to restructure raw text.
5. **Publishing Destination**: Next.js API route (`/api/news/import`).

---

## Component Details

### 1. Ingestion Layer (RSS Generation)
* **Goal**: Convert the visual Facebook page into a machine-readable format.
* **Tool**: PolitePol (recommended for ease of use).
* **Setup**:
    * Target the public Facebook URL.
    * Use the selector tool to pick the post container and the text/date elements.
    * Generate a unique RSS Feed URL.

### 2. Processing Layer (GitHub Actions)
* **Goal**: Fetch the RSS feed, detect new items, process them with AI, and push to the website.
* **Frequency**: `cron: "0 */2 * * *"` (Every 2 hours).
* **Workflow Steps**:
    * Check `feed.xml` for entries not yet processed (store processed IDs in a simple `processed_ids.txt` or use a tiny database/KV).
    * For each new entry:
        * Send `item.description` to Gemini API.
        * **Prompt**: `"Transform this Facebook post into a structured news article. Output JSON with fields: {title, slug, content, original_url, timestamp}."`
        * POST the JSON to the Website API.

### 3. Receiver Layer (Next.js API Route)
* **File**: `app/api/news/import/route.ts`
* **Security**: Validate a custom `X-API-KEY` header stored in environment variables.
* **Logic**:
    * Parse the incoming JSON.
    * Upsert into the database (e.g., using Prisma/Supabase).
    * Trigger a revalidation of the `/news` and `/` pages if using ISR.

---

## Environment Variables & Secrets

| Secret Name | Source | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) | For AI transformation (Free Tier). |
| `WEBHOOK_API_KEY` | Custom (Random String) | To authenticate the GitHub Action to the Website. |
| `RSS_FEED_URL` | PolitePol | The source of truth for new posts. |
| `SITE_URL` | Website URL | The destination for the POST request. |

---

## Implementation Steps for the Next Agent

### Step 1: Create the Next.js API Route
Build the `POST` handler at `app/api/news/import/route.ts`. Ensure it handles authentication and saves to the database correctly.

### Step 2: Set up the GitHub Action Script
Create a script (e.g., `scripts/sync-news.js`) that handles the RSS-to-AI-to-Website logic.
* Use `rss-parser` for feed reading.
* Use `@google/generative-ai` for Gemini integration.

### Step 3: Configure GitHub Workflow
Create `.github/workflows/news-sync.yml` with the CRON schedule and set up the necessary repository secrets.

### Step 4: Verification
1. Manually trigger the GitHub Action.
2. Monitor the logs for "Processed post: [Title]".
3. Check the website `/news` page to see if the article appeared.

## Potential Edge Cases
* **Post with only images**: AI should handle image-less posts gracefully or look for alt-text/captions.
* **Duplicate Posts**: Use the `original_url` or FB Post ID as a unique identifier in the database.
* **RSS Failures**: Log errors to GitHub Action logs for monitoring.
