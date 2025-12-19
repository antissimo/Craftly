// app/api/explore/route.ts
import { db } from '@/db';
import { cvs, users } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Dohvati CV-jeve s user podacima - KORISTI SQL ZA STRING MANIPULACIJU
    const cvList = await db.select({
      id: cvs.id,
      title: cvs.title,
      summary: cvs.summary,
      updatedAt: cvs.updatedAt,
      userEmail: users.email,
      userName: sql<string>`split_part(${users.email}, '@', 1)`, // Extract username from email
    })
    .from(cvs)
    .innerJoin(users, eq(cvs.userId, users.id))
    .orderBy(desc(cvs.updatedAt))
    .limit(limit)
    .offset(offset);

    // Dohvati ukupan broj
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(cvs);
    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      cvs: cvList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching CVs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}