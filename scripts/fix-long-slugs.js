#!/usr/bin/env node
/**
 * Shortens any existing Firestore article whose `slug` is long enough to
 * break a Vercel build (ENAMETOOLONG on /vercel/path0/.next/output/functions/
 * news/<slug>). Slugify() used to run unbounded on Gemini-written titles, so
 * a full-sentence title became a full-sentence slug. This truncates those in
 * place, matching the same length cap now enforced in sync-news.js.
 *
 * Run with: node scripts/fix-long-slugs.js
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

const MAX_SLUG_LENGTH = 80;
const ID_SUFFIX_LENGTH = 7; // "-" + 6 hex chars, reserved out of MAX_SLUG_LENGTH below

function shortenSlug(slug, id) {
  const budget = MAX_SLUG_LENGTH - ID_SUFFIX_LENGTH;
  const truncated = slug.slice(0, budget).replace(/-[^-]*$/, "") || slug.slice(0, budget);
  return `${truncated}-${id.slice(0, 6)}`;
}

async function main() {
  const db = admin.firestore();
  const snapshot = await db.collection("articles").get();

  const tooLong = snapshot.docs.filter((doc) => {
    const slug = doc.data().slug;
    return typeof slug === "string" && slug.length > MAX_SLUG_LENGTH;
  });

  console.log(`Found ${snapshot.size} total articles, ${tooLong.length} with an oversized slug.\n`);

  if (tooLong.length === 0) {
    console.log("✅ Nothing to fix.");
    process.exit(0);
  }

  for (const doc of tooLong) {
    const data = doc.data();
    const newSlug = shortenSlug(data.slug, doc.id);
    console.log(`"${data.title?.slice(0, 60)}..."`);
    console.log(`  ${data.slug.length} chars -> ${newSlug} (${newSlug.length} chars)\n`);
    await doc.ref.update({ slug: newSlug });
  }

  console.log(`🎉 Fixed ${tooLong.length} article slug(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("💥 Fatal:", err);
  process.exit(1);
});
