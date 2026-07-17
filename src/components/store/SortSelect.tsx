"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

const OPTIONS = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Nombre A-Z" },
]

export function SortSelect({ current }: { current: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "newest") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }
    params.delete("page")
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
      style={{
        border: "1px solid oklch(0.92 0.004 260)",
        background: "oklch(0.99 0.002 260)",
        color: "oklch(0.13 0.01 260)",
        boxShadow: "0 1px 0 oklch(1 0 0 / 0.4)",
      }}
      aria-label="Ordenar por"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
