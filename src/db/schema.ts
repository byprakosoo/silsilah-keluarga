import {
  pgTable,
  uuid,
  varchar,
  date,
  boolean,
  text,
  timestamp,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core"

// ============================================================
// Better Auth tables
// ============================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  providerId: text("providerId").notNull(),
  accountId: text("accountId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// ============================================================
// App tables
// ============================================================

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 100 }),
  gender: varchar("gender", { length: 10 }).notNull(),
  birthDate: date("birth_date"),
  birthPlace: varchar("birth_place", { length: 255 }),
  deathDate: date("death_date"),
  deathPlace: varchar("death_place", { length: 255 }),
  isAlive: boolean("is_alive").default(true).notNull(),
  religion: varchar("religion", { length: 100 }),
  occupation: varchar("occupation", { length: 255 }),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  address: text("address"),
  generation: integer("generation").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
})

export const relationships = pgTable("relationships", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  relatedMemberId: uuid("related_member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  relationType: varchar("relation_type", { length: 20 }).notNull(),
  marriageDate: date("marriage_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
