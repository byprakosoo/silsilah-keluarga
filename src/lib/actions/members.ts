"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { eq, isNull, and, or, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { members, relationships } from "@/db/schema";
import { memberSchema, MemberInput } from "@/lib/validations";
import { MemberWithRelations } from "@/lib/types";
import { generateSlug } from "@/lib/slug";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/admin/login");
  }
}

export const getAllMembers = async () => {
  // Select all EXCEPT photo_url (8MB base64!) — use boolean has_photo instead
  const rows = await db
    .select({
      id: members.id,
      slug: members.slug,
      fullName: members.fullName,
      nickname: members.nickname,
      gender: members.gender,
      birthDate: members.birthDate,
      birthPlace: members.birthPlace,
      deathDate: members.deathDate,
      deathPlace: members.deathPlace,
      isAlive: members.isAlive,
      religion: members.religion,
      occupation: members.occupation,
      bio: members.bio,
      address: members.address,
      generation: members.generation,
      createdAt: members.createdAt,
      updatedAt: members.updatedAt,
      deletedAt: members.deletedAt,
      positionX: members.positionX,
      positionY: members.positionY,
      hasPhoto: sql<boolean>`CASE WHEN ${members.photoUrl} IS NOT NULL THEN true ELSE false END`,
    })
    .from(members)
    .where(isNull(members.deletedAt));

  return rows.map((r) => ({
    ...r,
    photoUrl: r.hasPhoto ? `/api/members/${r.id}/photo` : null,
    hasPhoto: undefined,
  }));
};

/** Lightweight query for the family tree canvas — excludes photo_url (8MB base64!) */
export const getTreeMembers = async () => {
  const rows = await db
    .select({
      id: members.id,
      slug: members.slug,
      fullName: members.fullName,
      nickname: members.nickname,
      gender: members.gender,
      birthDate: members.birthDate,
      deathDate: members.deathDate,
      isAlive: members.isAlive,
      hasPhoto: sql<boolean>`CASE WHEN ${members.photoUrl} IS NOT NULL THEN true ELSE false END`,
      generation: members.generation,
      positionX: members.positionX,
      positionY: members.positionY,
    })
    .from(members)
    .where(isNull(members.deletedAt));

  return rows.map((r) => ({
    ...r,
    photoUrl: r.hasPhoto ? `/api/members/${r.id}/photo` : null,
    hasPhoto: undefined,
  }));
};

