// app/api/cvs/route.ts
import { db } from '@/db';
import { cvs } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allCVs = await db.select().from(cvs);
    return NextResponse.json({ cvs: allCVs });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch CVs' },
      { status: 500 }
    );
  }
}
