import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;

    const adminDoc = await adminDb.collection("admins").doc(email!).get();
    if (!adminDoc.exists || adminDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Auth failed" }, { status: 401 });
  }

  const results: Record<string, { ok: boolean; detail: string }> = {};

  // Test 1: Firestore read
  try {
    const snap = await adminDb.collection("articles").limit(1).get();
    results.firestore = { ok: true, detail: `Reachable — ${snap.size} article(s) in collection` };
  } catch (err: any) {
    results.firestore = { ok: false, detail: err.message };
  }

  // Test 2: Firestore admins collection
  try {
    const snap = await adminDb.collection("admins").get();
    results.admins = { ok: true, detail: `${snap.size} admin(s) registered` };
  } catch (err: any) {
    results.admins = { ok: false, detail: err.message };
  }

  // Test 3: Environment variables present
  const envVars = [
    "FIREBASE_SERVICE_ACCOUNT",
    "GEMINI_API_KEY",
    "WEBHOOK_API_KEY",
    "WEBHOOK_URL",
    "GITHUB_PAT",
  ];
  const missingEnv = envVars.filter((v) => !process.env[v]);
  results.env = {
    ok: missingEnv.length === 0,
    detail: missingEnv.length === 0
      ? "All required server env vars present"
      : `Missing: ${missingEnv.join(", ")}`,
  };

  const allOk = Object.values(results).every((r) => r.ok);
  return NextResponse.json({ ok: allOk, results }, { status: 200 });
}
