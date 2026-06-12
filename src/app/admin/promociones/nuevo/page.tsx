import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function NewPromotionPage() {
  async function createPromotion(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const type = formData.get("type") as string
    const value = parseFloat(formData.get("value") as string)
    const startsAt = new Date(formData.get("startsAt") as string)
    const endsAt = new Date(formData.get("endsAt") as string)
    const isActive = formData.get("isActive") === "on"

    await prisma.promotion.create({
      data: {
        name,
        description: description || null,
        type: type as "PERCENTAGE" | "FIXED_AMOUNT",
        value,
        startsAt,
        endsAt,
        isActive,
      },
    })

    redirect("/admin/promociones")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/promociones" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Volver
        </Link>
        <h1 className="text-3xl font-bold">Nueva Promoción</h1>
      </div>

      <div className="max-w-lg">
        <form action={createPromotion} className="space-y-5">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Tipo</label>
              <select
                name="type"
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FIXED_AMOUNT">Monto fijo (S/)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Valor</label>
              <input
                name="value"
                type="number"
                step="0.01"
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Inicio</label>
              <input
                name="startsAt"
                type="datetime-local"
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Fin</label>
              <input
                name="endsAt"
                type="datetime-local"
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked className="rounded" />
            Promoción activa
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Crear promoción
            </button>
            <Link
              href="/admin/promociones"
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
