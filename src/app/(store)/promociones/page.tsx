import Link from "next/link"
import { prisma } from "@/lib/db"
import { ArrowRight, Tag, Clock } from "lucide-react"
import { ProductCard } from "@/components/store/ProductCard"

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Promociones</h1>
        <p className="mt-1 text-gray-500">Aprovecha nuestras ofertas y descuentos especiales</p>
      </div>

      {promos.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-8 py-20 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100">
            <Tag className="h-10 w-10 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No hay promociones activas</h2>
          <p className="mt-2 text-gray-500">Vuelve pronto para descubrir nuevas ofertas</p>
          <Link
            href="/productos"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Ver productos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="space-y-8">
        {promos.map((promo) => {
          const isPercentage = promo.type === "PERCENTAGE" && Number(promo.value) > 0
          return (
            <div key={promo.id} className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{promo.name}</h2>
                    {promo.description && (
                      <p className="mt-1 text-sm text-blue-100">{promo.description}</p>
                    )}
                  </div>
                  {isPercentage && (
                    <div className="shrink-0 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur-sm">
                      Hasta {Number(promo.value)}% OFF
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-blue-200">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Válido hasta {promo.endsAt.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              </div>
              {promo.products.length > 0 && (
                <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  {promo.products.map((pp) => (
                    <ProductCard
                      key={pp.productId}
                      slug={pp.product.slug}
                      name={pp.product.name}
                      price={Number(pp.product.price)}
                      comparePrice={pp.product.comparePrice ? Number(pp.product.comparePrice) : null}
                      imageUrl={pp.product.images[0]?.url ?? null}
                      imageAlt={pp.product.images[0]?.alt ?? null}
                      categoryName={pp.product.category?.name}
                      stock={pp.product.stock}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
