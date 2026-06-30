import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getRoleLevel } from "@/lib/validations/user"

export async function requireAdminRole(minLevel: number) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const role = session.user.role as string
  if (getRoleLevel(role) < minLevel) {
    redirect("/admin")
  }

  return session
}
