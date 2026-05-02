import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

  const genLabel = getGenerationLabel(member.generation)
    .replace("Generasi ke-", "")
    .toUpperCase()
  const genPrefix = genLabel.length <= 5 ? `${genLabel} GEN` : genLabel

  return (
    <Link href={`/anggota/${member.slug}`}>
      <Card className="flex flex-col items-center p-6 hover:shadow-heritage-lg transition-all duration-300 ease-out hover:-translate-y-0.5 cursor-pointer group border-[var(--ledger-line)] bg-[var(--surface-container-lowest)] shadow-heritage">
        <div className="relative mb-4">
          <div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: "var(--ink)" }}
          />
          <Avatar className="h-[72px] w-[72px] border-3 border-transparent rounded-full">
            <AvatarImage src={member.photoUrl || undefined} />
            <AvatarFallback
              className="text-xl"
              style={{
                backgroundColor: member.isAlive
                  ? "var(--primary-container)"
                  : "var(--surface-container-high)",
                color: member.isAlive
                  ? "var(--on-primary-container)"
                  : "var(--on-surface-variant)",
                fontFamily: "var(--font-noto-serif), serif",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <h3
          className="font-serif font-bold text-lg text-center truncate max-w-full mb-2 group-hover:text-[var(--primary)] transition-colors"
          style={{
            fontFamily: "var(--font-noto-serif), serif",
            color: "var(--ink)",
          }}
        >
          {member.fullName}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="badge-ochre">{genPrefix}</span>
          <span
            className="text-xs"
            style={{
              fontFamily: "var(--font-source-sans), sans-serif",
              color: "var(--on-surface-variant)",
            }}
          >
            &bull; {getYearSpan(member)}
          </span>
        </div>

        <p
          className="text-sm text-center line-clamp-2 mb-4"
          style={{
            fontFamily: "var(--font-source-sans), sans-serif",
            color: "#555555",
          }}
        >
          {member.bio || "Belum ada biografi."}
        </p>

        <span className="btn-pill-outline mt-auto">
          Lihat Silsilah
        </span>
      </Card>
    </Link>
  )
}
