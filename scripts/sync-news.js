#!/usr/bin/env node
/**
 * News Sync Script (Playwright Version)
 * Scrapes Facebook public page using a headless browser,
 * transforms posts with Gemini AI, and writes articles.
 */

require('dotenv').config();

const { chromium } = require("playwright");
const { GoogleGenAI } = require("@google/genai");
const { v2: cloudinary } = require("cloudinary");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Config from environment
const FB_URL = process.env.FB_URL || "https://m.facebook.com/profile.php?id=61578775710364";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
// How many posts to scrape/process this run. Regular "sync with page" runs
// stay small (latest posts only); a one-time backfill can request more by
// setting SYNC_LIMIT (wired through from the admin dashboard's dispatch).
const SYNC_LIMIT = parseInt(process.env.SYNC_LIMIT, 10) || 3;
const SITE_URL = process.env.SITE_URL || "https://jeromian-voice.vercel.app";
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

// Cloudinary (free image hosting — replaces Firebase Storage)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log(`☁️  Cloudinary configured: ${process.env.CLOUDINARY_CLOUD_NAME}`);
} else {
  console.warn("⚠️  CLOUDINARY_CLOUD_NAME not set — images will use expiring fbcdn URLs.");
}

// Initialize Firebase Admin — hard-fail if credentials are missing or broken.
// Without Firebase Admin, articles cannot be saved and the run is pointless.
if (!FIREBASE_SERVICE_ACCOUNT) {
  console.error("❌ FATAL: FIREBASE_SERVICE_ACCOUNT env var is not set. Aborting.");
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    if (!serviceAccount.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
      serviceAccount.private_key = `-----BEGIN PRIVATE KEY-----\n${serviceAccount.private_key}`;
    }
    if (!serviceAccount.private_key.endsWith('-----END PRIVATE KEY-----')) {
      serviceAccount.private_key = `${serviceAccount.private_key}\n-----END PRIVATE KEY-----`;
    }
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized.");
  console.log(`   Project:  ${serviceAccount.project_id}`);
} catch (err) {
  console.error("❌ FATAL: Firebase Admin initialization failed:", err.message);
  console.error("   Check that FIREBASE_SERVICE_ACCOUNT is valid JSON with a correct private_key.");
  process.exit(1);
}

// Paths
const DATA_DIR = path.join(__dirname, "..", "data");
const NEWS_DIR = path.join(__dirname, "..", "content", "news");
const PROCESSED_IDS_PATH = path.join(DATA_DIR, "processed_ids.json");

/**
 * Stable ID: keyed on the post's text content, not its permalink. Facebook's
 * modern "pfbid" permalink tokens are wrapped per viewing session — the same
 * post gets a different URL on every anonymous scrape — so hashing the link
 * caused the same post to be re-saved as a new "duplicate" article each run.
 * The post's own text is what's actually stable across scrapes.
 *
 * Hash the FULL content, not a truncated prefix — school posts frequently
 * reuse identical boilerplate openers (rally cries, "SPORTS|" templates,
 * "Congratulations to..." intros), so a short prefix hash can collide
 * between two genuinely different posts and silently skip a new one as if
 * it were already saved.
 */
function stableId(item) {
  return hashId(item.content || item.link);
}

// Old (pre-fix) formula — only hashed the first 300 chars. Articles saved
// before this fix live under IDs computed this way; kept only so the
// duplicate check below still recognizes them and doesn't re-save them
// under their new full-content ID.
function legacyStableId(item) {
  return hashId((item.content || "").slice(0, 300) || item.link);
}

/**
 * Duplicate check by stable document ID. Also checks the legacy (truncated)
 * ID formula so posts saved before the full-content-hash fix aren't
 * mistaken for new posts and re-saved as duplicates.
 * Deleted articles return false → they will be re-created on the next sync.
 * This means admins can delete + resync to force a fresh fetch.
 */
