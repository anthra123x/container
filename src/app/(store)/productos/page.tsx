import Link from "next/link"
import { withRetry } from "@/lib/db"
import { getFilteredProducts, getCatalogFacets } from "@/lib/queries/products"
import { ProductCard } from "@/components/store/ProductCard"
import { FilterSidebar } from "@/components/store/FilterSidebar"
import { SortSelect } from "@/components/store/SortSelect"
import { FilterChips } from "@/components/store/FilterChips"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function StoreProductsPage({ searchParams }: Props) {
  const sp = await searchParams
  const search = sp.q
  const categorySlug = sp.categoria
  const brandSlug = sp.marca
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined
  const sort = sp.sort ?? "newest"
  const page = sp.page ? Number(sp.page) : 1

  const [{ products, total }, facets] = await Promise.all([
    getFilteredProducts({ search, categorySlug, brandSlug, minPrice, maxPrice, sort, page }),
    withRetry(() => getCatalogFacets()),
  ])

  const activeCategory = categorySlug
    ? facets.categories.find((c) => c.slug === categorySlug)
    : null

  const activeBrand = brandSlug
    ? facets.brands.find((b) => b.slug === brandSlug)
    : null

  const activeFilters = [
    ...(search ? [{ label: `"${search}"`, href: removeParam("q") }] : []),
    ...(activeCategory ? [{ label: activeCategory.name, href: removeParam("categoria") }] : []),
    ...(activeBrand ? [{ label: activeBrand.name, href: removeParam("marca") }] : []),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? [{ label: `$${minPrice ?? 0} - $${maxPrice ?? "∞"}`, href: removeParams(["minPrice", "maxPrice"]) }]
      : []),
  ]

  function removeParam(key: string) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(sp)) {
      if (k !== key && v) params.set(k, v)
    }
    return `/productos${params.toString() ? `?${params.toString()}` : ""}`
  }

  function removeParams(keys: string[]) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(sp)) {
      if (!keys.includes(k) && v) params.set(k, v)
    }
    return `/productos${params.toString() ? `?${params.toString()}` : ""}`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pt-24">
      <div className="flex gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterSidebar
            categories={facets.categories}
            brands={facets.brands}
            priceRange={facets.priceRange}
            activeCategory={activeCategory?.slug ?? null}
            activeBrand={activeBrand?.slug ?? null}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: "oklch(0.13 0.01 260)" }}>
                {search ? `"${search}"` : activeCategory ? activeCategory.name : brandSlug ? activeBrand?.name ?? "Productos" : "Productos"}
              </h1>
              <p className="mt-1 text-sm" style={{ color: "oklch(0.56 0.01 260)" }}>
                {total} producto{total !== 1 ? "s" : ""}
                {search && <> para &ldquo;{search}&rdquo;</>}
              </p>
            </div>
            <SortSelect current={sort} />
          </div>

          {activeFilters.length > 0 && (
            <FilterChips filters={activeFilters} className="mb-4" />
          )}

          <div className="mb-4 lg:hidden">
            <FilterSidebar
              categories={facets.categories}
              brands={facets.brands}
              priceRange={facets.priceRange}
              activeCategory={activeCategory?.slug ?? null}
              activeBrand={activeBrand?.slug ?? null}
              minPrice={minPrice}
              maxPrice={maxPrice}
              mobile
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={Number(product.price)}
                imageUrl={product.images[0]?.url ?? null}
                imageAlt={product.images[0]?.alt ?? null}
                categoryName={product.category?.name}
                stock={product.stock}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div
              className="rounded-2xl py-16 text-center"
              style={{
                border: "1px dashed oklch(0.92 0.004 260)",
                background: "oklch(0.96 0.004 260 / 0.5)",
              }}
            >
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "oklch(0.92 0.004 260)" }}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "oklch(0.56 0.01 260)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold" style={{ color: "oklch(0.13 0.01 260)" }}>No se encontraron productos</h2>
              <p className="mt-1 text-sm" style={{ color: "oklch(0.56 0.01 260)" }}>Intenta con otros filtros o términos de búsqueda</p>
              <Link href="/productos" className="btn-primary mt-6 gap-2">
                Ver todos los productos
              </Link>
            </div>
          )}

          {total > 20 && (
            <Pagination current={page} total={total} searchParams={sp} />
          )}
        </div>
      </div>
    </div>
  )
}

async function Pagination({
  current,
  total,
  searchParams,
}: {
  current: number
  total: number
  searchParams: Record<string, string | undefined>
}) {
  const totalPages = Math.ceil(total / 20)
  if (totalPages <= 1) return null

  function pageUrl(page: number) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(searchParams)) {
      if (k !== "page" && v) params.set(k, v)
    }
    if (page > 1) params.set("page", String(page))
    return `/productos${params.toString() ? `?${params.toString()}` : ""}`
  }

  const pages: (number | "...")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Paginación">
      {current > 1 && (
        <Link
          href={pageUrl(current - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-gray-500 transition-colors hover:bg-gray-100"
        >
          ←
        </Link>
      )}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={pageUrl(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === current
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p}
          </Link>
        )
      )}
      {current < totalPages && (
        <Link
          href={pageUrl(current + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-gray-500 transition-colors hover:bg-gray-100"
        >
          →
        </Link>
      )}
    </nav>
  )
}
