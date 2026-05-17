#!/usr/bin/env node
/**
 * Clears expired Facebook CDN image URLs from Firestore articles.
 * Run with: node scripts/clear-expired-images.js
 */

require("dotenv").config();

const admin = require("firebase-admin");

const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!FIREBASE_SERVICE_ACCOUNT) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT is not set in .env");
  process.exit(1);
}

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function main() {
  const db = admin.firestore();
  const snapshot = await db.collection("articles").get();

  const expired = snapshot.docs.filter((doc) => {
    const img = doc.data().image;
    return img && img.includes("fbcdn");
  });

  console.log(`Found ${expired.length} article(s) with expired Facebook CDN images.`);

  for (const doc of expired) {
    await db.collection("articles").doc(doc.id).update({ image: "" });
    console.log(`✅ Cleared image for: "${doc.data().title?.slice(0, 60)}"`);
  }

  console.log("\nDone. Articles will now display without broken images.");
  process.exit(0);
}

main().catch((err) => {
  console.error("💥", err);
  process.exit(1);
});
