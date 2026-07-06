import Link from "next/link"
import { X } from "lucide-react"

interface FilterChipsProps {
  filters: { label: string; href: string }[]
  className?: string
}

export function FilterChips({ filters, className = "" }: FilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-500">Filtros activos:</span>
      {filters.map((f, i) => (
        <Link
          key={i}
          href={f.href}
          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
        >
          {f.label}
          <X className="h-3 w-3" />
        </Link>
      ))}
      {filters.length > 1 && (
        <Link
          href="/productos"
          className="text-xs text-gray-500 underline hover:text-gray-700"
        >
          Limpiar todo
        </Link>
      )}
    </div>
  )
}
