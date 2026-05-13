import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await db
    .select({ photoUrl: members.photoUrl })
    .from(members)
    .where(eq(members.id, id))
    .limit(1);

  const photoUrl = result[0]?.photoUrl;

  if (!photoUrl) {
    return new NextResponse(null, { status: 404 });
  }

  // photo_url is stored as base64, optionally with data: URI prefix
  let contentType = "image/jpeg";
  let base64 = photoUrl;

  const dataUriMatch = photoUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (dataUriMatch) {
    contentType = dataUriMatch[1];
    base64 = dataUriMatch[2];
  }

  const buffer = Buffer.from(base64, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
