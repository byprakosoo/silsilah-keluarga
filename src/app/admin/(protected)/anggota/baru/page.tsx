import { MemberForm } from "@/components/admin/member-form"
import { getTreeMembers, getAllMembers } from "@/lib/actions/members"
import { getRelationships } from "@/lib/actions/relationships"

export default async function CreateMemberPage() {
  const [treeMembers, relationships, allMembers] = await Promise.all([
    getTreeMembers(),
    getRelationships(),
    getAllMembers(),
  ])

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold text-[var(--on-surface)]">
          Tambah Anggota
        </h1>
        <p className="text-[var(--on-surface-variant)] mt-1">
          Isi data anggota keluarga baru — lihat silsilah di bawah sebagai
          panduan memilih generasi
        </p>
      </div>

      <MemberForm
        treeMembers={treeMembers}
        treeRelationships={relationships}
        allMembers={allMembers}
      />
    </div>
  )
}
