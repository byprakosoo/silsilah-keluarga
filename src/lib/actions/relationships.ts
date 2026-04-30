"use server"

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { relationships } from "@/db/schema"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/admin/login")
  }
}

export const getRelationships = unstable_cache(
  async () => {
    return db.select().from(relationships)
  },
  ["all-relationships"],
  { revalidate: 3600, tags: ["members"] }
)

export async function getRelationsForMember(memberId: string) {
  return db.select().from(relationships).where(eq(relationships.memberId, memberId))
}

export async function getChildrenOfMember(memberId: string) {
  return db
    .select()
    .from(relationships)
    .where(
      and(
        eq(relationships.relatedMemberId, memberId),
        eq(relationships.relationType, "parent")
      )
    )
}

export async function setRelations(
  memberId: string,
  fatherId: string | null,
  motherId: string | null,
  spouseId: string | null,
  marriageDate: string | null = null
) {
  await requireAdmin()

  // Remove existing parent relationships
  await db
    .delete(relationships)
    .where(
      and(
        eq(relationships.memberId, memberId),
        eq(relationships.relationType, "parent")
      )
    )

  // Insert new parent relationships
  const parentInserts: { memberId: string; relatedMemberId: string; relationType: string }[] = []
  if (fatherId) {
    parentInserts.push({ memberId, relatedMemberId: fatherId, relationType: "parent" })
  }
  if (motherId) {
    parentInserts.push({ memberId, relatedMemberId: motherId, relationType: "parent" })
  }

  if (parentInserts.length > 0) {
    await db.insert(relationships).values(parentInserts)
  }

  // Remove existing spouse relationships for both sides
  await db
    .delete(relationships)
    .where(
      and(
        eq(relationships.relationType, "spouse"),
        eq(relationships.memberId, memberId)
      )
    )
  // Also remove the reverse spouse relationship
  const existingSpouses = await db
    .select()
    .from(relationships)
    .where(
      and(
        eq(relationships.relationType, "spouse"),
        eq(relationships.relatedMemberId, memberId)
      )
    )
  for (const rel of existingSpouses) {
    await db
      .delete(relationships)
      .where(eq(relationships.id, rel.id))
  }

  // Insert new spouse relationships (bidirectional)
  if (spouseId) {
    await db.insert(relationships).values([
      { memberId, relatedMemberId: spouseId, relationType: "spouse", marriageDate: marriageDate || null },
      { memberId: spouseId, relatedMemberId: memberId, relationType: "spouse", marriageDate: marriageDate || null },
    ])
  }

  revalidatePath("/")
  revalidatePath("/anggota")
  revalidatePath("/admin/anggota")
  revalidateTag("members", "default")
}
