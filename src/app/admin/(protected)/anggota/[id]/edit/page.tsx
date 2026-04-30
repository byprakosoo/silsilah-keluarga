import { notFound } from "next/navigation"
import { MemberForm } from "@/components/admin/member-form"
import { getMemberBySlug, getAllMembers } from "@/lib/actions/members"

interface EditMemberPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = await params
  const members = await getAllMembers()
  const member = members.find((m) => m.id === id)

  if (!member) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold text-[var(--on-surface)]">Edit Anggota</h1>
        <p className="text-[var(--on-surface-variant)] mt-1">
          Mengubah data: <span className="font-medium">{member.fullName}</span>
        </p>
      </div>

      <MemberForm initialData={member} isEditing />
    </div>
  )
}
