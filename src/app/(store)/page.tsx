import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { ArrowRight, Package, Shield, Truck, CreditCard } from "lucide-react"

export const dynamic = "force-dynamic"

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  })
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
  })
}

const benefits = [
  { icon: Truck, title: "Envío Rápido", desc: "Entrega en 24-48 horas en Lima" },
  { icon: Shield, title: "Garantía", desc: "Todos los productos con garantía" },
  { icon: CreditCard, title: "Pago Seguro", desc: "Tarjeta, Yape, Plin o contraentrega" },
  { icon: Package, title: "Originales", desc: "100% productos originales" },
]

export default async function StoreHome() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Tecnología para tu
              <span className="block text-blue-200">día a día</span>
            </h1>
            <p className="mt-4 text-lg text-blue-100 md:text-xl">
              Encuentra los mejores productos tecnológicos al mejor precio.
              Originales, con garantía y envío rápido a todo el Perú.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
              >
                Ver productos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/promociones"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Promociones
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3 rounded-xl border bg-white p-4 shadow-sm">
              <div className="rounded-lg bg-blue-50 p-2">
                <benefit.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{benefit.title}</h3>
                <p className="text-xs text-gray-500">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Categorías</h2>
            <Link href="/productos" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Ver todas
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-blue-50 transition group-hover:scale-150" />
                <div className="relative">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{cat.name}</h3>
                  {cat.description && (
                    <p className="mt-1 text-sm text-gray-500">{cat.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
              <Link href="/productos" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Ver todo
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/productos/${product.slug}`}
                  className="group rounded-xl border bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt ?? product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500">{product.category.name}</p>
                    <h3 className="mt-1 font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="mt-2 text-lg font-bold text-blue-600">
                      {formatCurrency(product.price)}
                    </p>
                    {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.comparePrice)}
                        </p>
                        <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-600">
                          -{Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">¿Listo para comprar?</h2>
        <p className="mt-2 text-gray-500">Explora nuestro catálogo y encuentra lo que necesitas</p>
        <Link
          href="/productos"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          Ir a la tienda
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </>
  )
}
