import { prisma } from "@/lib/db"
import { formatDateTime } from "@/lib/utils/formatters"

export const dynamic = "force-dynamic"

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Promociones</h1>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Descuento</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Productos</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Vigencia</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {promotions.map((promo) => {
              const now = new Date()
              const isActive = promo.isActive && promo.startsAt <= now && promo.endsAt >= now
              return (
                <tr key={promo.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{promo.name}</td>
                  <td className="px-4 py-3 text-sm">{promo.type === "PERCENTAGE" && Number(promo.value) > 0 ? `${Number(promo.value)}%` : promo.type === "FIXED_AMOUNT" ? `S/ ${Number(promo.value).toFixed(2)}` : "-"}</td>
                  <td className="px-4 py-3 text-sm">{promo._count.products}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDateTime(promo.startsAt)} - {formatDateTime(promo.endsAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {isActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
