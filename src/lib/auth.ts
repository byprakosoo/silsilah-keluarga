import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getDb } from "@/db"
import { user, session, account, verification } from "@/db/schema"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _instance: any = null

function getAuth() {
  if (_instance) return _instance

  const db = getDb()
  if (!db) {
    throw new Error("DATABASE_URL not configured. Auth is unavailable.")
  }

  _instance = betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { user, session, account, verification },
    }),
    emailAndPassword: { enabled: true },
    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  })

  return _instance
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth: any = new Proxy(getAuth, {
  get(_target, prop) {
    return getAuth()[prop as string]
  },
  has(_target, prop) {
    return prop in getAuth()
  },
  apply(_target, _thisArg, args) {
    return getAuth()(args[0])
  },
})
