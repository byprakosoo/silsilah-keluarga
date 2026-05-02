"use client"

import { useMemo, useState, useEffect } from "react"
import dagre from "@dagrejs/dagre"
import { Node, Edge } from "reactflow"
import { FamilyTreeNode, FamilyTreeEdge } from "@/lib/types"

const NODE_WIDTH = 170
const NODE_WIDTH_DESKTOP = 220
const NODE_HEIGHT = 85
const NODE_HEIGHT_DESKTOP = 100

function getLayoutedElements(nodes: FamilyTreeNode[], edges: FamilyTreeEdge[], isMobile: boolean) {
  const nodeW = isMobile ? NODE_WIDTH : NODE_WIDTH_DESKTOP
  const nodeH = isMobile ? NODE_HEIGHT : NODE_HEIGHT_DESKTOP

  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: "TB", nodesep: isMobile ? 12 : 16, ranksep: isMobile ? 60 : 80 })

  for (const node of nodes) {
    dagreGraph.setNode(node.id, { width: nodeW, height: nodeH })
  }

  for (const edge of edges) {
    if (edge.data?.relationType === "spouse") continue
    dagreGraph.setEdge(edge.source, edge.target)
  }

  dagre.layout(dagreGraph)

  const layoutedNodes: Node[] = nodes.map((node) => {
    const member = node.data?.member
    const hasCustomPosition = member?.positionX != null && member?.positionY != null

    if (hasCustomPosition) {
      return {
        ...node,
        position: {
          x: member.positionX!,
          y: member.positionY!,
        },
      }
    }

    const dagreNode = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: dagreNode.x - nodeW / 2,
        y: dagreNode.y - nodeH / 2,
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return useMemo(() => getLayoutedElements(nodes, edges, isMobile), [nodes, edges, isMobile])
}
