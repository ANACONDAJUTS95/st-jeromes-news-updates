#!/usr/bin/env node
/**
 * News Sync Script (Playwright Version)
 * Scrapes Facebook public page using a headless browser,
 * transforms posts with Gemini AI, and writes articles.
 */

require('dotenv').config();

const { chromium } = require("playwright");
const { GoogleGenAI } = require("@google/genai");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const https = require("https");
const http = require("http");

// Config from environment
const FB_URL = process.env.FB_URL || "https://m.facebook.com/profile.php?id=61578775710364";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
const FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`;

// Initialize Firebase Admin
if (FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
    // Extremely robust fix for PEM formatting
    if (serviceAccount.private_key) {
      // 1. Convert literal \n strings to actual newlines
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      // 2. Ensure it has the correct BEGIN/END headers with newlines
      if (!serviceAccount.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
        serviceAccount.private_key = `-----BEGIN PRIVATE KEY-----\n${serviceAccount.private_key}`;
      }
      if (!serviceAccount.private_key.endsWith('-----END PRIVATE KEY-----')) {
        serviceAccount.private_key = `${serviceAccount.private_key}\n-----END PRIVATE KEY-----`;
      }
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: FIREBASE_STORAGE_BUCKET,
    });
    console.log("✅ Firebase Admin initialized.");
  } catch (err) {
    console.error("❌ Firebase Admin initialization failed:", err.message);
  }
}

// Paths
const DATA_DIR = path.join(__dirname, "..", "data");
const NEWS_DIR = path.join(__dirname, "..", "content", "news");
const PROCESSED_IDS_PATH = path.join(DATA_DIR, "processed_ids.json");

/**
 * Stable ID: keyed on the post URL so the same Facebook post always maps
 * to the same Firestore document ID across every run.
 */
function stableId(item) {
  return hashId(item.link || item.content.slice(0, 300));
}

/**
 * Two-pass duplicate check:
 * 1. Fast path — document ID lookup (O(1))
 * 2. Fallback  — query by originalUrl to catch ID mismatches from old runs
 */
async function existsInFirestore(id, link) {
  if (!FIREBASE_SERVICE_ACCOUNT || !admin.apps.length) return false;
  try {
    const db = admin.firestore();
    const byId = await db.collection("articles").doc(id).get();
    if (byId.exists) return true;

    if (link) {
      const byUrl = await db.collection("articles")
        .where("originalUrl", "==", link)
        .limit(1)
        .get();
      if (!byUrl.empty) return true;
    }
  } catch (err) {
    console.warn(`⚠️ Firestore check error for ${id}:`, err.message);
  }
  return false;
}

async function main() {
  console.log("🚀 Starting browser-based news sync...");

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(NEWS_DIR)) fs.mkdirSync(NEWS_DIR, { recursive: true });

  console.log(`📡 Launching browser to scrape: ${FB_URL}`);
  const items = await scrapeFacebook(FB_URL);
  console.log(`📰 Found ${items.length} posts on page.`);

  const newItems = [];
  for (const item of items) {
    const id = stableId(item);
    const already = await existsInFirestore(id, item.link);
    if (!already) newItems.push(item);
  }

  console.log(`✨ ${newItems.length} new posts to process.`);

  if (newItems.length === 0) {
    console.log("✅ Nothing new. Exiting.");
    return;
  }

  const MAX_POSTS_PER_RUN = 3;
  if (newItems.length > MAX_POSTS_PER_RUN) {
    console.log(`⚠️ Limiting to ${MAX_POSTS_PER_RUN} posts this run to respect API limits.`);
    newItems.splice(MAX_POSTS_PER_RUN);
  }

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  let saved = 0;

  for (let i = 0; i < newItems.length; i++) {
    const item = newItems[i];
    console.log(`\n📝 Processing post from ${item.timestamp || "unknown date"}`);

    try {
      const article = await transformWithAI(item);

      if (admin.apps.length > 0) {
        await saveArticleToFirestore(article);
      } else {
        writeArticleFile(article);
      }

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
}

async function scrapeFacebook(url) {
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

    // Dismiss any login popups
    console.log("Attempting to dismiss popups...");
    await page.keyboard.press('Escape');
    await page.waitForTimeout(2000);

    // Take a debug screenshot
    await page.screenshot({ path: path.join(DATA_DIR, "debug.png") });
    console.log(`📸 Debug screenshot saved to data/debug.png`);

    // Extract posts
    const posts = await page.evaluate(async () => {
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

      // 2. Now extract the full content
      const articles = Array.from(document.querySelectorAll('div[role="article"]'));
      
      return articles.slice(0, 5).map(el => {
        // Find the message text (Facebook uses specific data attributes for this)
        const messageEl = el.querySelector('div[data-ad-preview="message"]');
        const text = messageEl ? messageEl.innerText : el.innerText;
        
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
          image: imgSrc,
          timestamp: timeLink ? timeLink.getAttribute('aria-label') || timeLink.innerText : new Date().toISOString(),
          link: timeLink ? (timeLink.href.startsWith('http') ? timeLink.href : window.location.origin + timeLink.href) : window.location.href
        };
      }).filter(p => p.content && p.content.length > 10);
    });

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
2. BODY: Everything after the first line is the article content. 
   - DO NOT include the Title/Headline in this field.
   - Preserve professional tone and use <p> tags for paragraphs. 
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
    if (parsed.credits.layout) creditHtml += `<p><i>Photo Layout Done By: ${parsed.credits.layout}</i></p>`;
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
    timestamp: parsed.timestamp || new Date().toISOString(),
    category: parsed.category || "General",
    image: item.image || "",
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
    timestamp: new Date().toISOString(),
    category: "General",
    image: item.image || "",
  };
}

function downloadImageBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Image download failed with status ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({
        buffer: Buffer.concat(chunks),
        contentType: res.headers["content-type"] || "image/jpeg",
      }));
      res.on("error", reject);
    });
    request.on("error", reject);
    request.setTimeout(15000, () => { request.destroy(); reject(new Error("Image download timed out")); });
  });
}

async function uploadImageToStorage(imageUrl, articleId) {
  if (!imageUrl || !imageUrl.includes("fbcdn")) return imageUrl;
  try {
    console.log(`📸 Downloading image for article ${articleId}...`);
    const { buffer, contentType } = await downloadImageBuffer(imageUrl);
    const ext = contentType.includes("png") ? "png" : "jpg";
    const bucket = admin.storage().bucket();
    const file = bucket.file(`articles/${articleId}.${ext}`);
    await file.save(buffer, { contentType });
    await file.makePublic();
    const storageUrl = `https://storage.googleapis.com/${bucket.name}/articles/${articleId}.${ext}`;
    console.log(`✅ Image uploaded to Firebase Storage`);
    return storageUrl;
  } catch (err) {
    console.warn(`⚠️ Could not upload image: ${err.message}. Using original URL.`);
    return imageUrl;
  }
}

async function saveArticleToFirestore(article) {
  const db = admin.firestore();
  const { id, ...data } = article;

  const docRef = db.collection("articles").doc(id);

  // Final guard — never overwrite an article that already exists.
  // This protects permanent Storage URLs from being replaced by
  // a fresh (but expiring) fbcdn URL on a repeat scrape.
  const existing = await docRef.get();
  if (existing.exists) {
    console.log(`⏭️  Article "${data.title}" already exists — skipping write.`);
    return;
  }

  // Migrate image from expiring Facebook CDN to permanent Firebase Storage
  if (data.image && data.image.includes("fbcdn")) {
    data.image = await uploadImageToStorage(data.image, id);
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
