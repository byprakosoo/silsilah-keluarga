import { Member, Relationship, FamilyTreeNode, FamilyTreeEdge } from "./types"

export function membersToNodesAndEdges(
  members: Member[],
  relationships: Relationship[]
): { nodes: FamilyTreeNode[]; edges: FamilyTreeEdge[] } {
  const validMembers = members.filter((m) => !m.deletedAt)
  const memberMap = new Map(validMembers.map((m) => [m.id, m]))

  const nodes: FamilyTreeNode[] = validMembers.map((member, index) => ({
    id: member.id,
    type: "familyMember",
    position: { x: 0, y: 0 },
    data: {
      member,
      onClick: (slug: string) => {},
    },
  }))

  const edges: FamilyTreeEdge[] = []
  const seenPairs = new Set<string>()

  for (const rel of relationships) {
    const source = memberMap.get(rel.memberId)
    const target = memberMap.get(rel.relatedMemberId)
    if (!source || !target) continue

    const pairKey =
      rel.relationType === "spouse"
        ? [rel.memberId, rel.relatedMemberId].sort().join("-")
        : `${rel.memberId}-${rel.relatedMemberId}`

    if (seenPairs.has(pairKey)) continue
    seenPairs.add(pairKey)

    if (rel.relationType === "parent") {
      edges.push({
        id: `e-${rel.id}`,
        source: rel.relatedMemberId,
        target: rel.memberId,
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "smoothstep",
        data: { relationType: "parent" },
      })
    } else if (rel.relationType === "spouse") {
      if (rel.memberId < rel.relatedMemberId) {
        edges.push({
          id: `e-${rel.id}`,
          source: rel.memberId,
          target: rel.relatedMemberId,
          sourceHandle: "right",
          targetHandle: "left",
          type: "spouseEdge",
          data: { relationType: "spouse" },
        })
      }
    }
  }

  return { nodes, edges }
}

export function getGenerationColor(generation: number): string {
  const colors = [
    "#8B5E3C",
    "#9B7353",
    "#AB886A",
    "#BB9D81",
    "#CBB398",
    "#DBC8AF",
  ]
  return colors[Math.min(generation - 1, colors.length - 1)]
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatYear(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).getFullYear().toString()
}

export function getYearSpan(member: Member): string {
  if (member.birthDate && member.deathDate) {
    return `${formatYear(member.birthDate)}–${formatYear(member.deathDate)}`
  }
  if (member.birthDate) {
    return `Lahir ${formatYear(member.birthDate)}`
  }
  return ""
}

export function getGenerationLabel(generation: number): string {
  const labels: Record<number, string> = {
    1: "Leluhur",
    2: "Anak",
    3: "Cucu",
    4: "Cicit",
    5: "Buyut",
  }
  return labels[generation] || `Generasi ke-${generation}`
}

export function generateSlug(fullName: string, birthYear?: number): string {
  const base = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
  return birthYear ? `${base}-${birthYear}` : base
}