async function existsInFirestore(id, legacyId) {
  if (!FIREBASE_SERVICE_ACCOUNT || !admin.apps.length) return false;
  try {
    const doc = await admin.firestore().collection("articles").doc(id).get();
    if (doc.exists) return true;
    if (legacyId && legacyId !== id) {
      const legacyDoc = await admin.firestore().collection("articles").doc(legacyId).get();
      if (legacyDoc.exists) return true;
    }
    return false;
  } catch (err) {
    console.warn(`⚠️ Firestore check error for ${id}:`, err.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Starting browser-based news sync...");

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(NEWS_DIR)) fs.mkdirSync(NEWS_DIR, { recursive: true });

  // Verify Firestore is reachable before spending time scraping
  console.log("🔥 Verifying Firestore connection...");
  try {
    await admin.firestore().collection("articles").limit(1).get();
    console.log("✅ Firestore connection verified.");
  } catch (err) {
    console.error("❌ FATAL: Cannot reach Firestore:", err.message);
    process.exit(1);
  }

  console.log(`📡 Launching browser to scrape: ${FB_URL} (limit ${SYNC_LIMIT})`);
  const items = await scrapeFacebook(FB_URL, SYNC_LIMIT);
  console.log(`📰 Found ${items.length} posts on page.`);

  const newItems = [];
  for (const item of items) {
    const id = stableId(item);
    const already = await existsInFirestore(id, legacyStableId(item));
    if (already) {
      console.log(`  ⏭️  Skipping (already saved as ${id}): "${item.content.slice(0, 60).replace(/\n/g, ' ')}..."`);
    } else {
      newItems.push(item);
    }
  }

  console.log(`✨ ${newItems.length} new posts to process.`);

  if (newItems.length === 0) {
    console.log("✅ Nothing new. Exiting.");
    return;
  }

  if (newItems.length > SYNC_LIMIT) {
    console.log(`⚠️ Limiting to ${SYNC_LIMIT} posts this run to respect API limits.`);
    newItems.splice(SYNC_LIMIT);
  }

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  let saved = 0;

  for (let i = 0; i < newItems.length; i++) {
    const item = newItems[i];
    console.log(`\n📝 Processing post from ${item.timestamp || "unknown date"}`);

    try {
      const article = await transformWithAI(item);

      await saveArticleToFirestore(article);

      saved++;
      console.log(`✅ Saved: ${article.title}`);

      if (i < newItems.length - 1) {
        console.log("⏳ Waiting 5 seconds before next post...");
        await delay(5000);
      }
    } catch (err) {
      console.error(`❌ Failed to process post:`, err.message);
    }
  }

  console.log(`\n🎉 Sync complete. ${saved} article(s) saved.`);

  if (saved > 0) {
    await revalidateSite();
  }
}

/**
 * Tells the deployed site to drop its cached pages after a successful sync.
 * Without this, Next.js keeps serving the static snapshot it built with
 * (which may predate any articles) until the next full redeploy — new
 * articles would exist in Firestore but never actually appear on the site.
 */
async function revalidateSite() {
  if (!REVALIDATE_SECRET) {
    console.warn("⚠️ REVALIDATE_SECRET not set — skipping cache revalidation. New articles may not appear on the live site until the next deploy.");
    return;
  }
  const url = `${SITE_URL}/api/revalidate?secret=${encodeURIComponent(REVALIDATE_SECRET)}&path=${encodeURIComponent("/")}&type=layout`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      console.log("🔄 Site cache revalidated — new articles should now be live.");
    } else {
      console.warn(`⚠️ Revalidation request failed: HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn(`⚠️ Revalidation request errored: ${err.message}`);
  }
}

async function scrapeFacebook(url, limit = 3) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    console.log("Opening page...");
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    
    // Wait for the page to settle
    await page.waitForTimeout(5000); 

    // Dismiss the login dialog. Facebook's modern layout renders it as an
    // overlay with an explicit close button — Escape alone doesn't dismiss
    // it, and while it's open Facebook stops lazy-loading further posts.
    console.log("Attempting to dismiss popups...");
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      const closeBtn = document.querySelector('div[aria-label="Close"], [aria-label="Close"]');
      if (closeBtn) closeBtn.click();
    });
    await page.waitForTimeout(2000);

    // Scroll to trigger lazy-loading of older posts — without this, only
    // the single newest post renders before the feed stops loading more.
    // Scroll until enough real (non-skeleton) posts are visible, capped at
    // a safety ceiling so a stalled feed can't loop forever.
    console.log(`Scrolling to load at least ${limit} post(s)...`);
    const maxScrolls = Math.min(Math.max(limit * 3, 6), 40);
    for (let i = 0; i < maxScrolls; i++) {
      await page.evaluate(() => window.scrollBy(0, 1500));
      await page.waitForTimeout(3000);
      const seen = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('div[role="article"]'));
        // Same nesting exclusion as the final extraction — otherwise a
        // post's nested comments inflate this count and cut scrolling short.
        const topLevel = all.filter(el => !all.some(other => other !== el && other.contains(el)));
        return topLevel.filter((el) => el.innerText && el.innerText.trim().length > 10).length;
      });
      console.log(`  ...scroll ${i + 1}/${maxScrolls}, ${seen} real post(s) visible so far`);
      if (seen >= limit) break;
    }

    // Take a debug screenshot
    await page.screenshot({ path: path.join(DATA_DIR, "debug.png") });
    console.log(`📸 Debug screenshot saved to data/debug.png`);

    // Extract posts
    const posts = await page.evaluate(async (limit) => {
      // 1. Find and click all "Tumingin pa" or "See more" buttons
      const seeMoreButtons = Array.from(document.querySelectorAll('div[role="button"], span, a'))
        .filter(el => {
          const text = el.innerText.toLowerCase();
          return text.includes('tumingin pa') || text.includes('see more');
        });

      for (const btn of seeMoreButtons) {
        try {
          btn.click();
          // Small wait for expansion
          await new Promise(r => setTimeout(r, 500));
        } catch (e) {}
      }

      // The page's own display name — genuine posts are always authored by
      // the Page itself, never by an individual commenter.
      const pageName = (document.querySelector('h1')?.innerText || '').trim();

      // 2. Now extract the full content
      const allArticles = Array.from(document.querySelectorAll('div[role="article"]'));
      // Facebook nests each comment's own role="article" inside its parent
      // post's article container — keep only the outermost (top-level feed
      // post) nodes, which structurally excludes comments/replies from ever
      // being scraped as if they were posts.
      const articles = allArticles.filter(
        el => !allArticles.some(other => other !== el && other.contains(el))
      );

      return articles.slice(0, limit).map(el => {
        // Find the message text (Facebook uses specific data attributes for this)
        const messageEl = el.querySelector('div[data-ad-preview="message"]');
        const text = messageEl ? messageEl.innerText : el.innerText;

        // Author name, to filter out anything not posted by the Page itself
        const authorEl = el.querySelector('h2 a, h3 a, strong a, h2 span, h3 span');
        const author = authorEl ? authorEl.innerText.trim() : '';

        // Find the main image
        const imgs = Array.from(el.querySelectorAll('img')).filter(i => i.src && i.src.includes('fbcdn'));
        let imgSrc = '';
        if (imgs.length > 0) {
          // Sort by size (width * height) and pick the largest
          const largestImg = imgs.sort((a, b) => {
            const areaA = (a.naturalWidth || a.width) * (a.naturalHeight || a.height);
            const areaB = (b.naturalWidth || b.width) * (b.naturalHeight || b.height);
            return areaB - areaA;
          })[0];
          imgSrc = largestImg.src;
        }

        // Find the timestamp/link
        const timeLink = el.querySelector('a[role="link"]');

        return {
          id: el.getAttribute('id') || '',
          content: text,
          author,
          image: imgSrc,
          timestamp: timeLink ? timeLink.getAttribute('aria-label') || timeLink.innerText : new Date().toISOString(),
          link: timeLink ? (timeLink.href.startsWith('http') ? timeLink.href : window.location.origin + timeLink.href) : window.location.href
        };
      }).filter(p => {
        if (!p.content || p.content.length <= 10) return false;
        // Skip anything clearly authored by someone other than the Page
        // (a comment/reply that slipped past the nesting filter above).
        if (pageName && p.author && p.author !== pageName) return false;
        return true;
      });
    }, limit);

    // Download each post's image while the authenticated browser session is
    // still alive. A blind server-to-server fetch (e.g. Cloudinary fetching
    // the fbcdn URL itself) gets rejected by Facebook's hotlink protection —
    // fetching through this context's cookies/referrer succeeds instead.
    for (const post of posts) {
      if (post.image) {
        post.imageBuffer = await downloadImageViaContext(context, post.image, url);
      }
    }

    await browser.close();
    return posts;
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
    // Try to take a screenshot of the failure
    try { await page.screenshot({ path: path.join(DATA_DIR, "error.png") }); } catch(e) {}
    await browser.close();
    return [];
  }
}

/**
 * Downloads an image using the browser context's own request API, so the
 * fetch carries the same cookies/user-agent/referrer as the page that
 * rendered it. Returns { base64, contentType } or null on failure.
 */
async function downloadImageViaContext(context, imageUrl, refererUrl) {
  try {
    const response = await context.request.get(imageUrl, {
      headers: { referer: refererUrl },
      timeout: 20000,
    });
    if (!response.ok()) {
      console.warn(`⚠️ Image download got HTTP ${response.status()} for ${imageUrl.slice(0, 80)}...`);
      return null;
    }
    const buffer = await response.body();
    const contentType = response.headers()["content-type"] || "image/jpeg";
    return { base64: buffer.toString("base64"), contentType };
  } catch (err) {
    console.warn(`⚠️ Image download failed: ${err.message}`);
    return null;
  }
}

// Comprehensive helper to convert fancy unicode styles to plain text
function cleanUnicode(text) {
  if (!text) return "";
  // Map various mathematical bold/italic/sans ranges to standard A-Z/a-z
  return text.replace(/[\u{1D400}-\u{1D7FF}]/gu, (char) => {
    const code = char.codePointAt(0);
    
    // Bold Serif
    if (code >= 0x1d400 && code <= 0x1d419) return String.fromCharCode(code - 0x1d400 + 65);
    if (code >= 0x1d41a && code <= 0x1d433) return String.fromCharCode(code - 0x1d41a + 97);
    
    // Bold Sans-Serif (Common on FB)
    if (code >= 0x1d5d4 && code <= 0x1d5ed) return String.fromCharCode(code - 0x1d5d4 + 65);
    if (code >= 0x1d5ee && code <= 0x1d607) return String.fromCharCode(code - 0x1d5ee + 97);
    
    // Italic Sans-Serif
    if (code >= 0x1d608 && code <= 0x1d621) return String.fromCharCode(code - 0x1d608 + 65);
    if (code >= 0x1d622 && code <= 0x1d63b) return String.fromCharCode(code - 0x1d622 + 97);

    return char;
  });
}

function stripNewsPrefix(title) {
  if (!title) return "";
  // Aggressively remove "News |", "Update |", etc. from the start
  return title.replace(/^(News|Update|Facebook|Jeromian|Post|Article)\s*[|:–—\-]\s*/i, "").trim();
}

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function applyTimeOfDay(date, hourStr, minStr, ampm) {
  let hour = parseInt(hourStr, 10) % 12;
  if (/pm/i.test(ampm)) hour += 12;
  date.setHours(hour, parseInt(minStr, 10), 0, 0);
  return date;
}

/**
 * Parses Facebook's own displayed post date/time (the aria-label scraped as
 * item.timestamp, e.g. "2d", "July 8 at 1:22 PM", "January 29") into a real
 * Date — deterministically and for free, instead of asking Gemini to guess
 * an ISO timestamp with no grounding (which is what produced wrong dates).
 */
function parseFacebookTimestamp(raw, now = new Date()) {
  if (!raw) return null;
  const str = raw.trim();

  // Relative short form: "45m", "1h", "2d", "3w"
  let m = str.match(/^(\d+)\s*(s|m|h|d|w)$/i);
  if (m) {
    const n = parseInt(m[1], 10);
    const msPerUnit = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };
    return new Date(now.getTime() - n * msPerUnit[m[2].toLowerCase()]);
  }

  // "Yesterday at H:MM AM/PM" / "Today at H:MM AM/PM"
  m = str.match(/^(Yesterday|Today) at (\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m) {
    const d = new Date(now);
    if (m[1].toLowerCase() === "yesterday") d.setDate(d.getDate() - 1);
    return applyTimeOfDay(d, m[2], m[3], m[4]);
  }

  // "Month D at H:MM AM/PM" — year omitted, assume current year (roll back
  // one year if that would place it in the future relative to the scrape).
  m = str.match(/^([A-Za-z]+)\s+(\d{1,2})\s+at\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m && MONTHS[m[1].toLowerCase()] !== undefined) {
    const year = now.getFullYear();
    const d = applyTimeOfDay(new Date(year, MONTHS[m[1].toLowerCase()], parseInt(m[2], 10)), m[3], m[4], m[5]);
    if (d.getTime() > now.getTime() + 86400000) d.setFullYear(year - 1);
    return d;
  }

  // "Month D, YYYY" — explicit year, no time
  m = str.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (m && MONTHS[m[1].toLowerCase()] !== undefined) {
    return new Date(parseInt(m[3], 10), MONTHS[m[1].toLowerCase()], parseInt(m[2], 10));
  }

  // "Month D" — no year, no time (same current-year-or-rollback rule)
  m = str.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  if (m && MONTHS[m[1].toLowerCase()] !== undefined) {
    const year = now.getFullYear();
    let d = new Date(year, MONTHS[m[1].toLowerCase()], parseInt(m[2], 10));
    if (d.getTime() > now.getTime() + 86400000) d = new Date(year - 1, MONTHS[m[1].toLowerCase()], parseInt(m[2], 10));
    return d;
  }

  // Fallback to native Date parsing for anything already unambiguous
  const native = new Date(str);
  return isNaN(native.getTime()) ? null : native;
}

async function transformWithAI(item) {
  const cleanContent = cleanUnicode(item.content);

  if (!GEMINI_API_KEY) {
    return basicTransform({ ...item, content: cleanContent });
  }

  // Use the stable ID so the article ID always matches the dedup key
  const stableArticleId = stableId(item);

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const prompt = `You are an expert editorial assistant for "Jeromian Voice", a school news publication.
Transform this Facebook post into a structured news article.

POST CONTENT:
"""
${cleanContent}
"""

EDITORIAL RULES:
1. TITLE: The very first line of the post is the headline. Clean it of any "News |" prefixes and fancy fonts.
2. BODY: Reproduce the post's own wording VERBATIM — every sentence exactly
   as written, in the same order. Do NOT summarize, paraphrase, shorten, or
   rewrite it in different words. Your only edits are: wrap each paragraph
   in <p> tags, drop the credit-emoji lines (📸/🎨/✍🏻) from the body since
   they're captured separately below, and drop the Title/Headline line.
   Do not add, remove, or alter any information from the original text.
3. CREDITS: Look for these emojis at the end:
   - 📸: Photo Credits
   - 🎨: Layout/Graphics Credits
   - ✍🏻: Author/Writer Credits
   If found, format them into a JSON object.

Output ONLY valid JSON:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "...",
  "category": "...",
  "timestamp": "ISO-8601",
  "credits": { "photo": "...", "layout": "...", "writer": "..." }
}
`;

  let result;
  let retries = 2;
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  while (retries >= 0) {
    try {
      result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      break; // Success, exit retry loop
    } catch (error) {
      if (error.message.includes('503') || error.message.includes('429')) {
        console.warn(`⚠️ Gemini API rate limit hit (${error.message}). Retrying in 15 seconds... (${retries} retries left)`);
        if (retries === 0) throw error; // Out of retries
        await delay(15000);
        retries--;
      } else {
        throw error; // Not a rate limit error, throw immediately
      }
    }
  }

  const text = result.text.trim();
  const jsonText = text.replace(/^```json\s*/, "").replace(/```\s*$/, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    return basicTransform({ ...item, content: cleanContent });
  }

  // Final cleanup and formatting
  let finalTitle = stripNewsPrefix(parsed.title || cleanContent.split('\n')[0]);
  const id = stableArticleId;
  const slug = slugify(finalTitle) || `article-${id}`;

  // Construct content with credits if available
  let finalContent = parsed.content;
  if (parsed.credits) {
    let creditHtml = '<div class="mt-8 pt-6 border-t border-outline/30 text-sm text-on-surface-muted space-y-1">';
    if (parsed.credits.writer) creditHtml += `<p><i>Story Written By: ${parsed.credits.writer}</i></p>`;
    if (parsed.credits.photo) creditHtml += `<p><i>Photo Captured By: ${parsed.credits.photo}</i></p>`;
    if (parsed.credits.layout) creditHtml += `<p><i>Material Layout by: ${parsed.credits.layout}</i></p>`;
    creditHtml += '</div>';
    finalContent += creditHtml;
  }

  return {
    id,
    title: finalTitle,
    slug: slug,
    content: finalContent,
    excerpt: parsed.excerpt || cleanContent.split('\n').slice(1, 3).join(' ').slice(0, 160),
    originalUrl: item.link || "",
    // Facebook's own displayed post date is authoritative — Gemini's guess
    // is only a last resort if that string couldn't be parsed at all.
    timestamp: (
      parseFacebookTimestamp(item.timestamp) ||
      (parsed.timestamp && !isNaN(Date.parse(parsed.timestamp)) ? new Date(parsed.timestamp) : new Date())
    ).toISOString(),
    category: parsed.category || "General",
    image: item.image || "",
    _imageBuffer: item.imageBuffer || null,
  };
}

function basicTransform(item) {
  const id = stableId(item);
  let title = stripNewsPrefix(item.content.split('\n')[0]).slice(0, 50) || "News Update";

  return {
    id,
    title,
    slug: slugify(title),
    content: `<p>${item.content.replace(/\n+/g, "</p><p>")}</p>`,
    excerpt: item.content.slice(0, 160),
    originalUrl: item.link || "",
    timestamp: (parseFacebookTimestamp(item.timestamp) || new Date()).toISOString(),
    category: "General",
    image: item.image || "",
    _imageBuffer: item.imageBuffer || null,
  };
}

/**
 * Uploads the Facebook post image to Cloudinary with a fallback chain so the
 * article always ends up with *some* usable image URL — never silently
 * dropped:
 *   1. Upload from the buffer downloaded through the authenticated browser
 *      context (most reliable — Facebook's CDN blocks blind server fetches).
 *   2. Fall back to letting Cloudinary fetch the fbcdn URL itself.
 *   3. Fall back to the raw fbcdn URL (works until it expires, but keeps
 *      the same photo from the post rather than showing nothing).
 */
async function uploadImageToCloud(imageUrl, articleId, imageBuffer) {
  if (!imageUrl || !imageUrl.includes("fbcdn")) return imageUrl;

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn(`⚠️ CLOUDINARY_CLOUD_NAME not set — storing raw fbcdn URL for article ${articleId} (will expire).`);
    return imageUrl;
  }

  const uploadOptions = {
    public_id: `jeromian-voice/articles/${articleId}`,
    overwrite: false,
    resource_type: "image",
  };

  if (imageBuffer && imageBuffer.base64) {
    try {
      console.log(`📸 Uploading downloaded image bytes for article ${articleId} to Cloudinary...`);
      const dataUri = `data:${imageBuffer.contentType};base64,${imageBuffer.base64}`;
      const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
      console.log(`✅ Image stored permanently: ${result.secure_url}`);
      return result.secure_url;
    } catch (err) {
      console.warn(`⚠️ Buffer upload failed: ${err.message}. Trying remote fetch...`);
    }
  }

  try {
    console.log(`📸 Asking Cloudinary to fetch the image URL directly for article ${articleId}...`);
    const result = await cloudinary.uploader.upload(imageUrl, uploadOptions);
    console.log(`✅ Image stored permanently: ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.warn(`⚠️ Remote fetch upload failed: ${err.message}. Falling back to the raw fbcdn URL.`);
    return imageUrl;
  }
}

async function saveArticleToFirestore(article) {
  const db = admin.firestore();
  const { id, _imageBuffer, ...data } = article;

  const docRef = db.collection("articles").doc(id);

  // Final guard — never overwrite an article that already exists.
  // This protects permanent Storage URLs from being replaced by
  // a fresh (but expiring) fbcdn URL on a repeat scrape.
  const existing = await docRef.get();
  if (existing.exists) {
    console.log(`⏭️  Article "${data.title}" already exists — skipping write.`);
    return;
  }

  // Upload image from expiring Facebook CDN to permanent Cloudinary hosting
  if (data.image && data.image.includes("fbcdn")) {
    data.image = await uploadImageToCloud(data.image, id, _imageBuffer);
  }

  await docRef.set({
    ...data,
    syncedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

function writeArticleFile(article) {
  const filePath = path.join(NEWS_DIR, `${article.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
}

function hashId(str) {
  return crypto.createHash("sha256").update(str).digest("hex").slice(0, 16);
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
