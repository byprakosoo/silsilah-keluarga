import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, GitBranch } from "lucide-react"
import { getAllMembers } from "@/lib/actions/members"

export default async function DashboardPage() {
  const members = await getAllMembers()
  const totalMembers = members.length
  const aliveMembers = members.filter((m) => m.isAlive).length
  const maxGeneration = Math.max(1, ...members.map((m) => m.generation))

  return (
    <div>
      <h1 className="font-serif font-bold text-[var(--on-surface)] mb-2" style={{ fontFamily: "var(--font-noto-serif), serif", fontSize: "clamp(1.5rem, 5vw, 2.25rem)", lineHeight: "1.3" }}>
        Dashboard
      </h1>
      <p className="body-md text-[var(--on-surface-variant)] mb-8" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
        Ringkasan data silsilah keluarga
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>Total Anggota</CardTitle>
            <Users className="h-4 w-4" style={{ color: "var(--primary)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-[var(--on-surface)]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>{totalMembers}</div>
            <p className="text-xs text-[var(--on-surface-variant)] mt-1">anggota keluarga tercatat</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>Anggota Hidup</CardTitle>
            <UserPlus className="h-4 w-4" style={{ color: "var(--primary)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-[var(--on-surface)]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>{aliveMembers}</div>
            <p className="text-xs text-[var(--on-surface-variant)] mt-1">dari {totalMembers} anggota</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>Generasi</CardTitle>
            <GitBranch className="h-4 w-4" style={{ color: "var(--primary)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-[var(--on-surface)]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>{maxGeneration}</div>
            <p className="text-xs text-[var(--on-surface-variant)] mt-1">generasi tercatat</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
