"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface MemberSearchResult {
  id: string
  slug: string
  fullName: string
  generation: number
}

interface SearchBarProps {
  members: MemberSearchResult[]
  placeholder?: string
}

export function SearchBar({ members, placeholder = "Cari nama anggota..." }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<MemberSearchResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }
    const filtered = members.filter((m) =>
      m.fullName.toLowerCase().includes(value.toLowerCase())
    )
    setResults(filtered)
    setShowResults(true)
  }

  const handleSelect = (slug: string) => {
    router.push(`/anggota/${slug}`)
    setQuery("")
    setShowResults(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--on-surface-variant)]" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-9 bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] focus-visible:ring-[var(--primary)] shadow-heritage"
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery("")
              setResults([])
              setShowResults(false)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg shadow-heritage-lg z-50 max-h-64 overflow-auto">
          {results.map((member) => (
            <button
              key={member.id}
              className="w-full text-left px-4 py-3 hover:bg-[var(--surface-container-low)] transition-colors border-b border-[var(--outline-variant)] last:border-b-0"
              style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              onClick={() => handleSelect(member.slug)}
            >
              <span className="font-medium text-[var(--on-surface)]">{member.fullName}</span>
              <span className="text-xs text-[var(--on-surface-variant)] ml-2">
                Generasi {member.generation}
              </span>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg shadow-heritage-lg z-50 p-4 text-center text-sm text-[var(--on-surface-variant)]">
          Tidak ditemukan anggota dengan nama &quot;{query}&quot;
        </div>
      )}
    </div>
  )
}
