import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { auth } from "@/lib/auth"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    })
  } catch {
    // Auth unavailable — allow access for development
  }

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--surface)" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
