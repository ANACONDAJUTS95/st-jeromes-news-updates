# Setup Guide: Automated Facebook-to-Website News Pipeline

This guide covers the non-code steps required to activate the automated news pipeline.

---

## Step 1: Get a Gemini API Key (Free)

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **"Get API Key"** in the top menu.
4. Create a new API key (or use an existing one).
5. Copy the key — you will paste it into GitHub Secrets later.

> The Gemini 1.5 Flash free tier allows **15 requests per minute** and **1,500 requests per day** — more than enough for a 2-hour sync schedule.

---

## Step 2: Create an RSS Feed from Your Facebook Page

Since we do not have admin access to the Facebook page, we use a third-party tool to convert public posts into an RSS feed.

### Option A: PolitePol (Recommended — Easiest)

1. Go to [PolitePol.com](https://politepol.com/).
2. Create a free account.
3. Click **"Create Feed"**.
4. Enter your school's public Facebook page URL (e.g., `https://www.facebook.com/StJeromesAcademy`).
5. Use the visual selector tool to click on:
   - **Post container** (the box that wraps each post)
   - **Title / text** (the post message)
   - **Date** (the timestamp)
6. Click **"Generate Feed"**.
7. Copy the RSS Feed URL (looks like `https://politepol.com/fd/abcd1234`).

### Option B: Inoreader (More Robust)

1. Go to [Inoreader.com](https://www.inoreader.com/) and create a free account.
2. Click the **"+"** button to add a new feed.
3. Enter the Facebook page URL.
4. Inoreader will attempt to generate an RSS feed automatically.
5. Copy the feed URL from your subscription.

> **Note:** Facebook frequently changes its HTML structure. If PolitePol stops working, re-run the selector setup or switch to Inoreader.

---

## Step 3: Add GitHub Secrets

The GitHub Action needs access to your API keys and RSS URL. These are stored as **encrypted secrets** in your repository.

1. Open your repository on GitHub.
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Click **"New repository secret"** and add each of the following:

| Secret Name | Value |
| :--- | :--- |
| `RSS_FEED_URL` | The RSS feed URL from Step 2 |
| `GEMINI_API_KEY` | The API key from Step 1 |
| `WEBHOOK_URL` | *(Optional)* Only if you want the Action to POST to the live API instead of committing files. Leave blank for the default file-commit method. |
| `WEBHOOK_API_KEY` | *(Optional)* A random strong password (e.g., `sk-jerome-2026-x7k9m2p`). Only needed if using `WEBHOOK_URL`. |

4. Click **Add secret** for each one.

> **Security tip:** Never commit API keys directly into code. Always use GitHub Secrets.

---

## Step 4: Test the Pipeline Manually

Before waiting for the 2-hour CRON schedule, trigger the workflow manually to verify everything works.

1. On GitHub, go to the **Actions** tab in your repository.
2. Click **"Sync Facebook News"** in the left sidebar.
3. Click the **"Run workflow"** button → then click **"Run workflow"** again.
4. Watch the logs. You should see:
   - `📡 Fetching RSS: ...`
   - `📰 Found X items in feed.`
   - `✨ Y new items to process.`
   - `✅ Saved: [Article Title]`
5. After it completes, check your repository:
   - New `.json` files should appear in `content/news/`.
   - `data/processed_ids.json` should contain hashes.

---

## Step 5: Verify Articles Appear on the Website

1. Pull the latest changes locally:
   ```bash
   git pull origin main
   ```
2. Run the dev server:
   ```bash
   pnpm dev
   ```
3. Visit `http://localhost:3000/news` — the synced articles should appear in the list.
4. Click an article to view its detail page.

---

## Step 6: Deploy to Production

1. Push all code changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: automated news pipeline"
   git push origin main
   ```
2. If deploying to **Vercel**, connect your GitHub repo and deploy.
3. The GitHub Action will continue running every 2 hours automatically.
4. Each time new articles are synced, they are committed to the repo.
5. Vercel will auto-deploy on every commit (if enabled).

> **For static hosting (no server):** The file-commit method works perfectly. Articles are committed as JSON files and included in the next static build.
>
> **For serverless hosting (Vercel):** You can optionally set `WEBHOOK_URL` to your production `/api/news/import` endpoint so articles appear instantly without waiting for a rebuild.

---

## Troubleshooting

| Problem | Solution |
| :--- | :--- |
| RSS feed returns no items | Check that the Facebook page is **public**. Private pages cannot be scraped. Re-run the PolitePol selector setup. |
| Gemini API quota exceeded | The free tier resets daily. Wait 24 hours or check your usage at [Google AI Studio](https://aistudio.google.com/). |
| Articles not showing on site | Make sure `pnpm dev` or `pnpm build` is run after syncing. The site reads articles at build/dev time. |
| Duplicate articles | The script uses SHA-256 hashing of the post URL to deduplicate. If a post URL changes slightly, it may be processed twice. This is harmless. |
| GitHub Action fails | Check the **Actions** tab for the error log. Most failures are due to missing secrets or RSS feed being unreachable. |

---

## Architecture Summary

```
Facebook Page (Public)
       │
       ▼
PolitePol / Inoreader  ──►  RSS Feed URL
       │
       ▼
GitHub Actions (Every 2 hours)
       │
       ├── Fetch RSS
       ├── Check for new posts
       ├── Send to Gemini AI (transform to article)
       └── Commit JSON file to repo
       │
       ▼
Next.js Website
       │
       ├── Reads JSON files at build time
       └── Displays articles on /news and /
```

**Total cost: $0.00**
