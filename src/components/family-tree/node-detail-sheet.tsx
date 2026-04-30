"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { ArrowRight, MapPin, Briefcase, Heart, Calendar, Users } from "lucide-react"
import { MemberWithRelations } from "@/lib/types"
import { formatDate, getYearSpan, getGenerationLabel } from "@/lib/tree-utils"

interface NodeDetailSheetProps {
  member: MemberWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  spouseMarriageDates?: Record<string, string | null>
}

export function NodeDetailSheet({ member, open, onOpenChange, spouseMarriageDates }: NodeDetailSheetProps) {
  if (!member) return null

  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md border-l border-[var(--ledger-line)] bg-[var(--surface)]"
      >
        <SheetHeader className="text-center pb-2">
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--gold-accent)]" />
              <Avatar className="h-24 w-24 border-2 border-transparent rounded-full">
                <AvatarImage src={member.photoUrl || undefined} />
                <AvatarFallback
                  className="bg-[var(--primary-container)] text-[var(--on-primary-container)] text-3xl"
                  style={{ fontFamily: "var(--font-noto-serif), serif" }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <SheetTitle
              className="font-serif font-bold text-xl text-[var(--on-surface)]"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                fontSize: "1.75rem",
                lineHeight: "1.3",
              }}
            >
              {member.fullName}
            </SheetTitle>

            {member.nickname && (
              <p
                className="text-sm text-[var(--on-surface-variant)] mt-0.5"
                style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              >
                &ldquo;{member.nickname}&rdquo;
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <Badge
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--on-primary)",
                }}
              >
                {member.gender === "male" ? "♂ Laki-laki" : "♀ Perempuan"}
              </Badge>
              {!member.isAlive && (
                <Badge variant="secondary">Almarhum</Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-auto px-4 space-y-5">
          {/* Dates + Place */}
          <div className="space-y-2" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
            <InfoRow icon={Calendar} label="Lahir" value={member.birthDate ? formatDate(member.birthDate) : "-"} />
            {member.birthPlace && <InfoRow icon={MapPin} label="Tempat Lahir" value={member.birthPlace} />}
            {member.deathDate && <InfoRow icon={Calendar} label="Wafat" value={formatDate(member.deathDate)} />}
            {member.deathPlace && <InfoRow icon={MapPin} label="Tempat Wafat" value={member.deathPlace} />}
            {member.religion && <InfoRow icon={Heart} label="Agama" value={member.religion} />}
            {member.occupation && <InfoRow icon={Briefcase} label="Pekerjaan" value={member.occupation} />}
            {member.address && <InfoRow icon={MapPin} label="Alamat" value={member.address} />}
          </div>

          <div className="gold-line" />

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-[var(--outline-variant)] text-[var(--on-surface-variant)]">
              {getGenerationLabel(member.generation)} — Generasi ke-{member.generation}
            </Badge>
            {member.birthOrder && member.totalSiblings && (
              <Badge variant="outline" className="border-[var(--outline-variant)] text-[var(--on-surface-variant)]">
                Anak ke-{member.birthOrder} dari {member.totalSiblings} bersaudara
              </Badge>
            )}
          </div>

          {/* Biography */}
          {member.bio && (
            <>
              <Separator className="gold-line" />
              <div>
                <p
                  className="label-sm text-[var(--on-surface-variant)] mb-1"
                  style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
                >
                  Biografi
                </p>
                <p
                  className="body-md text-[var(--on-surface-variant)] leading-relaxed text-sm"
                  style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
                >
                  {member.bio.slice(0, 200)}
                  {member.bio.length > 200 ? "..." : ""}
                </p>
              </div>
            </>
          )}

          {/* Parents */}
          {member.parents.length > 0 && (
            <div>
              <p
                className="label-sm text-[var(--on-surface-variant)] mb-2"
                style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              >
                Orang Tua
              </p>
              <div className="flex flex-wrap gap-2">
                {member.parents.map((p) => (
                  <MiniRelation key={p.id} member={p} />
                ))}
              </div>
            </div>
          )}

          {/* Spouses */}
          {member.spouses.length > 0 && (
            <div>
              <p
                className="label-sm text-[var(--on-surface-variant)] mb-2"
                style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              >
                Pasangan
              </p>
              <div className="flex flex-col gap-2">
                {member.spouses.map((s) => (
                  <div key={s.id} className="space-y-1">
                    <MiniRelation member={s} />
                    {spouseMarriageDates?.[s.id] && (
                      <p className="text-xs text-[var(--on-surface-variant)] ml-1" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
                        Menikah: {formatDate(spouseMarriageDates[s.id]!)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Children */}
          {member.children.length > 0 && (
            <div>
              <p
                className="label-sm text-[var(--on-surface-variant)] mb-2"
                style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
              >
                Anak
              </p>
              <div className="flex flex-wrap gap-2">
                {[...member.children]
                  .sort((a, b) => {
                    if (!a.birthDate) return 1
                    if (!b.birthDate) return -1
                    return new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime()
                  })
                  .map((c) => (
                    <MiniRelation key={c.id} member={c} />
                  ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-[var(--outline-variant)] pt-3">
          <Button
            asChild
            className="w-full gap-2"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--on-primary)",
            }}
          >
            <Link href={`/anggota/${member.slug}`}>
              <Users className="h-4 w-4" />
              Lihat Profil Lengkap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-3.5 w-3.5 text-[var(--on-surface-variant)] shrink-0" />
      <span className="text-[var(--on-surface-variant)] w-20 shrink-0">{label}</span>
      <span className="text-[var(--on-surface)] font-medium truncate">{value}</span>
    </div>
  )
}

function MiniRelation({ member }: { member: { slug: string; fullName: string; photoUrl: string | null } }) {
  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Link
      href={`/anggota/${member.slug}`}
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] hover:bg-[var(--surface-container)] transition-colors text-xs"
      style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
    >
      <Avatar className="h-5 w-5 rounded-full">
        <AvatarImage src={member.photoUrl || undefined} />
        <AvatarFallback
          className="bg-[var(--primary-container)] text-[var(--on-primary-container)] text-[10px]"
          style={{ fontFamily: "var(--font-noto-serif), serif" }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-[var(--on-surface)]">{member.fullName}</span>
    </Link>
  )
}
