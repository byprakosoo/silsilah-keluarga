import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Member } from "@/lib/types"
import { getYearSpan, getGenerationLabel } from "@/lib/tree-utils"

interface MemberCardProps {
  member: Member
}

export function MemberCard({ member }: MemberCardProps) {
  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Link href={`/anggota/${member.slug}`}>
      <Card className="p-4 hover:shadow-heritage-lg transition-all duration-300 ease-out hover:-translate-y-0.5 cursor-pointer group border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--gold-accent)]" />
            <Avatar className="h-14 w-14 border-2 border-transparent rounded-full">
              <AvatarImage src={member.photoUrl || undefined} />
              <AvatarFallback
                className="bg-[var(--primary-container)] text-[var(--on-primary-container)] text-lg"
                style={{ fontFamily: "var(--font-noto-serif), serif" }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="font-serif font-bold text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors truncate"
              style={{ fontFamily: "var(--font-noto-serif), serif" }}
            >
              {member.fullName}
            </h3>
            {member.nickname && (
              <p className="text-sm text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
                &ldquo;{member.nickname}&rdquo;
              </p>
            )}
            <p className="text-xs text-[var(--on-surface-variant)] mt-0.5" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
              {member.gender === "male" ? "♂" : "♀"} {getYearSpan(member)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <Badge variant="outline" className="border-[var(--outline-variant)] text-[var(--on-surface-variant)] font-normal">
              {getGenerationLabel(member.generation)}
            </Badge>
            {!member.isAlive && (
              <Badge variant="secondary" className="block mt-1 font-normal">
                Almarhum
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
