import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/formatters"

interface ProductCardProps {
  slug: string
  name: string
  price: number
  imageUrl?: string | null
  imageAlt?: string | null
  categoryName?: string
  stock?: number
}

export function ProductCard({
  slug,
  name,
  price,
  imageUrl,
  imageAlt,
  categoryName,
  stock,
}: ProductCardProps) {
  const isOutOfStock = stock !== undefined && stock <= 0

  return (
    <Link
      href={`/productos/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500"
      style={{
        background: "oklch(0.99 0.002 260)",
        boxShadow: "0 1px 0 oklch(1 0 0 / 0.4), 0 4px 24px oklch(0.13 0.01 260 / 0.05)",
        border: "1px solid oklch(1 0 0 / 0.6)",
      }}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{
          background: "oklch(0.96 0.004 260)",
          boxShadow: "inset 0 0 0 1px oklch(0.13 0.01 260 / 0.04)",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            className="object-cover transition duration-500 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12" style={{ color: "oklch(0.92 0.004 260)" }}>
              <rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 22h32" stroke="currentColor" strokeWidth="1.5" />
              <rect x="16" y="26" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: "oklch(0.13 0.01 260 / 0.3)" }}>
            <span
              className="rounded-lg px-4 py-2 text-sm font-semibold shadow-lg"
              style={{ background: "oklch(0.99 0.002 260 / 0.95)", color: "oklch(0.13 0.01 260)" }}
            >
              Agotado
            </span>
          </div>
        )}

        <div
          className="absolute inset-0 flex items-center justify-center transition duration-500"
          style={{ background: "oklch(0.13 0.01 260 / 0)" }}
        >
          <span
            className="translate-y-4 rounded-lg px-4 py-2 text-sm font-medium opacity-0 shadow-lg transition-all duration-500"
            style={{
              background: "oklch(0.99 0.002 260 / 0.95)",
              color: "oklch(0.55 0.18 255)",
              transform: "translateY(16px)",
            }}
          >
            Ver producto
          </span>
        </div>
      </div>

      <style>{`
        .group:hover .translate-y-4 {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .group:hover [style*="oklch(0.13 0.01 260 / 0)"] {
          background: oklch(0.13 0.01 260 / 0.15) !important;
        }
      `}</style>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {categoryName && (
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "oklch(0.56 0.01 260)" }}>
            {categoryName}
          </p>
        )}
        <h3 className="font-medium leading-snug line-clamp-2" style={{ color: "oklch(0.13 0.01 260)" }}>
          {name}
        </h3>
        <div className="mt-auto">
          <span className="text-lg font-bold" style={{ color: "oklch(0.55 0.18 255)" }}>
            {formatCurrency(price)}
          </span>
        </div>
        {stock !== undefined && stock > 0 && stock <= 5 && (
          <p style={{ color: "oklch(0.65 0.15 50)" }}>
            Solo quedan {stock} unidad{stock !== 1 ? "es" : ""}
          </p>
        )}
        {stock !== undefined && stock > 5 && (
          <p style={{ color: "oklch(0.5 0.12 160)" }}>En stock</p>
        )}
      </div>
    </Link>
  )
}
