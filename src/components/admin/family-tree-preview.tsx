"use client"

import { useState } from "react"
import { TreeMember, Relationship } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getYearSpan, getGenerationLabel } from "@/lib/tree-utils"
import { ChevronDown, ChevronUp, Users } from "lucide-react"

interface FamilyTreePreviewProps {
  members: TreeMember[]
  relationships: Relationship[]
  className?: string
}

export function FamilyTreePreview({
  members,
  relationships,
  className,
}: FamilyTreePreviewProps) {
  const [expanded, setExpanded] = useState(false)

  if (members.length === 0) {
    return (
      <Card
        className={`border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage ${className ?? ""}`}
      >
        <CardContent className="py-4">
          <p
            className="text-sm text-[var(--on-surface-variant)] text-center"
            style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
          >
            Belum ada anggota keluarga. Silakan tambahkan anggota pertama.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Build member lookup and spouse map
  const memberMap = new Map(members.map((m) => [m.id, m]))

  const spouseMap = new Map<string, TreeMember>()
  for (const rel of relationships) {
    if (rel.relationType === "spouse") {
      const spouse = memberMap.get(rel.relatedMemberId)
      if (spouse && !spouseMap.has(rel.memberId)) {
        spouseMap.set(rel.memberId, spouse)
      }
    }
  }

  // Group members by generation
  const generationGroups = new Map<number, TreeMember[]>()
  for (const m of members) {
    const gen = m.generation
    const existing = generationGroups.get(gen) ?? []
    generationGroups.set(gen, [...existing, m])
  }
  const generations = Array.from(generationGroups.entries()).sort(
    ([a], [b]) => a - b,
  )

  const cardClasses =
    "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage"

  return (
    <Card className={`${cardClasses} ${className ?? ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: "var(--gold-accent)" }} />
            <CardTitle
              className="font-serif text-lg"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                fontSize: "1.5rem",
                color: "var(--on-surface)",
              }}
            >
              Pratinjau Silsilah Keluarga
            </CardTitle>
            <Badge
              variant="outline"
              className="border-[var(--outline-variant)] text-[var(--on-surface-variant)] font-normal text-xs"
            >
              {members.length} anggota
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0 text-[var(--on-surface-variant)]"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        {!expanded && (
          <p
            className="text-xs text-[var(--on-surface-variant)] mt-1"
            style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
          >
            Klik untuk melihat silsilah — gunakan sebagai panduan memilih
            generasi
          </p>
        )}
      </CardHeader>
      {expanded && (
        <CardContent className="pb-4">
          <div className="overflow-x-auto -mx-1 px-1 pb-1">
            <div className="flex gap-3 min-w-min">
              {generations.map(([gen, genMembers]) => {
                const spouseConnected = new Set<string>()
                const spousePairs: [TreeMember, TreeMember][] = []
                const remaining = new Set(genMembers.map((m) => m.id))

                for (const m of genMembers) {
                  if (!remaining.has(m.id)) continue
                  const spouse = spouseMap.get(m.id)
                  if (spouse && remaining.has(spouse.id)) {
                    spousePairs.push([m, spouse])
                    remaining.delete(m.id)
                    remaining.delete(spouse.id)
                    spouseConnected.add(m.id)
                    spouseConnected.add(spouse.id)
                  }
                }

                const singles = genMembers.filter(
                  (m) => !spouseConnected.has(m.id),
                )

                return (
                  <div
                    key={gen}
                    className="flex-shrink-0 w-[200px]"
                    style={{ minWidth: 200 }}
                  >
                    <div
                      className="text-xs font-semibold px-2 py-1 rounded-md mb-2 inline-flex items-center gap-1.5"
                      style={{
                        backgroundColor: "var(--surface-container-high)",
                        color: "var(--on-surface)",
                        fontFamily: "var(--font-elms-sans), sans-serif",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ backgroundColor: "var(--gold-accent)" }}
                      />
                      Generasi {gen}
                      <span className="font-normal text-[var(--on-surface-variant)]">
                        ({getGenerationLabel(gen)})
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {/* Spouse pairs */}
                      {spousePairs.map(([m1, m2]) => {
                        const male = m1.gender === "male" ? m1 : m2
                        const female = m2.gender === "female" ? m2 : m1
                        return (
                          <div
                            key={`${m1.id}-${m2.id}`}
                            className="flex flex-col gap-0.5 p-1.5 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface)]"
                          >
                            <MemberMiniCard member={male} />
                            <div
                              className="flex items-center gap-1 pl-3"
                              style={{
                                fontFamily: "var(--font-elms-sans), sans-serif",
                              }}
                            >
                              <span
                                className="text-[10px] leading-none"
                                style={{ color: "var(--gold-accent)" }}
                              >
                                ⚭
                              </span>
                              <span className="text-[10px] text-[var(--on-surface-variant)]">
                                Pasangan
                              </span>
                            </div>
                            <MemberMiniCard member={female} />
                          </div>
                        )
                      })}

                      {/* Single members */}
                      {singles.map((m) => (
                        <MemberMiniCard key={m.id} member={m} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <p
            className="text-[10px] text-[var(--on-surface-variant)] mt-3 text-center"
            style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
          >
            Generasi 1 adalah yang tertua. Anggota baru harus memiliki nomor
            generasi yang sesuai.
          </p>
        </CardContent>
      )}
    </Card>
  )
}

function MemberMiniCard({ member }: { member: TreeMember }) {
  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  const isDeceased = !member.isAlive

  return (
    <div
      className="flex items-center gap-2 p-1.5 rounded-md border border-[var(--outline-variant)] bg-[var(--surface)]"
      style={{ opacity: isDeceased ? 0.75 : 1 }}
    >
      <div className="relative shrink-0">
        <div
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: isDeceased
              ? "var(--outline-variant)"
              : "var(--gold-accent)",
          }}
        />
        <Avatar
          className="h-7 w-7 border-2 border-transparent rounded-full"
          style={{ filter: isDeceased ? "grayscale(0.5)" : undefined }}
        >
          <AvatarImage src={member.photoUrl || undefined} />
          <AvatarFallback
            className="text-[9px]"
            style={{
              backgroundColor: isDeceased
                ? "var(--surface-container-high)"
                : "var(--primary-container)",
              color: isDeceased
                ? "var(--on-surface-variant)"
                : "var(--on-primary-container)",
              fontFamily: "var(--font-noto-serif), serif",
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[11px] font-medium leading-tight truncate"
          style={{
            fontFamily: "var(--font-noto-serif), serif",
            color: isDeceased
              ? "var(--on-surface-variant)"
              : "var(--on-surface)",
          }}
        >
          {member.fullName}
        </p>
        <p
          className="text-[9px] leading-tight text-[var(--on-surface-variant)]"
          style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
        >
          {member.gender === "male" ? "♂" : "♀"} {getYearSpan(member)}
        </p>
      </div>
    </div>
  )
}
