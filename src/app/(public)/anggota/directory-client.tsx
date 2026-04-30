"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MemberCard } from "@/components/public/member-card"
import { Member } from "@/lib/types"
import { Search } from "lucide-react"

interface MemberDirectoryClientProps {
  initialMembers: Member[]
}

export function MemberDirectoryClient({ initialMembers }: MemberDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [generationFilter, setGenerationFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredMembers = useMemo(() => {
    return initialMembers.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.birthPlace || "").toLowerCase().includes(searchQuery.toLowerCase())

      const matchesGeneration =
        generationFilter === "all" || m.generation === parseInt(generationFilter)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "alive" && m.isAlive) ||
        (statusFilter === "deceased" && !m.isAlive)

      return matchesSearch && matchesGeneration && matchesStatus
    })
  }, [searchQuery, generationFilter, statusFilter, initialMembers])

  const generations = useMemo(() => {
    const gens = new Set(initialMembers.map((m) => m.generation))
    return Array.from(gens).sort((a, b) => a - b)
  }, [initialMembers])

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter)]" style={{ paddingTop: "var(--gutter)", paddingBottom: "var(--gutter)" }}>
      <div className="mb-10">
        <h1
          className="font-serif font-bold text-[var(--on-surface)] mb-1"
          style={{
            fontFamily: "var(--font-noto-serif), serif",
            fontSize: "3.5rem",
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
          }}
        >
          Direktori Anggota Keluarga
        </h1>
        <p className="body-lg text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
          Jelajahi seluruh anggota keluarga besar
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-8">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--on-surface-variant)]" />
          <Input
            placeholder="Cari nama atau tempat lahir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 !h-10 bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] focus-visible:ring-[var(--primary)] shadow-heritage"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="label-sm text-[var(--on-surface-variant)]">Generasi</Label>
          <Select value={generationFilter} onValueChange={(v) => setGenerationFilter(v ?? "all")}>
            <SelectTrigger className="!h-10 w-[160px] bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] shadow-heritage">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              {generations.map((gen) => (
                <SelectItem key={gen} value={gen.toString()}>
                  Generasi ke-{gen}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="label-sm text-[var(--on-surface-variant)]">Status</Label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="!h-10 w-[160px] bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] shadow-heritage">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="alive">Hidup</SelectItem>
              <SelectItem value="deceased">Almarhum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="label-sm text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
          Menampilkan {filteredMembers.length} dari {initialMembers.length} anggota
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {filteredMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-16">
          <p className="body-lg text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
            Tidak ada anggota yang ditemukan
          </p>
          <p className="text-sm text-[var(--on-surface-variant)] mt-1">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      )}
    </div>
  )
}
