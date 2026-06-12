import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { ArrowRight, Tag, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PromocionesPage() {
  const now = new Date()
  const promos = await prisma.promotion.findMany({
    where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
    include: {
      products: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Promociones</h1>
      <p className="mb-8 text-muted-foreground">
        Aprovecha nuestras ofertas y descuentos especiales
      </p>

      {promos.length === 0 && (
        <div className="rounded-lg border bg-muted/30 px-8 py-16 text-center">
          <Tag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No hay promociones activas</h2>
          <p className="mt-2 text-muted-foreground">
            Vuelve pronto para descubrir nuevas ofertas
          </p>
          <Link
            href="/productos"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ver productos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="space-y-8">
        {promos.map((promo) => (
          <div key={promo.id} className="overflow-hidden rounded-xl border shadow-sm">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">{promo.name}</h2>
              {promo.description && (
                <p className="mt-1 text-sm text-blue-100">{promo.description}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-xs text-blue-200">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Válido hasta {promo.endsAt.toLocaleDateString("es-PE")}
                </span>
                {promo.type === "PERCENTAGE" && Number(promo.value) > 0 && (
                  <span className="rounded bg-white/20 px-2 py-0.5 font-semibold">
                    Hasta {Number(promo.value)}% OFF
                  </span>
                )}
              </div>
            </div>
            {promo.products.length > 0 && (
              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                {promo.products.map((pp) => (
                  <Link
                    key={pp.productId}
                    href={`/productos/${pp.product.slug}`}
                    className="group rounded-lg border bg-card p-3 transition hover:shadow-md"
                  >
                    <div className="aspect-square overflow-hidden rounded-md bg-muted">
                      {pp.product.images[0] && (
                        <img
                          src={pp.product.images[0].url}
                          alt={pp.product.images[0].alt ?? pp.product.name}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {pp.product.category.name}
                    </p>
                    <p className="mt-1 text-sm font-medium line-clamp-2">{pp.product.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-bold text-blue-600">
                        {formatCurrency(pp.product.price)}
                      </span>
                      {pp.product.comparePrice && Number(pp.product.comparePrice) > Number(pp.product.price) && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(pp.product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
