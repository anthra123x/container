import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { requireAdminRole } from "@/lib/auth-helpers"
import { hash } from "bcryptjs"
import { updateUserSchema, ROLES_CONFIG, getRoleLevel } from "@/lib/validations/user"

export const dynamic = "force-dynamic"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const currentRole = session.user.role as string
  const currentLevel = getRoleLevel(currentRole)

  if (currentLevel < 3) redirect("/admin")

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) notFound()

  const isSelf = user.id === session.user.id
  const targetLevel = getRoleLevel(user.role)

  if (!isSelf && currentLevel <= targetLevel) {
    redirect("/admin/usuarios")
  }

  if (user.email === "admin@container.com" && !isSelf) {
    redirect("/admin/usuarios")
  }

  const availableRoles = Object.entries(ROLES_CONFIG)
    .filter(([role, config]) => {
      if (currentRole === "SUPER_ADMIN") return true
      if (role === "SUPER_ADMIN") return false
      if (isSelf) return role === user.role
      return currentLevel > config.level
    })
    .map(([role, config]) => ({ value: role, label: config.label }))

  const defaultRole = targetLevel >= currentLevel ? user.role : user.role

  async function updateUserAction(formData: FormData) {
    "use server"

    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: (formData.get("password") as string) || undefined,
      role: formData.get("role") as string,
      isActive: formData.get("isActive") === "on",
    }

    const parsed = updateUserSchema.safeParse(raw)
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const params = new URLSearchParams()
      if (errors.name) params.set("error_name", errors.name[0])
      if (errors.email) params.set("error_email", errors.email[0])
      if (errors.role) params.set("error_role", errors.role[0])
      redirect(`/admin/usuarios/${userId}?${params.toString()}`)
    }

    const currentUser = await requireAdminRole(3)

    const currRole = currentUser.user.role as string
    const currLevel = getRoleLevel(currRole)
    const target = await prisma.user.findUnique({ where: { id: userId } })
    if (!target) return

    const isEditingSelf = target.id === currentUser.user.id
    if (!isEditingSelf && currLevel <= getRoleLevel(target.role)) {
      redirect("/admin/usuarios")
    }

    if (target.email === "admin@container.com" && !isEditingSelf) {
      redirect("/admin/usuarios")
    }

    if (currLevel <= getRoleLevel(parsed.data.role) && currRole !== parsed.data.role) {
      redirect(`/admin/usuarios/${userId}?error_role=No puedes asignar este rol`)
    }

    const emailExists = await prisma.user.findFirst({
      where: { email: parsed.data.email, id: { not: userId } },
    })
    if (emailExists) {
      redirect(`/admin/usuarios/${userId}?error_email=Este email ya está en uso por otro usuario`)
    }

            const updateData: Prisma.UserUpdateInput = {
              name: parsed.data.name,
              email: parsed.data.email,
              role: parsed.data.role as Prisma.UserUpdateInput["role"],
              isActive: parsed.data.isActive,
            }

            if (parsed.data.password) {
              updateData.passwordHash = await hash(parsed.data.password, 12)
            }

            await prisma.user.update({
              where: { id: userId },
              data: updateData,
            })

    if (isEditingSelf && parsed.data.role !== target.role) {
      redirect("/api/auth/signout")
    }

    redirect("/admin/usuarios?updated=true")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/usuarios" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          &larr; Volver
        </Link>
        <h1 className="text-3xl font-bold">Editar Usuario</h1>
      </div>

      <div className="max-w-lg">
        <form action={updateUserAction} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={user.name}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={user.email}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nueva contraseña <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Dejar vacío para mantener la actual"
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              id="role"
              name="role"
              required
              defaultValue={defaultRole}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {availableRoles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {!isSelf && (
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={user.isActive}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Usuario activo</span>
            </label>
          )}

          {isSelf && (
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Estás editando tu propia cuenta. Si cambias tu rol, se cerrará tu sesión.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
            >
              Guardar cambios
            </button>
            <Link
              href="/admin/usuarios"
              className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
