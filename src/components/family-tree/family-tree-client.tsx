"use client";

import { useState, useCallback } from "react";
import { FamilyTree } from "@/components/family-tree/family-tree";
import { useLayoutedTree } from "@/components/family-tree/use-layouted-tree";
import { NodeDetailSheet } from "@/components/family-tree/node-detail-sheet";
import { membersToNodesAndEdges } from "@/lib/tree-utils";
import { Relationship, MemberWithRelations, TreeMember } from "@/lib/types";
import { saveNodePosition, getMemberWithRelations } from "@/lib/actions/members";

interface FamilyTreeClientProps {
  members: TreeMember[];
  relationships: Relationship[];
}

export function FamilyTreeClient({
  members,
  relationships,
}: FamilyTreeClientProps) {
  const [selectedMember, setSelectedMember] =
    useState<MemberWithRelations | null>(null);
  const [spouseMarriageDates, setSpouseMarriageDates] = useState<
    Record<string, string | null>
  >({});
  const [sheetOpen, setSheetOpen] = useState(false);

  const { nodes, edges } = membersToNodesAndEdges(members, relationships);
  const layouted = useLayoutedTree({ nodes, edges });

  const handleNodeClick = useCallback(
    async (slug: string) => {
      const m = members.find((mbr) => mbr.slug === slug);
      if (!m) return;
      // Fetch full member data on demand
      const enriched = await getMemberWithRelations(m.id);
      if (enriched) {
        const spouseMarriageDates: Record<string, string | null> = {};
        for (const spouse of enriched.spouses) {
          const rel = relationships.find(
            (r) =>
              r.relationType === "spouse" &&
              r.memberId === m.id &&
              r.relatedMemberId === spouse.id,
          );
          spouseMarriageDates[spouse.id] = rel?.marriageDate ?? null;
        }
        setSelectedMember(enriched);
        setSpouseMarriageDates(spouseMarriageDates);
        setSheetOpen(true);
      }
    },
    [members, relationships],
  );

  const handleNodePositionChange = useCallback(
    (memberId: string, x: number, y: number) => {
      saveNodePosition(memberId, x, y);
    },
    [],
  );

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
  );
}
