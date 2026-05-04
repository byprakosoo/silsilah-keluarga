"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AdminSidebar } from "@/components/admin/sidebar"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--surface)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-64 border-r border-[var(--outline)]"
          style={{ backgroundColor: "var(--surface-tint)" }}
        >
          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 p-3 md:hidden border-b border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
          <Button variant="ghost" size="icon" className="text-[var(--on-surface)]" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span
            className="font-serif font-bold text-sm text-[var(--on-surface)]"
            style={{ fontFamily: "var(--font-noto-serif), serif" }}
          >
            Admin Panel
          </span>
        </div>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
