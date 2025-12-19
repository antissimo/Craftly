// app/api/explore/[id]/route.ts
import { db } from '@/db';
import { cvs, users, experience, education, skills } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching portfolio ID:', id);
    
    // 1. Dohvati CV
    const [cv] = await db.select().from(cvs).where(eq(cvs.id, id));
    
    if (!cv) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    // 2. Dohvati usera
    const [user] = await db.select().from(users).where(eq(users.id, cv.userId));
    
    // 3. Dohvati sve podatke zasebno
    const experiences = await db.select()
      .from(experience)
      .where(eq(experience.cvId, id));
    
    const educationList = await db.select()
      .from(education)
      .where(eq(education.cvId, id));
    
    const skillsList = await db.select()
      .from(skills)
      .where(eq(skills.cvId, id));
    
    return NextResponse.json({
      portfolio: {
        id: cv.id,
        title: cv.title,
        summary: cv.summary,
        createdAt: cv.createdAt,
        updatedAt: cv.updatedAt,
        userId: cv.userId,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
        experiences: experiences.map(exp => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
        })),
        education: educationList.map(edu => ({
          id: edu.id,
          school: edu.school,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
        })),
        skills: skillsList.map(skill => ({
          id: skill.id,
          name: skill.name,
          level: skill.level,
        })),
      }
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch portfolio',
        details: error.message 
      },
      { status: 500 }
    );
  }
}