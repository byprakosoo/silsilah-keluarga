import { MemberForm } from "@/components/admin/member-form"

export default function CreateMemberPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold text-[var(--on-surface)]">Tambah Anggota</h1>
        <p className="text-[var(--on-surface-variant)] mt-1">Isi data anggota keluarga baru</p>
      </div>

      <MemberForm />
    </div>
  )
}
