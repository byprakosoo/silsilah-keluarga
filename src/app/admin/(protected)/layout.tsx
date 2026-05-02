import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AdminLayoutClient } from "@/components/admin/admin-layout-client"
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

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
