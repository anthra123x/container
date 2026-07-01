import Link from "next/link"
import type { Prisma } from "@prisma/client"
import { prisma, withRetry } from "@/lib/db"
import { ProductCard } from "@/components/store/ProductCard"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function StoreProductsPage({ searchParams }: Props) {
  const sp = await searchParams
  const search = sp.q
  const categorySlug = sp.categoria

  const where: Prisma.ProductWhereInput = { isActive: true }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  if (categorySlug) {
    const category = await withRetry(() => prisma.category.findUnique({ where: { slug: categorySlug } }))
    if (category) where.categoryId = category.id
  }

  const [products, categories] = await Promise.all([
    withRetry(() =>
      prisma.product.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      })
    ),
    withRetry(() => prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } })),
  ])

  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-900">Categorías</h2>
            <div className="space-y-1">
              <Link
                href="/productos"
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  !activeCategory
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                Todas
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/productos?categoria=${cat.slug}`}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeCategory?.slug === cat.slug
                      ? "bg-blue-50 font-medium text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {search ? `Resultados para "${search}"` : activeCategory ? activeCategory.name : "Productos"}
            </h1>
            {!search && (
              <p className="mt-1 text-sm text-gray-500">
                {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="mb-6 -mx-4 overflow-x-auto px-4 lg:hidden">
            <div className="flex gap-2 w-max">
              <Link
                href="/productos"
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  !activeCategory
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                Todas
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/productos?categoria=${cat.slug}`}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    activeCategory?.slug === cat.slug
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={Number(product.price)}
                comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
                imageUrl={product.images[0]?.url ?? null}
                imageAlt={product.images[0]?.alt ?? null}
                categoryName={product.category?.name}
                stock={product.stock}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">No se encontraron productos</h2>
              <p className="mt-1 text-sm text-gray-500">Intenta con otra categoría o término de búsqueda</p>
              <Link
                href="/productos"
                className="btn-primary mt-6 gap-2"
              >
                Ver todos los productos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
