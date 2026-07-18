#!/usr/bin/env node
/**
 * Repairs articles whose image is missing or points at an expired Facebook
 * CDN URL. Re-visits each article's original Facebook permalink with a real
 * browser session, re-downloads that post's image (the same photo the post
 * used), and re-uploads it to Cloudinary — then patches the Firestore doc.
 *
 * Run with: node scripts/repair-images.js
 */

require("dotenv").config();

const { chromium } = require("playwright");
const { v2: cloudinary } = require("cloudinary");
const admin = require("firebase-admin");

const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!FIREBASE_SERVICE_ACCOUNT) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT is not set in .env");
  process.exit(1);
}
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ CLOUDINARY_CLOUD_NAME is not set in .env — nothing to upload to.");
  process.exit(1);
}

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function downloadImageViaContext(context, imageUrl, refererUrl) {
  try {
    const response = await context.request.get(imageUrl, {
      headers: { referer: refererUrl },
      timeout: 20000,
    });
    if (!response.ok()) return null;
    const buffer = await response.body();
    const contentType = response.headers()["content-type"] || "image/jpeg";
    return { base64: buffer.toString("base64"), contentType };
  } catch {
    return null;
  }
}

async function scrapePostImage(context, postUrl) {
  const page = await context.newPage();
  try {
    await page.goto(postUrl, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);

    const imgSrc = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img")).filter(
        (i) => i.src && i.src.includes("fbcdn")
      );
      if (imgs.length === 0) return "";
      const largest = imgs.sort((a, b) => {
        const areaA = (a.naturalWidth || a.width) * (a.naturalHeight || a.height);
        const areaB = (b.naturalWidth || b.width) * (b.naturalHeight || b.height);
        return areaB - areaA;
      })[0];
      return largest.src;
    });

    await page.close();
    if (!imgSrc) return null;

    const buffer = await downloadImageViaContext(context, imgSrc, postUrl);
    return buffer ? { imgSrc, buffer } : null;
  } catch (err) {
    console.warn(`  ⚠️ Could not open post: ${err.message}`);
    try { await page.close(); } catch {}
    return null;
  }
}

async function main() {
  const db = admin.firestore();
  const snapshot = await db.collection("articles").get();

  const broken = snapshot.docs.filter((doc) => {
    const data = doc.data();
    return (!data.image || data.image.includes("fbcdn")) && data.originalUrl;
  });

  console.log(`Found ${snapshot.size} total articles, ${broken.length} with a missing/expired image to repair.\n`);

  if (broken.length === 0) {
    console.log("✅ Nothing to repair.");
    process.exit(0);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
  });

  let success = 0;
  let failed = 0;

  for (const doc of broken) {
    const data = doc.data();
    console.log(`Repairing: "${data.title?.slice(0, 60)}..."`);
    console.log(`  Post: ${data.originalUrl}`);

    const result = await scrapePostImage(context, data.originalUrl);
    if (!result) {
      console.warn(`  ⚠️ Could not recover an image from the original post.\n`);
      failed++;
      continue;
    }

    try {
      const dataUri = `data:${result.buffer.contentType};base64,${result.buffer.base64}`;
      const upload = await cloudinary.uploader.upload(dataUri, {
        public_id: `jeromian-voice/articles/${doc.id}`,
        overwrite: true,
        resource_type: "image",
      });
      await db.collection("articles").doc(doc.id).update({ image: upload.secure_url });
      console.log(`  ✅ New URL: ${upload.secure_url}\n`);
      success++;
    } catch (err) {
      console.warn(`  ⚠️ Upload failed: ${err.message}\n`);
      failed++;
    }
  }

  await browser.close();
  console.log(`\n🎉 Repair complete: ${success} succeeded, ${failed} failed.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("💥 Fatal:", err);
  process.exit(1);
});
