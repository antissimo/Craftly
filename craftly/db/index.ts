// db/index.ts - Working configuration for Supabase on Vercel
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Get DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });