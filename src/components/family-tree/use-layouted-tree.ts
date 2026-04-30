"use client"

import { useMemo } from "react"
import dagre from "@dagrejs/dagre"
import { Node, Edge } from "reactflow"
import { FamilyTreeNode, FamilyTreeEdge } from "@/lib/types"

const NODE_WIDTH = 220
const NODE_HEIGHT = 100

function getLayoutedElements(nodes: FamilyTreeNode[], edges: FamilyTreeEdge[]) {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 16, ranksep: 80 })

  for (const node of nodes) {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }

  for (const edge of edges) {
    if (edge.data?.relationType === "spouse") continue
    dagreGraph.setEdge(edge.source, edge.target)
  }

  dagre.layout(dagreGraph)

  const layoutedNodes: Node[] = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - NODE_HEIGHT / 2,
      },
    }
  })

  const layoutedEdges: Edge[] = edges.map((edge) => {
    const isSpouse = edge.data?.relationType === "spouse"
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
    }
  })

  return { nodes: layoutedNodes, edges: layoutedEdges }
}

interface UseLayoutedTreeProps {
  nodes: FamilyTreeNode[]
  edges: FamilyTreeEdge[]
}

export function useLayoutedTree({ nodes, edges }: UseLayoutedTreeProps) {
  return useMemo(() => getLayoutedElements(nodes, edges), [nodes, edges])
}
