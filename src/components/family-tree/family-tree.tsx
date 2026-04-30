"use client"

import { useCallback } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeProps,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  EdgeProps,
  getStraightPath,
  BaseEdge,
  EdgeLabelRenderer,
} from "reactflow"
import "reactflow/dist/style.css"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Member } from "@/lib/types"
import { getYearSpan } from "@/lib/tree-utils"

function FamilyMemberNode({ data }: NodeProps<{ member: Member }>) {
  const { member } = data
  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  const isDeceased = !member.isAlive

  return (
    <div className="cursor-pointer transition-transform duration-300 ease-out hover:scale-105">
      <Handle type="target" position={Position.Top} id="top" className="!bg-transparent !border-0" />
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-[2rem] border shadow-heritage w-[220px] box-border"
        style={{
          backgroundColor: isDeceased ? "var(--surface-container)" : "var(--surface-container-lowest)",
          borderColor: isDeceased ? "var(--outline-variant)" : "var(--ledger-line)",
          opacity: isDeceased ? 0.85 : 1,
        }}
      >
        <div className="relative shrink-0">
          <div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: isDeceased ? "var(--outline-variant)" : "var(--gold-accent)" }}
          />
          <Avatar
            className="h-11 w-11 border-2 border-transparent rounded-full"
            style={{ filter: isDeceased ? "grayscale(0.5)" : undefined }}
          >
            <AvatarImage src={member.photoUrl || undefined} />
            <AvatarFallback
              className="text-sm"
              style={{
                backgroundColor: isDeceased ? "var(--surface-container-high)" : "var(--primary-container)",
                color: isDeceased ? "var(--on-surface-variant)" : "var(--on-primary-container)",
                fontFamily: "var(--font-noto-serif), serif",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="font-serif font-semibold text-[15px] leading-tight truncate"
            style={{
              fontFamily: "var(--font-noto-serif), serif",
              color: isDeceased ? "var(--on-surface-variant)" : "var(--on-surface)",
            }}
          >
            {member.fullName}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ fontFamily: "var(--font-source-sans), sans-serif", color: "var(--on-surface-variant)" }}>
            {member.gender === "male" ? "♂" : "♀"} {getYearSpan(member)}
          </p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-0" />
    </div>
  )
}

function SpouseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
}: EdgeProps) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate(-50%, -50%) translate(${midX}px,${midY}px)`,
          }}
        >
          <span className="text-[10px] leading-none" style={{ fontFamily: "var(--font-noto-serif), serif", color: "var(--gold-accent)" }}>
            ⚭
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

const nodeTypes = { familyMember: FamilyMemberNode }
const edgeTypes = { spouseEdge: SpouseEdge }

interface FamilyTreeProps {
  initialNodes: Node[]
  initialEdges: Edge[]
  onNodeClick: (slug: string) => void
}

export function FamilyTree({ initialNodes, initialEdges, onNodeClick }: FamilyTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const member = node.data?.member as Member | undefined
      if (member?.slug) {
        onNodeClick(member.slug)
      }
    },
    [onNodeClick]
  )

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-[var(--ledger-line)]" style={{ backgroundColor: "var(--parchment)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ backgroundColor: "var(--parchment)" }}
      >
        <Background color="var(--ledger-line)" gap={24} size={1} />
        <Controls
          className="!bg-[var(--surface-container-lowest)] !border-[var(--ledger-line)] !rounded-xl !shadow-heritage !overflow-hidden"
          style={{ borderRadius: "12px" }}
        />
        <MiniMap
          nodeColor={() => "var(--primary-container)"}
          maskColor="var(--surface-container-low)"
          className="!bg-[var(--parchment)] !border-[var(--ledger-line)] !rounded-xl !shadow-heritage"
          style={{ borderRadius: "12px" }}
        />
      </ReactFlow>
    </div>
  )
}