export async function getPaginatedMembers(opts: {
    page?: number;
    limit?: number;
    search?: string;
    generation?: number;
    status?: "alive" | "deceased" | "all";
  }) {
    const limit = opts.limit ?? 12;
    const offset = ((opts.page ?? 1) - 1) * limit;

    const conditions = [isNull(members.deletedAt)];

    if (opts.generation != null) {
      conditions.push(eq(members.generation, opts.generation));
    }
    if (opts.status === "alive") {
      conditions.push(eq(members.isAlive, true));
    } else if (opts.status === "deceased") {
      conditions.push(eq(members.isAlive, false));
    }
    if (opts.search) {
      const q = `%${opts.search.toLowerCase()}%`;
      const searchCondition = or(
        sql`LOWER(${members.fullName}) LIKE ${q}`,
        sql`LOWER(${members.nickname}) LIKE ${q}`,
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const where = and(...conditions);

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(members)
        .where(where)
        .orderBy(members.generation, members.fullName)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(members)
        .where(where),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);

    return {
      members: rows,
      total,
      page: opts.page ?? 1,
      totalPages: Math.ceil(total / limit),
    };
}

export const getGenerationOptions = unstable_cache(
  async () => {
    const rows = await db
      .selectDistinct({ generation: members.generation })
      .from(members)
      .where(isNull(members.deletedAt))
      .orderBy(members.generation);
    return rows.map((r) => r.generation);
  },
  ["generation-options"],
  { revalidate: 3600, tags: ["members"] },
);

export const getMemberBySlug = async (slug: string) => {
  const result = await db
    .select()
    .from(members)
    .where(and(eq(members.slug, slug), isNull(members.deletedAt)))
    .limit(1);
  return result[0] || null;
};

export async function getMemberWithRelations(
  memberOrId: string | typeof members.$inferSelect,
): Promise<MemberWithRelations | null> {
  // Helper: select all member columns EXCEPT photo_url (base64 blob!)
  const memberColumns = {
    id: members.id,
    slug: members.slug,
    fullName: members.fullName,
    nickname: members.nickname,
    gender: members.gender,
    birthDate: members.birthDate,
    birthPlace: members.birthPlace,
    deathDate: members.deathDate,
    deathPlace: members.deathPlace,
    isAlive: members.isAlive,
    religion: members.religion,
    occupation: members.occupation,
    bio: members.bio,
    address: members.address,
    generation: members.generation,
    createdAt: members.createdAt,
    updatedAt: members.updatedAt,
    deletedAt: members.deletedAt,
    positionX: members.positionX,
    positionY: members.positionY,
    hasPhoto: sql<boolean>`CASE WHEN ${members.photoUrl} IS NOT NULL THEN true ELSE false END`,
  };

  // Helper: replace hasPhoto with API endpoint URL
  const mapPhoto = (m: any) => ({
    ...m,
    photoUrl: m.hasPhoto ? `/api/members/${m.id}/photo` : null,
    hasPhoto: undefined,
  });

  let member: typeof members.$inferSelect | undefined;
  if (typeof memberOrId === "string") {
    const result = await db
      .select(memberColumns)
      .from(members)
      .where(and(eq(members.id, memberOrId), isNull(members.deletedAt)))
      .limit(1);
    member = result[0] as any;
  } else {
    member = memberOrId;
  }
  if (!member) return null;

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
    );

  const parentIds = rels
    .filter((r) => r.memberId === member.id && r.relationType === "parent")
    .map((r) => r.relatedMemberId);
  const spouseIds = rels
    .filter((r) => r.memberId === member.id && r.relationType === "spouse")
    .map((r) => r.relatedMemberId);
  const childIds = rels
    .filter(
      (r) => r.relatedMemberId === member.id && r.relationType === "parent",
    )
    .map((r) => r.memberId);

  const allRelatedIds = [...new Set([...parentIds, ...spouseIds, ...childIds])];

  // Fetch siblings: all members sharing any parent with this member
  let siblingIds: string[] = [];
  if (parentIds.length > 0) {
    const siblingRels = await db
      .select()
      .from(relationships)
      .where(
        and(
          inArray(relationships.relatedMemberId, parentIds),
          eq(relationships.relationType, "parent"),
          ne(relationships.memberId, member.id),
        ),
      );
    siblingIds = [...new Set(siblingRels.map((r) => r.memberId))];
  }

  const allRelatedIdsFinal = [...new Set([...allRelatedIds, ...siblingIds])];

  let relatedMembers: any[] = [];
  if (allRelatedIdsFinal.length > 0) {
    const rows = await db
      .select(memberColumns)
      .from(members)
      .where(
        and(isNull(members.deletedAt), inArray(members.id, allRelatedIdsFinal)),
      );
    relatedMembers = rows.map(mapPhoto);
  }

  return {
    ...mapPhoto(member),
    parents: relatedMembers.filter((m) => parentIds.includes(m.id)),
    spouses: relatedMembers.filter((m) => spouseIds.includes(m.id)),
    children: relatedMembers.filter((m) => childIds.includes(m.id)),
    siblings: relatedMembers.filter((m) => siblingIds.includes(m.id)),
  };
}

export async function getMemberBySlugWithRelations(
  slug: string,
): Promise<MemberWithRelations | null> {
  const member = await getMemberBySlug(slug);
  if (!member) return null;
  return getMemberWithRelations(member);
}

export const getSearchItems = unstable_cache(
  async () => {
    const rows = await db
      .select({
        id: members.id,
        slug: members.slug,
        fullName: members.fullName,
        generation: members.generation,
      })
      .from(members)
      .where(isNull(members.deletedAt))
      .orderBy(members.generation, members.fullName);
    return rows;
  },
  ["search-items"],
  { revalidate: 3600, tags: ["members"] },
);

export async function createMember(data: MemberInput) {
  await requireAdmin();

  const parsed = memberSchema.parse(data);

  const birthYear = parsed.birthDate
    ? new Date(parsed.birthDate).getFullYear()
    : undefined;

  const slug = generateSlug(parsed.fullName, birthYear);

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
  });

  revalidatePath("/");
  revalidatePath("/anggota");
  revalidatePath("/admin/anggota");
  revalidateTag("members", "default");
  redirect("/admin/anggota");
}
export async function updateMember(id: string, data: MemberInput) {
  await requireAdmin();

  const parsed = memberSchema.parse(data);

  const birthYear = parsed.birthDate
    ? new Date(parsed.birthDate).getFullYear()
    : undefined;

  const slug = generateSlug(parsed.fullName, birthYear);

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
    .where(eq(members.id, id));

  revalidatePath("/");
  revalidatePath("/anggota");
  revalidatePath(`/anggota/${slug}`);
  revalidatePath("/admin/anggota");
  revalidateTag("members", "default");
  redirect("/admin/anggota");
}

export async function deleteMember(id: string) {
  await requireAdmin();

  await db
    .update(members)
    .set({ deletedAt: new Date() })
    .where(eq(members.id, id));

  revalidatePath("/");
  revalidatePath("/anggota");
  revalidatePath("/admin/anggota");
  revalidateTag("members", "default");
}

export async function saveNodePosition(memberId: string, x: number, y: number) {
  await requireAdmin();

  await db
    .update(members)
    .set({
      positionX: Math.round(x),
      positionY: Math.round(y),
      updatedAt: new Date(),
    })
    .where(eq(members.id, memberId));

  revalidateTag("members", "default");
}
