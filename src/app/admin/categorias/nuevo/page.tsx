import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { requireAdminRole } from "@/lib/auth-helpers"

export const dynamic = "force-dynamic"

export default async function NewCategoryPage() {
  async function createCategory(formData: FormData) {
    "use server"
    await requireAdminRole(2)

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0
    const isActive = formData.get("isActive") === "on"
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

    await prisma.category.create({
      data: { name, slug, description: description || null, sortOrder, isActive },
    })

    redirect("/admin/categorias")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categorias" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Volver
        </Link>
        <h1 className="text-3xl font-bold">Nueva Categoría</h1>
      </div>

      <div className="max-w-lg">
        <form action={createCategory} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nombre</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Descripción</label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Orden</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked className="rounded" />
            Categoría activa
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Crear categoría
            </button>
            <Link
              href="/admin/categorias"
              className="rounded-lg border px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
