"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Save, X, ChevronsUpDown, ArrowLeft } from "lucide-react"
import { Member, MemberWithRelations } from "@/lib/types"
import { getAllMembers } from "@/lib/actions/members"
import { setRelations } from "@/lib/actions/relationships"
import Link from "next/link"

interface RelationsManagerProps {
  member: MemberWithRelations
}

export function RelationsManager({ member }: RelationsManagerProps) {
  const [allMembers, setAllMembers] = useState<Member[]>([])
  const [fatherId, setFatherId] = useState<string | null>(
    member.parents.find((p) => p.gender === "male")?.id || null
  )
  const [motherId, setMotherId] = useState<string | null>(
    member.parents.find((p) => p.gender === "female")?.id || null
  )
  const [spouseId, setSpouseId] = useState<string | null>(
    member.spouses[0]?.id || null
  )
  const [marriageDate, setMarriageDate] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllMembers().then(setAllMembers).catch(() => {})
  }, [])

  const selectable = allMembers.filter((m) => m.id !== member.id)

  const getMemberById = (id: string | null): Member | null => {
    if (!id) return null
    return allMembers.find((m) => m.id === id) ?? null
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await setRelations(member.id, fatherId, motherId, spouseId, marriageDate || null)
      window.location.reload()
    } catch {
      alert("Gagal menyimpan relasi")
      setLoading(false)
    }
  }

  const father = getMemberById(fatherId)
  const mother = getMemberById(motherId)
  const spouse = getMemberById(spouseId)

  return (
    <div className="space-y-6">
      <Card className="border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg" style={{ fontFamily: "var(--font-noto-serif), serif", fontSize: "1.75rem", color: "var(--on-surface)" }}>
            Orang Tua
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RelationPicker label="Ayah" memberId={fatherId} selected={father} members={selectable.filter((m) => m.gender === "male")} onSelect={setFatherId} onClear={() => setFatherId(null)} />
          <RelationPicker label="Ibu" memberId={motherId} selected={mother} members={selectable.filter((m) => m.gender === "female")} onSelect={setMotherId} onClear={() => setMotherId(null)} />
        </CardContent>
      </Card>

      <Card className="border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg" style={{ fontFamily: "var(--font-noto-serif), serif", fontSize: "1.75rem", color: "var(--on-surface)" }}>
            Pasangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RelationPicker label="Pasangan" memberId={spouseId} selected={spouse} members={selectable.filter((m) => m.gender !== member.gender)} onSelect={setSpouseId} onClear={() => setSpouseId(null)} />
          {spouseId && (
            <div className="mt-3 space-y-2">
              <Label className="label-sm" style={{ fontFamily: "var(--font-elms-sans), sans-serif", color: "var(--on-surface)" }}>Tanggal Pernikahan</Label>
              <Input type="date" value={marriageDate} onChange={(e) => setMarriageDate(e.target.value)} className="border-[var(--outline-variant)] bg-[var(--surface)]" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-lg" style={{ fontFamily: "var(--font-noto-serif), serif", fontSize: "1.75rem", color: "var(--on-surface)" }}>
            Hubungan Saat Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}>
            {member.parents.length > 0 && (
              <div>
                <span className="text-sm text-[var(--on-surface-variant)]">Orang Tua: </span>
                <span className="text-sm text-[var(--on-surface)]">{member.parents.map((p) => p.fullName).join(" & ")}</span>
              </div>
            )}
            {member.spouses.length > 0 && (
              <div>
                <span className="text-sm text-[var(--on-surface-variant)]">Pasangan: </span>
                <span className="text-sm text-[var(--on-surface)]">{member.spouses.map((s) => s.fullName).join(", ")}</span>
              </div>
            )}
            {member.children.length > 0 && (
              <div>
                <span className="text-sm text-[var(--on-surface-variant)]">Anak: </span>
                <span className="text-sm text-[var(--on-surface)]">{member.children.map((c) => c.fullName).join(", ")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="ghost" type="button" asChild>
          <Link href="/admin/anggota" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <Button onClick={handleSave} disabled={loading} className="gap-2" style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}>
          <Save className="h-4 w-4" />
          {loading ? "Menyimpan..." : "Simpan Relasi"}
        </Button>
      </div>
    </div>
  )
}

function RelationPicker({
  label, memberId, selected, members, onSelect, onClear,
}: {
  label: string
  memberId: string | null
  selected: Member | null
  members: { id: string; fullName: string; photoUrl: string | null; generation: number }[]
  onSelect: (id: string) => void
  onClear: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <Label className="label-sm" style={{ fontFamily: "var(--font-elms-sans), sans-serif", color: "var(--on-surface)" }}>{label}</Label>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={<Button variant="outline" role="combobox" aria-expanded={open} className="flex-1 justify-between bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] text-left font-normal shadow-heritage" />}
          >
            {selected ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 border border-[var(--outline-variant)] rounded-full">
                  <AvatarFallback className="bg-[var(--primary-container)] text-[var(--on-primary-container)] text-[10px]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
                    {selected.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}>{selected.fullName}</span>
              </div>
            ) : (
              <span className="text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}>Pilih {label.toLowerCase()}...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] p-0 shadow-heritage-lg">
            <Command>
              <CommandInput placeholder="Cari nama..." className="border-b border-[var(--outline-variant)]" />
              <CommandList>
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {members.map((m) => (
                    <CommandItem key={m.id} value={m.fullName} onSelect={() => { onSelect(m.id); setOpen(false) }}>
                      <Avatar className="h-6 w-6 border border-[var(--outline-variant)] rounded-full mr-2">
                        <AvatarFallback className="bg-[var(--primary-container)] text-[var(--on-primary-container)] text-[10px]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
                          {m.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}>{m.fullName}</span>
                      <Badge variant="outline" className="ml-auto border-[var(--outline-variant)] text-[10px]">Gen {m.generation}</Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {memberId && (
          <Button variant="ghost" size="icon" onClick={onClear} className="shrink-0 text-[var(--on-surface-variant)] hover:text-[var(--error)]">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
