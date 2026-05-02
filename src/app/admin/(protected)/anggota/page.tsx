import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2, Link2 } from "lucide-react"
import { getAllMembers } from "@/lib/actions/members"
import { getGenerationLabel } from "@/lib/tree-utils"
import { DeleteMemberButton } from "./delete-button"

export default async function MemberListPage() {
  const members = await getAllMembers()

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <div>
          <h1
            className="font-serif font-bold text-[var(--on-surface)]"
            style={{
              fontFamily: "var(--font-noto-serif), serif",
              fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
              lineHeight: "1.3",
            }}
          >
            Daftar Anggota
          </h1>
          <p className="body-md text-[var(--on-surface-variant)] mt-1" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
            Kelola data anggota keluarga
          </p>
        </div>
        <Button asChild className="gap-2 w-full sm:w-auto" style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}>
          <Link href="/admin/anggota/baru">
            <Plus className="h-4 w-4" />
            Tambah Anggota
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] overflow-hidden shadow-heritage">
        <Table>
          <TableHeader style={{ backgroundColor: "var(--surface-container-low)" }}>
            <TableRow>
              <TableHead className="text-[var(--on-surface-variant)] font-medium label-sm">Nama</TableHead>
              <TableHead className="text-[var(--on-surface-variant)] font-medium label-sm">Jenis Kelamin</TableHead>
              <TableHead className="text-[var(--on-surface-variant)] font-medium label-sm">Generasi</TableHead>
              <TableHead className="text-[var(--on-surface-variant)] font-medium label-sm">Status</TableHead>
              <TableHead className="text-[var(--on-surface-variant)] font-medium label-sm w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-[var(--surface-container-low)]">
                <TableCell className="font-medium text-[var(--on-surface)]">
                  <Link
                    href={`/admin/anggota/${member.id}/edit`}
                    className="hover:text-[var(--primary)] transition-colors"
                    style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
                  >
                    {member.fullName}
                  </Link>
                  {member.nickname && (
                    <span className="text-[var(--on-surface-variant)] text-sm ml-2">
                      ({member.nickname})
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
                  {member.gender === "male" ? "♂ Laki-laki" : "♀ Perempuan"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-[var(--outline-variant)] text-[var(--on-surface-variant)] font-normal">
                    {getGenerationLabel(member.generation)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {member.isAlive ? (
                    <Badge style={{ backgroundColor: "var(--primary-fixed)", color: "var(--on-primary-fixed-variant)" }}>
                      Hidup
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Almarhum</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 shadow-heritage-lg">
                      <DropdownMenuItem
                        render={<Link href={`/admin/anggota/${member.id}/edit`} className="cursor-pointer" />}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={<Link href={`/admin/anggota/${member.id}/relasi`} className="cursor-pointer" />}
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Relasi
                      </DropdownMenuItem>
                      <DeleteMemberButton id={member.id} name={member.fullName} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-[var(--on-surface-variant)] mt-4 text-right" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
        Total: {members.length} anggota
      </p>
    </div>
  )
}
