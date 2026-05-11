import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

declare global {
  var __pasaheroph_db: ReturnType<typeof drizzle> | undefined;
}

function buildDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = globalThis.__pasaheroph_db ?? buildDb();
if (process.env.NODE_ENV !== "production" && db) {
  globalThis.__pasaheroph_db = db;
}

export { schema };
