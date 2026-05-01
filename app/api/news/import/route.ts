export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const API_KEY = process.env.WEBHOOK_API_KEY;

export async function POST(req: NextRequest) {
  // Authenticate
  const authHeader = req.headers.get("x-api-key");
  if (!API_KEY || authHeader !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate required fields
    const required = ["id", "title", "slug", "content", "timestamp"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const { id, ...data } = body;

    // Check for duplicate
    const docRef = adminDb.collection("articles").doc(id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      return NextResponse.json(
        { error: "Article with this ID already exists" },
        { status: 409 }
      );
    }

    // Write article to Firestore
    await docRef.set({
      ...data,
      syncedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, slug: body.slug },
      { status: 201 }
    );
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
