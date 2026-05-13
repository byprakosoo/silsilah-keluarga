import { Member, TreeMember, Relationship, FamilyTreeNode, FamilyTreeEdge } from "./types";
import dagre from "@dagrejs/dagre";

const NODE_WIDTH = 170;
const NODE_WIDTH_DESKTOP = 220;
const NODE_HEIGHT = 85;
const NODE_HEIGHT_DESKTOP = 100;

export function membersToNodesAndEdges(
  members: TreeMember[],
  relationships: Relationship[],
): { nodes: FamilyTreeNode[]; edges: FamilyTreeEdge[] } {
  const validMembers = members;
  const memberMap = new Map(validMembers.map((m) => [m.id, m]));

  const nodes: FamilyTreeNode[] = validMembers.map((member, index) => ({
    id: member.id,
    type: "familyMember",
    position: { x: 0, y: 0 },
    data: {
      member,
    },
  }));

  const edges: FamilyTreeEdge[] = [];
  const seenPairs = new Set<string>();

  for (const rel of relationships) {
    const source = memberMap.get(rel.memberId);
    const target = memberMap.get(rel.relatedMemberId);
    if (!source || !target) continue;

    const pairKey =
      rel.relationType === "spouse"
        ? [rel.memberId, rel.relatedMemberId].sort().join("-")
        : `${rel.memberId}-${rel.relatedMemberId}`;

    if (seenPairs.has(pairKey)) continue;
    seenPairs.add(pairKey);

    if (rel.relationType === "parent") {
      edges.push({
        id: `e-${rel.id}`,
        source: rel.relatedMemberId,
        target: rel.memberId,
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "smoothstep",
        data: { relationType: "parent" },
      });
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
        });
      }
    }
  }

  return { nodes, edges };
}

export function getGenerationColor(generation: number): string {
  const colors = [
    "#8B5E3C",
    "#9B7353",
    "#AB886A",
    "#BB9D81",
    "#CBB398",
    "#DBC8AF",
  ];
  return colors[Math.min(generation - 1, colors.length - 1)];
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatYear(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).getFullYear().toString();
}

export function getYearSpan(member: TreeMember): string {
  if (member.birthDate && member.deathDate) {
    return `${formatYear(member.birthDate)}–${formatYear(member.deathDate)}`;
  }
  if (member.birthDate) {
    return `Lahir ${formatYear(member.birthDate)}`;
  }
  return "";
}

export function getGenerationLabel(generation: number): string {
  const labels: Record<number, string> = {
    1: "Leluhur",
    2: "Anak",
    3: "Cucu",
    4: "Cicit",
    5: "Buyut",
  };
  return labels[generation] || `Generasi ke-${generation}`;
}

export function generateSlug(fullName: string, birthYear?: number): string {
  const base = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return birthYear ? `${base}-${birthYear}` : base;
}

// ============================================================
// Server-side dagre layout — runs on server to avoid blocking
// the main thread on the client. Returns plain serializable objects.
// ============================================================

export interface LayoutedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { member: TreeMember };
}

export interface LayoutedEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  style?: Record<string, unknown>;
  animated?: boolean;
  pathOptions?: Record<string, unknown>;
  data?: { relationType: string };
}

export function layoutTreeServerSide(
  nodes: FamilyTreeNode[],
  edges: FamilyTreeEdge[],
  isMobile: boolean,
): { nodes: LayoutedNode[]; edges: LayoutedEdge[] } {
  const nodeW = isMobile ? NODE_WIDTH : NODE_WIDTH_DESKTOP;
  const nodeH = isMobile ? NODE_HEIGHT : NODE_HEIGHT_DESKTOP;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: "TB",
    nodesep: isMobile ? 12 : 16,
    ranksep: isMobile ? 60 : 80,
  });

  for (const node of nodes) {
    dagreGraph.setNode(node.id, { width: nodeW, height: nodeH });
  }

  for (const edge of edges) {
    if (edge.data?.relationType === "spouse") continue;
    dagreGraph.setEdge(edge.source, edge.target);
  }

  dagre.layout(dagreGraph);

  const layoutedNodes: LayoutedNode[] = nodes.map((node) => {
    const member = node.data?.member;
    const hasCustomPosition =
      member?.positionX != null && member?.positionY != null;

    if (hasCustomPosition) {
      return {
        ...node,
        position: {
          x: member.positionX!,
          y: member.positionY!,
        },
      };
    }

    const dagreNode = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: dagreNode.x - nodeW / 2,
        y: dagreNode.y - nodeH / 2,
      },
    };
  });

  const layoutedEdges: LayoutedEdge[] = edges.map((edge) => {
    const isSpouse = edge.data?.relationType === "spouse";
    return {
      ...edge,
      style: isSpouse
        ? {
            stroke: "var(--outline-variant)",
            strokeWidth: 1.5,
            strokeDasharray: "5 4",
          }
        : {
            stroke: "var(--gold-accent)",
            strokeWidth: 2,
          },
      animated: !isSpouse,
      pathOptions: isSpouse ? undefined : { borderRadius: 12 },
    };
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}
