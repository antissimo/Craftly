// db/index.ts - VERIFIED CONFIG FOR VERCEL + SUPABASE
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// IMPORTANT: For Supabase pooled connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("FATAL: DATABASE_URL is not defined");
  throw new Error("DATABASE_URL is not defined in environment variables");
}

console.log("DB Config: Creating pool with URL starting with:", connectionString.substring(0, 30) + "...");

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export const db = drizzle(pool, { schema });