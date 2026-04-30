"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GitBranch } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await signIn.email({
      email,
      password,
    })

    if (result.error) {
      setError(result.error.message || "Login gagal")
      setLoading(false)
    } else {
      router.push("/admin/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: "var(--surface)" }}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <GitBranch className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
          <h1 className="font-serif font-bold" style={{ fontFamily: "var(--font-noto-serif), serif", fontSize: "2.25rem", lineHeight: "1.3", color: "var(--on-surface)" }}>
            Admin Login
          </h1>
          <p className="body-md text-[var(--on-surface-variant)] mt-1" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
            Masuk untuk mengelola silsilah keluarga
          </p>
        </div>

        <Card className="border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-heritage-lg">
          <CardContent className="pt-6">
            {error && (
              <div className="p-3 rounded-lg text-sm mb-4" style={{ backgroundColor: "var(--error-container)", color: "var(--on-error-container)" }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ fontFamily: "var(--font-source-sans), sans-serif", color: "var(--on-surface)" }}>Email</Label>
                <Input id="email" type="email" placeholder="admin@keluarga.id" value={email} onChange={(e) => setEmail(e.target.value)} className="border-[var(--outline-variant)] bg-[var(--surface)] focus-visible:ring-[var(--primary)] shadow-heritage" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" style={{ fontFamily: "var(--font-source-sans), sans-serif", color: "var(--on-surface)" }}>Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="border-[var(--outline-variant)] bg-[var(--surface)] focus-visible:ring-[var(--primary)] shadow-heritage" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full" style={{ backgroundColor: "var(--primary)", color: "var(--on-primary)" }}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] underline" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
