"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { LogIn, Menu, Search, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function PublicHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const links = [
    { href: "/", label: "Pohon" },
    { href: "/anggota", label: "Direktori" },
  ]

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/anggota?q=${encodeURIComponent(searchQuery.trim())}`)
        setSearchQuery("")
      }
    },
    [searchQuery, router]
  )

  const renderNavLinks = (onClick?: () => void) =>
    links.map((link) => {
      const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className="relative px-3 py-2 font-serif text-sm transition-colors"
          style={{
            fontFamily: "var(--font-noto-serif), serif",
            color: isActive ? "var(--on-surface)" : "var(--on-surface-variant)",
          }}
        >
          {link.label}
          {isActive && (
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
              style={{
                width: "calc(100% - 1.5rem)",
                backgroundColor: "var(--gold-accent)",
              }}
            />
          )}
        </Link>
      )
    })

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ledger-line)] bg-[var(--surface)]/95 backdrop-blur-md">
      <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between h-16 px-[var(--gutter)]">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[var(--ink)]"
            style={{ fontFamily: "var(--font-noto-serif), serif" }}
          >
            Silsilah Keluarga
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center">
          {renderNavLinks()}
        </nav>

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--on-surface-variant)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari arsip..."
              className="w-48 h-9 pl-9 pr-4 rounded-full text-sm outline-none transition-all focus:w-64"
              style={{
                fontFamily: "var(--font-elms-sans), sans-serif",
                backgroundColor: "var(--surface-container-low)",
                color: "var(--on-surface)",
              }}
            />
          </form>

          <ThemeToggle />

          <div className="h-8 w-8 rounded-full flex items-center justify-center border border-[var(--outline-variant)] bg-white">
            <User className="h-4 w-4 text-[var(--on-surface-variant)]" />
          </div>

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
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="w-72 border-l border-[var(--ledger-line)] bg-[var(--surface)]"
        >
          <SheetHeader>
            <SheetTitle
              className="font-serif font-bold text-xl text-[var(--on-surface)]"
              style={{ fontFamily: "var(--font-noto-serif), serif" }}
            >
              Menu
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 mt-2">
            {renderNavLinks(() => setMobileOpen(false))}
          </div>
          <div className="mt-auto border-t border-[var(--outline-variant)] pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-[var(--on-surface-variant)]"
              asChild
            >
              <Link href="/admin/login" onClick={() => setMobileOpen(false)}>
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
