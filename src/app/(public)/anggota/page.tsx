import { MemberDirectoryClient } from "./directory-client"
import { getAllMembers } from "@/lib/actions/members"
import { Member } from "@/lib/types"

export default async function DirectoryPage() {
  let members: Member[] = []
  try {
    members = await getAllMembers()
  } catch {
    // Fallback handled by client
  }

  return <MemberDirectoryClient initialMembers={members} />
}
