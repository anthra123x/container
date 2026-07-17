import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { requireAdminRole } from "@/lib/auth-helpers"
import { ROLES_CONFIG, getRoleLevel } from "@/lib/validations/user"
import { Shield, ShieldCheck, ShieldHalf, Eye, Plus } from "lucide-react"

export const dynamic = "force-dynamic"

const roleIcons = {
  SUPER_ADMIN: ShieldCheck,
  ADMIN: Shield,
  EDITOR: ShieldHalf,
  VIEWER: Eye,
} as const

const roleColors = {
  SUPER_ADMIN: "text-amber-600 bg-amber-50 ring-amber-200",
  ADMIN: "text-blue-600 bg-blue-50 ring-blue-200",
  EDITOR: "text-purple-600 bg-purple-50 ring-purple-200",
  VIEWER: "text-gray-600 bg-gray-50 ring-gray-200",
} as const

export default async function AdminUsersPage() {
  const session = await auth()

  if (!session?.user) redirect("/login")

  const currentLevel = getRoleLevel(session.user.role as string)

  if (currentLevel < 3) {
    redirect("/admin")
  }

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
  })

  async function toggleActive(formData: FormData) {
    "use server"
    const userId = formData.get("userId") as string
    const currentSession = await requireAdminRole(3)
    const currentRole = currentSession.user.role as string

    const target = await prisma.user.findUnique({ where: { id: userId } })
    if (!target || getRoleLevel(currentRole) <= getRoleLevel(target.role)) return

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !target.isActive },
    })

    redirect("/admin/usuarios")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona las cuentas del personal
          </p>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Usuario
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Rol
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Último acceso
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const RoleIcon = roleIcons[user.role as keyof typeof roleIcons]
              const isSelf = user.id === session.user.id
              const canEdit = currentLevel > getRoleLevel(user.role) || session.user.id === user.id
              const canToggle = currentLevel > getRoleLevel(user.role) && !isSelf

              return (
                <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold text-white shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                          {isSelf && (
                            <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                              TÚ
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${roleColors[user.role as keyof typeof roleColors]}`}>
                      <RoleIcon className="h-3.5 w-3.5" />
                      {ROLES_CONFIG[user.role as keyof typeof ROLES_CONFIG]?.label ?? user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {user.lastLoginAt
                      ? user.lastLoginAt.toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Nunca"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <Link
                          href={`/admin/usuarios/${user.id}`}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        >
                          Editar
                        </Link>
                      )}
                      {canToggle && (
                        <form action={toggleActive}>
                          <input type="hidden" name="userId" value={user.id} />
                          <button
                            type="submit"
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                              user.isActive
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {user.isActive ? "Desactivar" : "Activar"}
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-500">No hay usuarios registrados</p>
        </div>
      )}
    </div>
  )
}
