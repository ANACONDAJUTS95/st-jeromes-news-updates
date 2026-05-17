#!/usr/bin/env node
/**
 * One-time migration: downloads expired Facebook CDN images from Firestore articles
 * and re-uploads them to Firebase Storage for permanent hosting.
 * Run with: node scripts/migrate-images.js
 */

require("dotenv").config();

const admin = require("firebase-admin");
const https = require("https");
const http = require("http");

const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
const FIREBASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`;

if (!FIREBASE_SERVICE_ACCOUNT) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT is not set in .env");
  process.exit(1);
}

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: FIREBASE_STORAGE_BUCKET,
});

console.log(`✅ Firebase initialized. Storage bucket: ${FIREBASE_STORAGE_BUCKET}`);

function downloadImageBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed with status ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () =>
        resolve({
          buffer: Buffer.concat(chunks),
          contentType: res.headers["content-type"] || "image/jpeg",
        })
      );
      res.on("error", reject);
    });
    request.on("error", reject);
    request.setTimeout(20000, () => {
      request.destroy();
      reject(new Error("Download timed out"));
    });
  });
}

async function uploadImageToStorage(imageUrl, articleId) {
  const { buffer, contentType } = await downloadImageBuffer(imageUrl);
  const ext = contentType.includes("png") ? "png" : "jpg";
  const bucket = admin.storage().bucket();
  const file = bucket.file(`articles/${articleId}.${ext}`);
  await file.save(buffer, { contentType });
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/articles/${articleId}.${ext}`;
}

async function main() {
  const db = admin.firestore();
  const snapshot = await db.collection("articles").get();

  if (snapshot.empty) {
    console.log("No articles found in Firestore.");
    return;
  }

  const articles = snapshot.docs.filter((doc) => {
    const data = doc.data();
    return data.image && data.image.includes("fbcdn");
  });

  console.log(`\nFound ${snapshot.size} total articles, ${articles.length} with Facebook CDN images to migrate.\n`);

  if (articles.length === 0) {
    console.log("✅ Nothing to migrate.");
    return;
  }

  let success = 0;
  let failed = 0;

  for (const doc of articles) {
    const data = doc.data();
    console.log(`Processing: "${data.title?.slice(0, 60)}..."`);
    console.log(`  Old URL: ${data.image?.slice(0, 80)}...`);

    try {
      const newUrl = await uploadImageToStorage(data.image, doc.id);
      await db.collection("articles").doc(doc.id).update({ image: newUrl });
      console.log(`  ✅ New URL: ${newUrl}\n`);
      success++;
    } catch (err) {
      console.warn(`  ⚠️ Failed: ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\n🎉 Migration complete: ${success} succeeded, ${failed} failed.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("💥 Fatal:", err);
  process.exit(1);
});
