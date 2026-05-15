import { notFound } from "next/navigation"
import { MemberForm } from "@/components/admin/member-form"
import { getMemberBySlug, getAllMembers, getTreeMembers } from "@/lib/actions/members"
import { getRelationships } from "@/lib/actions/relationships"

interface EditMemberPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = await params
  const [members, treeMembers, relationships] = await Promise.all([
    getAllMembers(),
    getTreeMembers(),
    getRelationships(),
  ])
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

      <MemberForm
        initialData={member}
        isEditing
        treeMembers={treeMembers}
        treeRelationships={relationships}
      />
    </div>
  )
}
