import Image from "next/image"
import Link from "next/link"
import { Package } from "lucide-react"
import { formatCurrency } from "@/lib/utils/formatters"

interface ProductCardProps {
  slug: string
  name: string
  price: number
  comparePrice?: number | null
  imageUrl?: string | null
  imageAlt?: string | null
  categoryName?: string
  stock?: number
}

export function ProductCard({
  slug,
  name,
  price,
  comparePrice,
  imageUrl,
  imageAlt,
  categoryName,
  stock,
}: ProductCardProps) {
  const hasDiscount = comparePrice && comparePrice > price
  const discountPercentage = hasDiscount
    ? Math.round((1 - price / comparePrice) * 100)
    : 0
  const isOutOfStock = stock !== undefined && stock <= 0

  return (
    <Link
      href={`/productos/${slug}`}
      className="group relative flex flex-col overflow-hidden card-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-gray-200" />
          </div>
        )}

        {hasDiscount && discountPercentage > 0 && (
          <div className="badge-discount">
            -{discountPercentage}%
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            <span className="rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg">
              Agotado
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
          <span className="translate-y-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Ver producto
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {categoryName && (
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {categoryName}
          </p>
        )}
        <h3 className="font-medium leading-snug text-gray-900 line-clamp-2">
          {name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-blue-600">
            {formatCurrency(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(comparePrice)}
            </span>
          )}
        </div>
        {stock !== undefined && stock > 0 && stock <= 5 && (
          <p className="text-xs text-amber-600">
            Solo quedan {stock} unidad{stock !== 1 ? "es" : ""}
          </p>
        )}
        {stock !== undefined && stock > 5 && (
          <p className="text-xs text-green-600">En stock</p>
        )}
      </div>
    </Link>
  )
}
