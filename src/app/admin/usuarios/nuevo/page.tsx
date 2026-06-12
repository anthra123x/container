import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { hash } from "bcryptjs"
import type { Prisma } from "@prisma/client"
import { createUserSchema, ROLES_CONFIG, getRoleLevel } from "@/lib/validations/user"

export const dynamic = "force-dynamic"

export default async function NewUserPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const currentRole = session.user.role as string
  const currentLevel = getRoleLevel(currentRole)

  if (currentLevel < 3) redirect("/admin")

  const availableRoles = Object.entries(ROLES_CONFIG)
    .filter(([role, config]) => currentLevel > config.level || currentRole === role)
    .map(([role, config]) => ({ value: role, label: config.label }))

  async function createUser(formData: FormData) {
    "use server"

    const currentSession = await auth()
    if (!currentSession?.user) redirect("/login")

    const currRole = currentSession.user.role as string
    const currLevel = getRoleLevel(currRole)
    const currStoreId = currentSession.user.storeId as string

    if (currLevel < 3) redirect("/admin")

    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
      isActive: formData.get("isActive") === "on",
    }

    const parsed = createUserSchema.safeParse(raw)
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const params = new URLSearchParams()
      if (errors.name) params.set("error_name", errors.name[0])
      if (errors.email) params.set("error_email", errors.email[0])
      if (errors.password) params.set("error_password", errors.password[0])
      if (errors.role) params.set("error_role", errors.role[0])
      params.set("name", raw.name)
      params.set("email", raw.email)
      params.set("role", raw.role)
      params.set("isActive", raw.isActive ? "on" : "")
      redirect(`/admin/usuarios/nuevo?${params.toString()}`)
    }

    if (currLevel <= getRoleLevel(parsed.data.role) && currRole !== parsed.data.role) {
      redirect("/admin/usuarios/nuevo?error_role=No puedes crear usuarios con este rol")
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      redirect(`/admin/usuarios/nuevo?error_email=Este email ya está registrado&name=${encodeURIComponent(parsed.data.name)}&role=${parsed.data.role}`)
    }

    const passwordHash = await hash(parsed.data.password, 12)

    await prisma.user.create({
      data: {
        storeId: currStoreId,
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role as Prisma.UserCreateInput["role"],
        isActive: parsed.data.isActive,
      },
    })

    redirect("/admin/usuarios?created=true")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/usuarios" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          &larr; Volver
        </Link>
        <h1 className="text-3xl font-bold">Nuevo Usuario</h1>
      </div>

      <div className="max-w-lg">
        <form action={createUser} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Ej: María García"
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
              defaultValue=""
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="ej: maria@container.pe"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Mínimo 6 caracteres"
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
              defaultValue="EDITOR"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {availableRoles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Usuario activo</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
            >
              Crear usuario
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
