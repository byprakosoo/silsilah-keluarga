"use client"

import { useState, useCallback } from "react"
import { FamilyTree } from "@/components/family-tree/family-tree"
import { useLayoutedTree } from "@/components/family-tree/use-layouted-tree"
import { NodeDetailSheet } from "@/components/family-tree/node-detail-sheet"
import { membersToNodesAndEdges } from "@/lib/tree-utils"
import { Member, Relationship, MemberWithRelations } from "@/lib/types"
import { saveNodePosition } from "@/lib/actions/members"

interface FamilyTreeClientProps {
  members: Member[]
  relationships: Relationship[]
}

function buildMemberWithRelations(
  memberId: string,
  members: Member[],
  relationships: Relationship[]
): MemberWithRelations | null {
  const member = members.find((m) => m.id === memberId)
  if (!member) return null

  const myRels = relationships.filter((r) => r.memberId === memberId)
  const parentIds = myRels.filter((r) => r.relationType === "parent").map((r) => r.relatedMemberId)
  const spouseIds = myRels.filter((r) => r.relationType === "spouse").map((r) => r.relatedMemberId)

  const childIds = relationships
    .filter((r) => r.relatedMemberId === memberId && r.relationType === "parent")
    .map((r) => r.memberId)

  const parents = members.filter((m) => parentIds.includes(m.id))
  const siblings = findSiblings(memberId, parents.map((p) => p.id), members, relationships)
  const birthOrder = siblings.length > 0 ? siblings.findIndex((s) => s.id === memberId) + 1 : undefined
  const totalSiblings = siblings.length > 0 ? siblings.length : undefined

  return {
    ...member,
    parents,
    spouses: members.filter((m) => spouseIds.includes(m.id)),
    children: members.filter((m) => childIds.includes(m.id)),
    siblings,
    birthOrder,
    totalSiblings,
  }
}

function findSiblings(
  memberId: string,
  parentIds: string[],
  members: Member[],
  relationships: Relationship[]
): Member[] {
  if (parentIds.length === 0) return []

  const siblingSets = parentIds.map((parentId) => {
    const childIds = relationships
      .filter((r) => r.relatedMemberId === parentId && r.relationType === "parent")
      .map((r) => r.memberId)
    return new Set(childIds)
  })

  const commonChildren = [...siblingSets[0]].filter((id) =>
    siblingSets.every((s) => s.has(id))
  )

  return members
    .filter((m) => commonChildren.includes(m.id))
    .sort((a, b) => {
      if (!a.birthDate) return 1
      if (!b.birthDate) return -1
      return new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime()
    })
}

export function FamilyTreeClient({ members, relationships }: FamilyTreeClientProps) {
  const [selectedMember, setSelectedMember] = useState<MemberWithRelations | null>(null)
  const [spouseMarriageDates, setSpouseMarriageDates] = useState<Record<string, string | null>>({})
  const [sheetOpen, setSheetOpen] = useState(false)

  const { nodes, edges } = membersToNodesAndEdges(members, relationships)
  const layouted = useLayoutedTree({ nodes, edges })

  const handleNodeClick = useCallback((slug: string) => {
    const m = members.find((mbr) => mbr.slug === slug)
    if (!m) return
    const enriched = buildMemberWithRelations(m.id, members, relationships)
    if (enriched) {
      const spouseMarriageDates: Record<string, string | null> = {}
      for (const spouse of enriched.spouses) {
        const rel = relationships.find(
          (r) =>
            r.relationType === "spouse" &&
            r.memberId === m.id &&
            r.relatedMemberId === spouse.id
        )
        spouseMarriageDates[spouse.id] = rel?.marriageDate ?? null
      }
      setSelectedMember(enriched)
      setSpouseMarriageDates(spouseMarriageDates)
      setSheetOpen(true)
    }
  }, [members, relationships])

  const handleNodePositionChange = useCallback(
    (memberId: string, x: number, y: number) => {
      saveNodePosition(memberId, x, y)
    },
    []
  )

  return (
    <>
      <FamilyTree
        initialNodes={layouted.nodes}
        initialEdges={layouted.edges}
        onNodeClick={handleNodeClick}
        onNodePositionChange={handleNodePositionChange}
      />
      <NodeDetailSheet
        member={selectedMember}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        spouseMarriageDates={spouseMarriageDates}
      />
    </>
  )
}
