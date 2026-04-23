export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const path = req.nextUrl.searchParams.get("path");

  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  } catch (err) {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
