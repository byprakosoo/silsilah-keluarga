import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

let dbInstance: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (dbInstance) return dbInstance

  const url = process.env.DATABASE_URL
  if (!url || url.includes("user:password") || url.includes("replace")) {
    return null
  }

  try {
    const sql = neon(url)
    dbInstance = drizzle(sql, { schema })
    return dbInstance
  } catch {
    return null
  }
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const db = getDb()
    if (!db) {
      throw new Error("DATABASE_URL not configured or invalid. Using mock data fallback.")
    }
    return (db as unknown as Record<string, unknown>)[prop as string]
  },
})
