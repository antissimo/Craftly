// app/api/test-db/route.ts - CORRECT VERSION
import { db } from "@/db";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Correct way: await the promise and access .rows
    const result = await db.execute("SELECT NOW() as time, version() as version");
    
    // Log the full result structure to see what Drizzle returns
    console.log("Full result:", result);
    console.log("Result type:", typeof result);
    console.log("Is array?", Array.isArray(result));
    
    // Try different access patterns
    let data;
    if (Array.isArray(result)) {
      // If it's an array
      data = result[0];
    } else if (result && typeof result === 'object' && 'rows' in result) {
      // If it has .rows property
      data = (result as any).rows[0];
    } else if (result && typeof result === 'object' && 'rowCount' in result) {
      // If it's a QueryResult
      data = (result as any).rows?.[0];
    }
    
    return NextResponse.json({ 
      success: true, 
      data,
      rawResult: result, // Include raw to debug
      env: process.env.DATABASE_URL ? "DATABASE_URL is set" : "DATABASE_URL is missing"
    });
    
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}