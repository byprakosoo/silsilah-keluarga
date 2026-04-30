import { notFound } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Briefcase, Heart, Calendar } from "lucide-react"
import { getMemberBySlugWithRelations, getSearchItems } from "@/lib/actions/members"

interface ProfilePageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params
  const member = await getMemberBySlugWithRelations(slug)

  if (!member) {
    notFound()
  }

  const searchableMembers = await getSearchItems()

  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Link href={`/anggota/${member.slug}`}>
      <div className="flex items-center gap-2 p-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] hover:bg-[var(--surface-container)] transition-colors cursor-pointer">
        <Avatar className="h-8 w-8 border border-[var(--outline-variant)] rounded-full">
          <AvatarImage src={member.photoUrl || undefined} />
          <AvatarFallback
            className="bg-[var(--primary-container)] text-[var(--on-primary-container)] text-xs"
            style={{ fontFamily: "var(--font-noto-serif), serif" }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-[var(--on-surface)]" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
          {member.fullName}
        </span>
      </div>
    </Link>
  )
}
