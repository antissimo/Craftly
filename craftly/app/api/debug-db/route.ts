// app/api/debug-db/route.ts
import { db } from "@/db";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("Debug: Starting database test...");
    
    // Get DATABASE_URL info (masked)
    const dbUrl = process.env.DATABASE_URL;
    const urlInfo = dbUrl ? {
      hasUrl: true,
      length: dbUrl.length,
      startsWith: dbUrl.substring(0, 10) + "...",
      endsWith: "..." + dbUrl.substring(dbUrl.length - 20),
      containsPooler: dbUrl.includes("pooler"),
      containsSupabase: dbUrl.includes("supabase")
    } : { hasUrl: false };
    
    console.log("Debug: DATABASE_URL info", urlInfo);
    
    // Try to connect with different methods
    
    // Method 1: Simple query
    console.log("Debug: Attempting simple query...");
    const simpleResult = await db.execute("SELECT 1 as test");
    console.log("Debug: Simple query result", simpleResult);
    
    // Method 2: Get database info
    console.log("Debug: Getting database info...");
    const dbInfo = await db.execute(`
      SELECT 
        current_database() as database,
        current_user as user,
        inet_server_addr() as host,
        inet_server_port() as port,
        version() as version
    `);
    
    return NextResponse.json({ 
      success: true,
      environment: process.env.NODE_ENV,
      dbUrl: urlInfo,
      simpleTest: Array.isArray(simpleResult) ? simpleResult[0] : simpleResult,
      databaseInfo: Array.isArray(dbInfo) ? dbInfo[0] : dbInfo,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error("Debug: Database error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET"
    });
    
    return NextResponse.json({ 
      success: false,
      error: {
        message: error.message,
        code: error.code,
        hint: getErrorHint(error)
      },
      envCheck: {
        DATABASE_URL: process.env.DATABASE_URL ? "Present" : "Missing",
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL ? "Yes" : "No"
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function getErrorHint(error: any): string {
  if (error.message.includes("connection refused")) {
    return "Database server is not reachable. Check host/port.";
  }
  if (error.message.includes("password authentication")) {
    return "Authentication failed. Check username/password.";
  }
  if (error.message.includes("database") && error.message.includes("does not exist")) {
    return "Database name is incorrect.";
  }
  if (error.message.includes("SSL")) {
    return "SSL connection required. Add ?sslmode=require to connection string.";
  }
  return "Check DATABASE_URL format and database permissions.";
}