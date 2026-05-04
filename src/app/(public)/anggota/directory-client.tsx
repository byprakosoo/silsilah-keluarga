"use client"

import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MemberCard } from "@/components/public/member-card"
import { Pagination } from "@/components/public/pagination"
import { Member } from "@/lib/types"
import { List, Search } from "lucide-react"

const ITEMS_PER_PAGE = 9

interface MemberDirectoryClientProps {
  initialMembers: Member[]
}

export function MemberDirectoryClient({ initialMembers }: MemberDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [generationFilter, setGenerationFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return initialMembers.filter((m) => {
      const matchesGeneration =
        generationFilter === "all" || m.generation === parseInt(generationFilter)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "alive" && m.isAlive) ||
        (statusFilter === "deceased" && !m.isAlive)

      const matchesSearch =
        !query ||
        m.fullName.toLowerCase().includes(query) ||
        (m.nickname ?? "").toLowerCase().includes(query) ||
        (m.bio ?? "").toLowerCase().includes(query)

      return matchesGeneration && matchesStatus && matchesSearch
    })
  }, [searchQuery, generationFilter, statusFilter, initialMembers])

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredMembers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredMembers, currentPage])

  const generations = useMemo(() => {
    const gens = new Set(initialMembers.map((m) => m.generation))
    return Array.from(gens).sort((a, b) => a - b)
  }, [initialMembers])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className="max-w-[var(--container-max)] mx-auto px-4 sm:px-[var(--gutter)]"
      style={{ paddingTop: "var(--gutter)", paddingBottom: "var(--gutter)" }}
    >
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="font-serif font-bold mb-3"
          style={{
            fontFamily: "var(--font-noto-serif), serif",
            color: "var(--ink)",
            fontSize: "clamp(1.75rem, 5vw, 3rem)",
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
          }}
        >
          Direktori Anggota
        </h1>
        <div
          className="space-y-1 body-lg"
          style={{ fontFamily: "var(--font-elms-sans), sans-serif", color: "#555555" }}
        >
          <p>
            Jelajahi keturunan dan leluhur yang terdokumentasi dalam Silsilah Keluarga.
          </p>
          <p>
            Gunakan filter di bawah untuk menyaring arsip berdasarkan generasi atau status.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar mb-8">
        <Search className="h-4 w-4 text-[var(--on-surface-variant)] shrink-0" />
        <Input
          placeholder="Cari nama atau keterangan..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
          className="!h-9 !w-full !max-w-[260px] !rounded-full !border-0 !bg-white/60 !text-sm"
          style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
        />

        <span className="w-px h-6 bg-[var(--border-light)] shrink-0" />

        <List className="h-4 w-4 text-[var(--on-surface-variant)] shrink-0" />
        <span
          className="text-xs font-bold tracking-wider mr-2 shrink-0"
          style={{
            fontFamily: "var(--font-elms-sans), sans-serif",
            color: "var(--on-surface)",
          }}
        >
          FILTER:
        </span>

        <label
          className="flex items-center gap-2 text-xs font-medium shrink-0"
          style={{
            fontFamily: "var(--font-elms-sans), sans-serif",
            color: "var(--on-surface)",
          }}
        >
          Generasi
          <Select value={generationFilter} onValueChange={(v) => { setGenerationFilter(v ?? "all"); setCurrentPage(1) }}>
            <SelectTrigger
              className="!h-9 !w-[145px] rounded-full border-0 bg-white/60 text-sm"
              style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
            >
              <SelectValue placeholder="Semua Generasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Generasi</SelectItem>
              {generations.map((gen) => (
                <SelectItem key={gen} value={gen.toString()}>
                  Generasi ke-{gen}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label
          className="flex items-center gap-2 text-xs font-medium shrink-0"
          style={{
            fontFamily: "var(--font-elms-sans), sans-serif",
            color: "var(--on-surface)",
          }}
        >
          Status
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v ?? "all"); setCurrentPage(1) }}>
            <SelectTrigger
              className="!h-9 !w-[130px] rounded-full border-0 bg-white/60 text-sm"
              style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
            >
              <SelectValue placeholder="Status: Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: Semua</SelectItem>
              <SelectItem value="alive">Hidup</SelectItem>
              <SelectItem value="deceased">Almarhum</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <span
          className="ml-auto min-w-[170px] text-right text-sm shrink-0"
          style={{
            fontFamily: "var(--font-elms-sans), sans-serif",
            color: "var(--on-surface-variant)",
          }}
        >
          Menampilkan {filteredMembers.length} catatan
        </span>
      </div>

      {/* Divider */}
      <div className="gold-line mb-8" />

      {/* Member Grid */}
      <div className="w-full max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-16">
          <p
            className="body-lg mb-1"
            style={{
              fontFamily: "var(--font-elms-sans), sans-serif",
              color: "var(--on-surface-variant)",
            }}
          >
            Tidak ada anggota yang ditemukan
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
