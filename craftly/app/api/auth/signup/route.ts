import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";

export async function POST(req: NextRequest) {
  const { username, email, password, supabaseId } = await req.json();

  await db.insert(users).values({
    id: supabaseId,
    email,
    name: username,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}
