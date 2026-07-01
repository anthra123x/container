import Link from "next/link"
import { prisma, withRetry } from "@/lib/db"
import { ArrowRight, Package, Shield, Truck, CreditCard, Star } from "lucide-react"
import { HeroImage } from "@/components/store/HeroImage"
import { ProductCard } from "@/components/store/ProductCard"

export const dynamic = "force-dynamic"

async function getFeaturedProducts() {
  return withRetry(() =>
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    })
  )
}

async function getCategories() {
  return withRetry(() =>
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
    })
  )
}

const benefits = [
  { icon: Truck, title: "Envío Rápido", desc: "Entrega en 24-48 horas en El Banco" },
  { icon: Shield, title: "Garantía", desc: "Todos los productos con garantía" },
  { icon: CreditCard, title: "Pago Seguro", desc: "Tarjeta, Nequi, Daviplata o contraentrega" },
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
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-24">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-blue-100 backdrop-blur-sm md:px-4 md:py-1.5 md:text-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 md:h-3.5 md:w-3.5" />
                Tienda colombiana de confianza
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:mt-6 md:text-5xl lg:text-6xl">
                Tecnología para tu
                <span className="mt-1 block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent md:mt-2">
                  día a día
                </span>
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-blue-100/80 md:mt-4 md:text-lg">
                En Container encuentras tecnología original con la mejor atención. 
                Te ayudamos a elegir el producto perfecto para ti.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl active:scale-[0.98]"
                >
                  Ver productos
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/promociones"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-[0.98]"
                >
                  Promociones
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4 text-xs text-blue-200 md:mt-8 md:gap-6 md:text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-green-400 md:h-6 md:w-6" />
                    <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-yellow-400 md:h-6 md:w-6" />
                    <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-blue-400 md:h-6 md:w-6" />
                  </div>
                  <span>+500 clientes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 md:h-4 md:w-4" />
                  <span>4.9/5</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <HeroImage />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="mx-auto max-w-7xl px-4 -mt-8 relative z-10 pb-12 animate-in fade-in duration-700">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className="group flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:border-blue-100 hover:ring-blue-100 md:items-start md:gap-3 md:p-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="shrink-0 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-1.5 transition-colors group-hover:from-blue-100 group-hover:to-blue-200 md:p-2.5">
                <benefit.icon className="h-4 w-4 text-blue-600 md:h-5 md:w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-gray-900 md:text-sm">{benefit.title}</h3>
                <p className="hidden text-xs leading-relaxed text-gray-500 md:mt-0.5 md:block">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 animate-in fade-in duration-700" style={{ animationDelay: "100ms" }}>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Categorías</h2>
              <p className="mt-1 text-sm text-gray-500">Explora por categoría</p>
            </div>
            <Link
              href="/productos"
              className="hidden items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 sm:flex"
            >
              Ver todas
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 ring-1 ring-foreground/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:ring-blue-100 md:p-6"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-500 group-hover:scale-[2] group-hover:from-blue-100 group-hover:to-blue-200" />
                <div className="relative">
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{cat.description}</p>
                  )}
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 transition-all group-hover:opacity-100">
                    Ver productos
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="bg-gray-50/80 py-16 animate-in fade-in duration-700" style={{ animationDelay: "200ms" }}>
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Productos Destacados</h2>
                <p className="mt-1 text-sm text-gray-500">Lo más vendido de la semana</p>
              </div>
              <Link
                href="/productos"
                className="hidden items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 sm:flex"
              >
                Ver todo
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product, i) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 80}ms` }}>
                  <ProductCard
                    slug={product.slug}
                    name={product.name}
                    price={Number(product.price)}
                    comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
                    imageUrl={product.images[0]?.url ?? null}
                    imageAlt={product.images[0]?.alt ?? null}
                    categoryName={product.category?.name}
                    stock={product.stock}
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600"
              >
                Ver todos los productos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-16 md:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            ¿Listo para comprar?
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-blue-100/80">
            Explora nuestro catálogo y encuentra el producto perfecto para ti.
            Atención personalizada en cada compra.
          </p>
          <Link
            href="/productos"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl active:scale-[0.98]"
          >
            Ir a la tienda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
