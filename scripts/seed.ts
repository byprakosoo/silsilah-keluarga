import "dotenv/config"

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { randomUUID, randomBytes, scrypt } from "crypto"
import * as schema from "../src/db/schema"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex")
    scrypt(
      password.normalize("NFKC"),
      salt,
      64,
      { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
      (err, key) => {
        if (err) reject(err)
        else resolve(`${salt}:${key.toString("hex")}`)
      },
    )
  })
}

async function ensureBetterAuthTables() {
  // Create Better Auth tables if they don't exist
  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "emailVerified" BOOLEAN NOT NULL DEFAULT false,
      "image" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS "session" (
      "id" TEXT PRIMARY KEY,
      "expiresAt" TIMESTAMP NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS "account" (
      "id" TEXT PRIMARY KEY,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" TIMESTAMP,
      "refreshTokenExpiresAt" TIMESTAMP,
      "scope" TEXT,
      "password" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS "verification" (
      "id" TEXT PRIMARY KEY,
      "identifier" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expiresAt" TIMESTAMP NOT NULL,
      "createdAt" TIMESTAMP DEFAULT now(),
      "updatedAt" TIMESTAMP DEFAULT now()
    )
  `
  console.log("Better Auth tables ready")
}

async function seed() {
  console.log("Seeding database...")

  await ensureBetterAuthTables()

  // Create admin user in Better Auth tables
  const adminEmail = process.env.ADMIN_EMAIL || "admin@keluarga.id"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
  const adminId = randomUUID()
  const accountRowId = randomUUID()
  const passwordHash = await hashPassword(adminPassword)
  const now = new Date().toISOString()

  // Delete existing admin if any
  await sql`DELETE FROM "user" WHERE email = ${adminEmail}`

  // Insert user
  await sql`
    INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
    VALUES (${adminId}, 'Admin Keluarga', ${adminEmail}, true, ${now}, ${now})
  `

  // Insert account (credential provider)
  await sql`
    INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
    VALUES (${accountRowId}, ${adminEmail}, 'credential', ${adminId}, ${passwordHash}, ${now}, ${now})
  `

  console.log(`Admin user created: ${adminEmail}`)

  // Insert sample members
  const membersData = [
    { slug: "suparto-1920", fullName: "Suparto Wibowo", nickname: "Mbah Parto", gender: "male", birthDate: "1920-03-15", birthPlace: "Yogyakarta", deathDate: "2005-11-20", deathPlace: "Yogyakarta", isAlive: false, religion: "Islam", occupation: "Petani", bio: "Leluhur pertama keluarga besar Wibowo.", generation: 1 },
    { slug: "sri-wahyuni-1925", fullName: "Sri Wahyuni", nickname: "Mbah Sri", gender: "female", birthDate: "1925-08-22", birthPlace: "Klaten", deathDate: "2010-02-14", deathPlace: "Yogyakarta", isAlive: false, religion: "Islam", occupation: "Ibu Rumah Tangga", bio: "Istri Suparto Wibowo.", generation: 1 },
    { slug: "budi-santoso-1950", fullName: "Budi Santoso", nickname: "Pak Budi", gender: "male", birthDate: "1950-07-01", birthPlace: "Yogyakarta", isAlive: true, religion: "Islam", occupation: "PNS Pensiunan", bio: "Anak pertama Suparto dan Sri.", generation: 2 },
    { slug: "dewi-sartika-1955", fullName: "Dewi Sartika", nickname: "Bu Dewi", gender: "female", birthDate: "1955-11-12", birthPlace: "Magelang", isAlive: true, religion: "Islam", occupation: "Guru", bio: "Istri Budi Santoso.", generation: 2 },
    { slug: "edi-prasetyo-1978", fullName: "Edi Prasetyo", nickname: "Mas Edi", gender: "male", birthDate: "1978-04-20", birthPlace: "Yogyakarta", isAlive: true, religion: "Islam", occupation: "Software Engineer", bio: "Anak pertama Budi dan Dewi.", generation: 3 },
    { slug: "rina-melati-1980", fullName: "Rina Melati", nickname: "Mbak Rina", gender: "female", birthDate: "1980-09-05", birthPlace: "Yogyakarta", isAlive: true, religion: "Islam", occupation: "Dokter", bio: "Anak kedua Budi dan Dewi.", generation: 3 },
    { slug: "ratna-kusuma-1960", fullName: "Ratna Kusuma", nickname: "Bu Ratna", gender: "female", birthDate: "1960-02-28", birthPlace: "Yogyakarta", isAlive: true, religion: "Islam", occupation: "Pengusaha", bio: "Anak kedua Suparto dan Sri.", generation: 2 },
    { slug: "agung-pratama-1985", fullName: "Agung Pratama", nickname: "Agung", gender: "male", birthDate: "1985-12-25", birthPlace: "Yogyakarta", isAlive: true, religion: "Islam", occupation: "Arsitek", bio: "Anak Ratna Kusuma.", generation: 3 },
    { slug: "ayu-lestari-2020", fullName: "Ayu Lestari", nickname: "Ayu", gender: "female", birthDate: "2020-01-10", birthPlace: "Jakarta", isAlive: true, religion: "Islam", generation: 4 },
    { slug: "dimas-pratama-2022", fullName: "Dimas Pratama", nickname: "Dimas", gender: "male", birthDate: "2022-05-15", birthPlace: "Jakarta", isAlive: true, religion: "Islam", generation: 4 },
  ]

  for (const member of membersData) {
    await db.insert(schema.members).values(member).onConflictDoNothing()
  }

  // Build relationships
  const allMembers = await db.select().from(schema.members)
  const nameToId = new Map<string, string>()
  for (const m of allMembers) {
    const first = m.fullName.toLowerCase().split(" ")[0]
    nameToId.set(first, m.id)
  }

  const relations: [string, string, string][] = [
    ["budi", "suparto", "parent"], ["budi", "sri", "parent"],
    ["ratna", "suparto", "parent"], ["ratna", "sri", "parent"],
    ["edi", "budi", "parent"], ["edi", "dewi", "parent"],
    ["rina", "budi", "parent"], ["rina", "dewi", "parent"],
    ["agung", "ratna", "parent"],
    ["ayu", "edi", "parent"], ["dimas", "edi", "parent"],
    ["suparto", "sri", "spouse"], ["sri", "suparto", "spouse"],
    ["budi", "dewi", "spouse"], ["dewi", "budi", "spouse"],
  ]

  for (const [first, relFirst, relType] of relations) {
    const memberId = nameToId.get(first)
    const relatedId = nameToId.get(relFirst)
    if (memberId && relatedId) {
      await db.insert(schema.relationships).values({
        memberId, relatedMemberId: relatedId, relationType: relType,
      }).onConflictDoNothing()
    }
  }

  console.log("Seeding complete!")
  process.exit(0)
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
