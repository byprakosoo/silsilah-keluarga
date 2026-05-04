import { eq, and, isNull } from "drizzle-orm"
import { db } from "@/db"
import { members, relationships } from "@/db/schema"
import { Member, Relationship, MemberWithRelations } from "@/lib/types"

export async function getAllMembers(): Promise<Member[]> {
  return db
    .select()
    .from(members)
    .where(isNull(members.deletedAt))
    .orderBy(members.generation, members.fullName)
}

export async function getAllRelationships(): Promise<Relationship[]> {
  return db.select().from(relationships)
}

export async function getMemberBySlug(slug: string): Promise<Member | null> {
  const result = await db
    .select()
    .from(members)
    .where(and(eq(members.slug, slug), isNull(members.deletedAt)))
    .limit(1)
  return result[0] || null
}

export async function getMemberById(id: string): Promise<Member | null> {
  const result = await db
    .select()
    .from(members)
    .where(and(eq(members.id, id), isNull(members.deletedAt)))
    .limit(1)
  return result[0] || null
}

export async function getMemberBySlugWithRelations(slug: string): Promise<MemberWithRelations | null> {
  const member = await getMemberBySlug(slug)
  if (!member) return null
  return getMemberByIdWithRelations(member.id)
}

export async function getMemberByIdWithRelations(memberId: string): Promise<MemberWithRelations | null> {
  const member = await getMemberById(memberId)
  if (!member) return null

  const allRels = await db.select().from(relationships)

  const myRels = allRels.filter((r) => r.memberId === memberId)
  const parentIds = myRels.filter((r) => r.relationType === "parent").map((r) => r.relatedMemberId)
  const spouseIds = myRels.filter((r) => r.relationType === "spouse").map((r) => r.relatedMemberId)

  const childRelations = allRels.filter(
    (r) => r.relatedMemberId === memberId && r.relationType === "parent"
  )
  const childIds = childRelations.map((r) => r.memberId)

  const parentMembers = await db
    .select()
    .from(members)
    .where(and(isNull(members.deletedAt)))

  // Siblings: all members sharing any parent with this member
  const siblingIds = parentIds.length > 0
    ? allRels
        .filter(
          (r) =>
            parentIds.includes(r.relatedMemberId) &&
            r.relationType === "parent" &&
            r.memberId !== memberId
        )
        .map((r) => r.memberId)
    : []

  return {
    ...member,
    parents: parentMembers.filter((m) => parentIds.includes(m.id)),
    spouses: parentMembers.filter((m) => spouseIds.includes(m.id)),
    children: parentMembers.filter((m) => childIds.includes(m.id)),
    siblings: parentMembers.filter((m) => siblingIds.includes(m.id)),
  }
}
