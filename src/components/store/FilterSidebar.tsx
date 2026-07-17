"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"

interface FacetItem {
  slug: string
  name: string
  count: number
}

interface FilterSidebarProps {
  categories: FacetItem[]
  brands: FacetItem[]
  priceRange: { min: number; max: number }
  activeCategory: string | null
  activeBrand: string | null
  minPrice?: number
  maxPrice?: number
  mobile?: boolean
}

export function FilterSidebar({
  categories,
  brands,
  priceRange,
  activeCategory,
  activeBrand,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
  mobile,
}: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const [priceMin, setPriceMin] = useState(initialMinPrice?.toString() ?? "")
  const [priceMax, setPriceMax] = useState(initialMaxPrice?.toString() ?? "")

  function buildUrl(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    params.delete("page")
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  function applyPrice() {
    router.push(buildUrl({ minPrice: priceMin || null, maxPrice: priceMax || null }))
  }

  if (mobile) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {(activeCategory || activeBrand || priceMin || priceMax) && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {[activeCategory, activeBrand, priceMin || priceMax ? 1 : null].filter(Boolean).length}
            </span>
          )}
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
            <div className="relative ml-auto flex h-full w-80 flex-col bg-white shadow-xl animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <h2 className="font-semibold">Filtros</h2>
                <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <FilterContent
                  categories={categories}
                  brands={brands}
                  priceRange={priceRange}
                  activeCategory={activeCategory}
                  activeBrand={activeBrand}
                  priceMin={priceMin}
                  priceMax={priceMax}
                  setPriceMin={setPriceMin}
                  setPriceMax={setPriceMax}
                  applyPrice={applyPrice}
                  buildUrl={buildUrl}
                />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="sticky top-24 space-y-5">
      <div
        className="rounded-2xl p-5"
        style={{
          background: "oklch(0.99 0.002 260)",
          boxShadow: "0 1px 0 oklch(1 0 0 / 0.4), 0 4px 24px oklch(0.13 0.01 260 / 0.05)",
          border: "1px solid oklch(1 0 0 / 0.6)",
        }}
      >
        <FilterContent
          categories={categories}
          brands={brands}
          priceRange={priceRange}
          activeCategory={activeCategory}
          activeBrand={activeBrand}
          priceMin={priceMin}
          priceMax={priceMax}
          setPriceMin={setPriceMin}
          setPriceMax={setPriceMax}
          applyPrice={applyPrice}
          buildUrl={buildUrl}
        />
      </div>
    </div>
  )
}

function FilterContent({
  categories,
  brands,
  priceRange,
  activeCategory,
  activeBrand,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  applyPrice,
  buildUrl,
}: {
  categories: FacetItem[]
  brands: FacetItem[]
  priceRange: { min: number; max: number }
  activeCategory: string | null
  activeBrand: string | null
  priceMin: string
  priceMax: string
  setPriceMin: (v: string) => void
  setPriceMax: (v: string) => void
  applyPrice: () => void
  buildUrl: (updates: Record<string, string | null>) => string
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.56 0.01 260)" }}>
          Categorías
        </h3>
        <div className="space-y-0.5">
          <FilterLink
            href={buildUrl({ categoria: null })}
            active={!activeCategory}
            label="Todas"
            count={categories.reduce((s, c) => s + c.count, 0)}
          />
          {categories.map((cat) => (
            <FilterLink
              key={cat.slug}
              href={buildUrl({ categoria: cat.slug })}
              active={activeCategory === cat.slug}
              label={cat.name}
              count={cat.count}
            />
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.56 0.01 260)" }}>
            Marcas
          </h3>
          <div className="space-y-0.5">
            <FilterLink
              href={buildUrl({ marca: null })}
              active={!activeBrand}
              label="Todas"
              count={brands.reduce((s, b) => s + b.count, 0)}
            />
            {brands.map((brand) => (
              <FilterLink
                key={brand.slug}
                href={buildUrl({ marca: brand.slug })}
                active={activeBrand === brand.slug}
                label={brand.name}
                count={brand.count}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.56 0.01 260)" }}>
          Precio
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder={`$${priceRange.min.toLocaleString()}`}
            className="w-full rounded-lg px-3 py-1.5 text-sm outline-none transition-colors"
            style={{
              border: "1px solid oklch(0.92 0.004 260)",
              background: "oklch(1 0 0 / 0.5)",
              color: "oklch(0.13 0.01 260)",
            }}
          />
          <span className="text-xs" style={{ color: "oklch(0.56 0.01 260)" }}>—</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder={`$${priceRange.max.toLocaleString()}`}
            className="w-full rounded-lg px-3 py-1.5 text-sm outline-none transition-colors"
            style={{
              border: "1px solid oklch(0.92 0.004 260)",
              background: "oklch(1 0 0 / 0.5)",
              color: "oklch(0.13 0.01 260)",
            }}
          />
        </div>
        <button
          onClick={applyPrice}
          className="mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
          style={{
            background: "oklch(0.55 0.18 255 / 0.1)",
            color: "oklch(0.55 0.18 255)",
          }}
        >
          Aplicar
        </button>
      </div>
    </div>
  )
}

function FilterLink({
  href,
  active,
  label,
  count,
}: {
  href: string
  active: boolean
  label: string
  count: number
}) {
  return (
    <a
      href={href}
      className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors ${
        active ? "font-medium" : "hover-glass-bg"
      }`}
      style={{
        color: active ? "oklch(0.55 0.18 255)" : "oklch(0.45 0.01 260)",
        background: active ? "oklch(0.55 0.18 255 / 0.08)" : "transparent",
      }}
    >
      <span>{label}</span>
      <span className="text-xs" style={{ color: active ? "oklch(0.55 0.18 255 / 0.6)" : "oklch(0.56 0.01 260)" }}>
        {count}
      </span>
    </a>
  )
}
