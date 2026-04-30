"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Users, GitBranch, LogIn } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function PublicHeader() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Pohon", icon: GitBranch },
    { href: "/anggota", label: "Anggota", icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ledger-line)] bg-[var(--surface)]/90 backdrop-blur-sm">
      <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between h-16 px-[var(--gutter)]">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="text-2xl font-serif font-bold tracking-tight text-[var(--on-surface)]"
            style={{ fontFamily: "var(--font-noto-serif), serif" }}
          >
            Silsilah Keluarga
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Button
                key={link.href}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
                asChild
              >
                <Link href={link.href}>
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            )
          })}

          <div className="w-px h-5 mx-1 bg-[var(--ledger-line)]" />

          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-[var(--on-surface-variant)]"
            asChild
          >
            <Link href="/admin/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
