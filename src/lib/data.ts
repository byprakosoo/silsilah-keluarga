import { Member, Relationship, MemberWithRelations } from "./types"
import { mockMembers, mockRelationships, getMemberWithRelations as mockGetMemberWithRelations, getMemberBySlug as mockGetMemberBySlug } from "./mock-data"

let dbAvailable: boolean | null = null
let queriesModule: typeof import("./queries") | null = null

async function ensureQueries() {
  if (queriesModule) return true
  if (dbAvailable === false) return false

  try {
    queriesModule = await import("./queries")
    await queriesModule.getAllMembers()
    dbAvailable = true
    return true
  } catch {
    dbAvailable = false
    queriesModule = null
    return false
  }
}

export async function getAllMembers(): Promise<Member[]> {
  if (await ensureQueries()) {
    try {
      return await queriesModule!.getAllMembers()
    } catch {
      // Fallback
    }
  }
  return mockMembers.filter((m) => !m.deletedAt)
}

export async function getMemberBySlug(slug: string): Promise<MemberWithRelations | null> {
  if (await ensureQueries()) {
    try {
      return await queriesModule!.getMemberBySlugWithRelations(slug)
    } catch {
      // Fallback
    }
  }
  return mockGetMemberBySlug(slug)
}

export async function getMemberWithRelations(memberId: string): Promise<MemberWithRelations | null> {
  if (await ensureQueries()) {
    try {
      return await queriesModule!.getMemberByIdWithRelations(memberId)
    } catch {
      // Fallback
    }
  }
  return mockGetMemberWithRelations(memberId)
}

export async function getAllRelationships(): Promise<Relationship[]> {
  if (await ensureQueries()) {
    try {
      return await queriesModule!.getAllRelationships()
    } catch {
      // Fallback
    }
  }
  return mockRelationships
}
