export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NEWS_DIR = path.join(process.cwd(), "content", "news");
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

    // Ensure directory exists
    if (!fs.existsSync(NEWS_DIR)) {
      fs.mkdirSync(NEWS_DIR, { recursive: true });
    }

    // Check for duplicate
    const filePath = path.join(NEWS_DIR, `${body.slug}.json`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Article with this slug already exists" },
        { status: 409 }
      );
    }

    // Write article
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));

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
