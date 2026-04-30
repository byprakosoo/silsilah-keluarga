"use client"

import { Trash2 } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { deleteMember } from "@/lib/actions/members"

export function DeleteMemberButton({ id, name }: { id: string; name: string }) {
  return (
    <DropdownMenuItem
      style={{ color: "var(--error)" }}
      onClick={async () => {
        if (confirm(`Hapus "${name}"? Data akan di-soft delete.`)) {
          await deleteMember(id)
          window.location.reload()
        }
      }}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Hapus
    </DropdownMenuItem>
  )
}
