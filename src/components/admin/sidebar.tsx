"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  UserPlus,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  GitBranch,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminSidebarProps {
  onNavigate?: () => void
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps = {}) {
  const pathname = usePathname()

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Daftar Anggota", href: "/admin/anggota", icon: Users },
    { label: "Tambah Anggota", href: "/admin/anggota/baru", icon: UserPlus },
  ]

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="flex flex-col w-64 h-full min-h-screen"
      style={{
        backgroundColor: "var(--surface-tint)",
        color: "var(--inverse-on-surface)",
      }}
    >
      <div className="p-5">
        <Link href="/" className="flex items-center gap-2">
          <GitBranch className="h-6 w-6" style={{ color: "var(--secondary-container)" }} />
          <span
            className="font-serif font-bold text-lg"
            style={{
              fontFamily: "var(--font-noto-serif), serif",
              color: "var(--inverse-on-surface)",
            }}
          >
            Admin Panel
          </span>
        </Link>
      </div>

      <Separator style={{ backgroundColor: "var(--outline)", opacity: 0.4 }} />

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-[var(--inverse-on-surface)] hover:text-[var(--inverse-on-surface)] hover:bg-[var(--primary-container)]/30",
                active && "bg-[var(--primary-container)]/40 text-[var(--on-primary-container)] hover:bg-[var(--primary-container)]/50"
              )}
              asChild
            >
              <Link href={item.href} onClick={onNavigate}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </nav>

      <Separator style={{ backgroundColor: "var(--outline)", opacity: 0.4 }} />

      <div className="p-3 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-[var(--inverse-on-surface)] hover:text-[var(--inverse-on-surface)] hover:bg-[var(--primary-container)]/30"
          asChild
        >
          <Link href="/" onClick={onNavigate}>
            <ChevronLeft className="h-4 w-4" />
            Kembali ke Situs
          </Link>
        </Button>
        <div className="flex justify-center py-1">
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-[var(--inverse-on-surface)] hover:text-red-300 hover:bg-[var(--primary-container)]/30"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
