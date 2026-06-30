"use client"

import { useState, useCallback } from "react"
import { addToCart } from "@/lib/actions/cart"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils/formatters"
import { Minus, Plus } from "lucide-react"

interface Variant {
  id: string
  name: string
  type: string
  value: string
  price: string | null
  stock: number | null
  image: string | null
}

interface ProductActionsProps {
  productId: string
  name: string
  slug: string
  price: number
  baseStock: number
  variants: Variant[]
  hasDiscount: boolean
  comparePrice: number | null
  discountPercentage: number
}

export function ProductActions({
  productId,
  name: productName,
  slug,
  price,
  baseStock,
  variants,
  hasDiscount,
  comparePrice,
  discountPercentage,
}: ProductActionsProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [pending, setPending] = useState(false)
  const { addItem } = useCart()

  const selectedVariant = variants.find((v) => v.id === selectedVariantId)
  const variantPrice = selectedVariant?.price ? Number(selectedVariant.price) : null
  const displayPrice = variantPrice ?? price
  const displayComparePrice = hasDiscount && !selectedVariant?.price ? comparePrice : null
  const displayDiscount = displayComparePrice
    ? Math.round((1 - displayPrice / Number(displayComparePrice)) * 100)
    : (!selectedVariant?.price ? discountPercentage : 0)

  const variantStock = selectedVariant?.stock ?? null
  const effectiveStock = variantStock ?? baseStock
  const isOutOfStock = effectiveStock <= 0
  const hasVariants = variants.length > 0

  const grouped = variants.reduce<Record<string, Variant[]>>((acc, v) => {
    if (!acc[v.type]) acc[v.type] = []
    acc[v.type].push(v)
    return acc
  }, {})

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, effectiveStock)))
  }, [effectiveStock])

  async function handleSubmit(formData: FormData) {
    setPending(true)
    try {
      await addToCart(formData)
      addItem({
        id: crypto.randomUUID(),
        productId,
        slug,
        variantId: selectedVariantId ?? undefined,
        name: productName,
        price: displayPrice,
        maxStock: effectiveStock,
        image: selectedVariant?.image ?? "/placeholder.svg",
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-6">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="variantId" value={selectedVariantId ?? ""} />
      <input type="hidden" name="quantity" value={quantity} />

      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-blue-600">
            {formatCurrency(displayPrice)}
          </span>
          {displayComparePrice && (
            <>
              <span className="text-lg text-gray-400 line-through">
                {formatCurrency(displayComparePrice)}
              </span>
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                -{displayDiscount}%
              </span>
            </>
          )}
        </div>
      </div>

      {hasVariants && (
        <div className="space-y-4">
          {Object.entries(grouped).map(([type, typeVariants]) => (
            <div key={type}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {type === "COLOR" ? "Color" : type === "SIZE" ? "Talla" : type === "STORAGE" ? "Almacenamiento" : type}
              </label>
              <div className="flex flex-wrap gap-2">
                {typeVariants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantId(v.id)
                      setQuantity(1)
                    }}
                    data-state={selectedVariantId === v.id ? "selected" : "idle"}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selectedVariantId === v.id
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {type === "COLOR" ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block h-4 w-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: v.value }}
                        />
                        {v.name}
                      </span>
                    ) : (
                      v.name
                    )}
                    {v.price && Number(v.price) !== price && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({formatCurrency(Number(v.price))})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          {isOutOfStock ? (
            <>
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="font-medium text-red-600">Agotado</span>
            </>
          ) : effectiveStock <= 5 ? (
            <>
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="font-medium text-amber-600">
                Solo quedan {effectiveStock} unidad{effectiveStock !== 1 ? "es" : ""}
              </span>
            </>
          ) : (
            <>
              <span className="flex h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="font-medium text-green-600">
                {effectiveStock} en stock
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {hasVariants && !selectedVariantId && (
            <span className="text-amber-600">Selecciona una variante para continuar</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || isOutOfStock}
            className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex h-10 w-14 items-center justify-center border-x border-gray-200 text-sm font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= effectiveStock || isOutOfStock}
            className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="submit"
          disabled={isOutOfStock || (hasVariants && !selectedVariantId) || pending}
          className="btn-primary"
        >
          {pending ? "Agregando..." : isOutOfStock ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>
    </form>
  )
}
