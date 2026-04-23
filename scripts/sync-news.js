#!/usr/bin/env node
/**
 * News Sync Script (Playwright Version)
 * Scrapes Facebook public page using a headless browser,
 * transforms posts with Gemini AI, and writes articles.
 */

const { chromium } = require("playwright");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Config from environment
const FB_URL = process.env.FB_URL || "https://m.facebook.com/profile.php?id=61578775710364";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY;

// Paths
const DATA_DIR = path.join(__dirname, "..", "data");
const NEWS_DIR = path.join(__dirname, "..", "content", "news");
const PROCESSED_IDS_PATH = path.join(DATA_DIR, "processed_ids.json");

async function main() {
  console.log("🚀 Starting browser-based news sync...");

  // Ensure directories exist
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(NEWS_DIR)) fs.mkdirSync(NEWS_DIR, { recursive: true });

  // Load processed IDs
  let processedIds = [];
  if (fs.existsSync(PROCESSED_IDS_PATH)) {
    try {
      processedIds = JSON.parse(fs.readFileSync(PROCESSED_IDS_PATH, "utf-8"));
    } catch (e) {
      processedIds = [];
    }
  }

  // Scrape Facebook
  console.log(`📡 Launching browser to scrape: ${FB_URL}`);
  const items = await scrapeFacebook(FB_URL);
  console.log(`📰 Found ${items.length} posts on page.`);

  const newItems = items.filter((item) => {
    const id = hashId(item.id || item.content);
    return !processedIds.includes(id);
  });

  console.log(`✨ ${newItems.length} new posts to process.`);

  if (newItems.length === 0) {
    console.log("✅ Nothing new. Exiting.");
    return;
  }

  // Process each new item
  for (const item of newItems) {
    const id = hashId(item.id || item.content);
    console.log(`\n📝 Processing post from ${item.timestamp || "unknown date"}`);

    try {
      const article = await transformWithAI(item);

      if (WEBHOOK_URL && WEBHOOK_API_KEY) {
        await postToApi(article);
      } else {
        writeArticleFile(article);
      }

      processedIds.push(id);
      console.log(`✅ Saved: ${article.title}`);
    } catch (err) {
      console.error(`❌ Failed to process post:`, err.message);
    }
  }

  // Save processed IDs
  fs.writeFileSync(PROCESSED_IDS_PATH, JSON.stringify(processedIds, null, 2));
  console.log(`\n🎉 Sync complete. ${newItems.length} article(s) processed.`);
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
          id: el.getAttribute('id') || Math.random().toString(36).substr(2, 9),
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

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();
  const jsonText = text.replace(/^```json\s*/, "").replace(/```\s*$/, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    return basicTransform({ ...item, content: cleanContent });
  }

  // Final cleanup and formatting
  let finalTitle = stripNewsPrefix(parsed.title || cleanContent.split('\n')[0]);
  const id = hashId(item.id || item.content);
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
  const id = hashId(item.id || item.content);
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

async function postToApi(article) {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": WEBHOOK_API_KEY,
    },
    body: JSON.stringify(article),
  });

  if (!res.ok) {
    throw new Error(`API returned ${res.status}`);
  }
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
