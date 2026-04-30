import { notFound } from "next/navigation"
import { RelationsManager } from "@/components/admin/relations-manager"
import { getMemberWithRelations } from "@/lib/actions/members"

interface RelationsPageProps {
  params: Promise<{ id: string }>
}

export default async function RelationsPage({ params }: RelationsPageProps) {
  const { id } = await params
  const member = await getMemberWithRelations(id)

  if (!member) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold text-[var(--on-surface)]">Atur Relasi</h1>
        <p className="text-[var(--on-surface-variant)] mt-1">
          Atur hubungan keluarga untuk: <span className="font-medium">{member.fullName}</span>
        </p>
      </div>

      <RelationsManager member={member} />
    </div>
  )
}
