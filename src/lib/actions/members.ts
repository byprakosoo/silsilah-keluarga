"use server"

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { redirect } from "next/navigation"
import { eq, isNull, and, or, inArray } from "drizzle-orm"
import { db } from "@/db"
import { members, relationships } from "@/db/schema"
import { memberSchema, MemberInput } from "@/lib/validations"
import { MemberWithRelations } from "@/lib/types"
import { generateSlug } from "@/lib/slug"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/admin/login")
  }
}

export const getAllMembers = async () => {
  return db.select().from(members).where(isNull(members.deletedAt))
}

export const getMemberBySlug = async (slug: string) => {
  const result = await db
    .select()
    .from(members)
    .where(and(eq(members.slug, slug), isNull(members.deletedAt)))
    .limit(1)
  return result[0] || null
}

export async function getMemberWithRelations(memberOrId: string | typeof members.$inferSelect): Promise<MemberWithRelations | null> {
  let member: typeof members.$inferSelect | undefined
  if (typeof memberOrId === "string") {
    const result = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberOrId), isNull(members.deletedAt)))
      .limit(1)
    member = result[0]
  } else {
    member = memberOrId
  }
  if (!member) return null

  const rels = await db
    .select()
    .from(relationships)
    .where(
      or(
        eq(relationships.memberId, member.id),
        and(
          eq(relationships.relatedMemberId, member.id),
          eq(relationships.relationType, "parent"),
        ),
      ),
    )

  const parentIds = rels
    .filter((r) => r.memberId === member.id && r.relationType === "parent")
    .map((r) => r.relatedMemberId)
  const spouseIds = rels
    .filter((r) => r.memberId === member.id && r.relationType === "spouse")
    .map((r) => r.relatedMemberId)
  const childIds = rels
    .filter((r) => r.relatedMemberId === member.id && r.relationType === "parent")
    .map((r) => r.memberId)

  const allRelatedIds = [...new Set([...parentIds, ...spouseIds, ...childIds])]

  let relatedMembers: typeof members.$inferSelect[] = []
  if (allRelatedIds.length > 0) {
    relatedMembers = await db
      .select()
      .from(members)
      .where(
        and(
          isNull(members.deletedAt),
          inArray(members.id, allRelatedIds),
        ),
      )
  }

  return {
    ...member,
    parents: relatedMembers.filter((m) => parentIds.includes(m.id)),
    spouses: relatedMembers.filter((m) => spouseIds.includes(m.id)),
    children: relatedMembers.filter((m) => childIds.includes(m.id)),
  }
}

export async function getMemberBySlugWithRelations(slug: string): Promise<MemberWithRelations | null> {
  const member = await getMemberBySlug(slug)
  if (!member) return null
  return getMemberWithRelations(member)
}

export const getSearchItems = unstable_cache(
  async () => {
    const rows = await db
      .select({ id: members.id, slug: members.slug, fullName: members.fullName, generation: members.generation })
      .from(members)
      .where(isNull(members.deletedAt))
      .orderBy(members.generation, members.fullName)
    return rows
  },
  ["search-items"],
  { revalidate: 3600, tags: ["members"] }
)

export async function createMember(data: MemberInput) {
  await requireAdmin()

  const parsed = memberSchema.parse(data)

  const birthYear = parsed.birthDate
    ? new Date(parsed.birthDate).getFullYear()
    : undefined

  const slug = generateSlug(parsed.fullName, birthYear)

  await db.insert(members).values({
    slug,
    fullName: parsed.fullName,
    nickname: parsed.nickname || null,
    gender: parsed.gender,
    birthDate: parsed.birthDate || null,
    birthPlace: parsed.birthPlace || null,
    deathDate: parsed.deathDate || null,
    deathPlace: parsed.deathPlace || null,
    isAlive: parsed.isAlive,
    religion: parsed.religion || null,
    occupation: parsed.occupation || null,
    bio: parsed.bio || null,
    address: parsed.address || null,
    generation: parsed.generation,
    photoUrl: parsed.photoUrl || null,
  })

  revalidatePath("/")
  revalidatePath("/anggota")
  revalidatePath("/admin/anggota")
  revalidateTag("members", "default")
  redirect("/admin/anggota")
}
export async function updateMember(id: string, data: MemberInput) {
  await requireAdmin()

  const parsed = memberSchema.parse(data)

  const birthYear = parsed.birthDate
    ? new Date(parsed.birthDate).getFullYear()
    : undefined

  const slug = generateSlug(parsed.fullName, birthYear)

  await db
    .update(members)
    .set({
      slug,
      fullName: parsed.fullName,
      nickname: parsed.nickname || null,
      gender: parsed.gender,
      birthDate: parsed.birthDate || null,
      birthPlace: parsed.birthPlace || null,
      deathDate: parsed.deathDate || null,
      deathPlace: parsed.deathPlace || null,
      isAlive: parsed.isAlive,
      religion: parsed.religion || null,
      occupation: parsed.occupation || null,
      bio: parsed.bio || null,
      address: parsed.address || null,
      generation: parsed.generation,
      photoUrl: parsed.photoUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(members.id, id))

  revalidatePath("/")
  revalidatePath("/anggota")
  revalidatePath(`/anggota/${slug}`)
  revalidatePath("/admin/anggota")
  revalidateTag("members", "default")
  redirect("/admin/anggota")
}

export async function deleteMember(id: string) {
  await requireAdmin()

  await db
    .update(members)
    .set({ deletedAt: new Date() })
    .where(eq(members.id, id))

  revalidatePath("/")
  revalidatePath("/anggota")
  revalidatePath("/admin/anggota")
  revalidateTag("members", "default")
}

export async function saveNodePosition(memberId: string, x: number, y: number) {
  await requireAdmin()

  await db
    .update(members)
    .set({ positionX: Math.round(x), positionY: Math.round(y), updatedAt: new Date() })
    .where(eq(members.id, memberId))

  revalidateTag("members", "default")
}
