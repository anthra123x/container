import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { requireAdminRole } from "@/lib/auth-helpers"

export const dynamic = "force-dynamic"

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) notFound()

  async function updateCategory(formData: FormData) {
    "use server"
    await requireAdminRole(2)

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0
    const isActive = formData.get("isActive") === "on"
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

    await prisma.category.update({
      where: { id },
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
        <h1 className="text-3xl font-bold">Editar: {category.name}</h1>
      </div>

      <div className="max-w-lg">
        <form action={updateCategory} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nombre</label>
            <input
              name="name"
              required
              defaultValue={category.name}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Descripción</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={category.description ?? ""}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Orden</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={category.sortOrder}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked={category.isActive} className="rounded" />
            Categoría activa
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Guardar cambios
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
