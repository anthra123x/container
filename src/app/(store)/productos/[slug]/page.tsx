import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { addToCart } from "@/lib/actions/cart"
import { Package, Clock, Truck, Shield, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
      galleries: {
        include: { images: { orderBy: { sortOrder: "asc" } } },
        orderBy: { sortOrder: "asc" },
      },
      promotions: {
        include: { promotion: true },
        where: { promotion: { isActive: true, endsAt: { gte: new Date() } } },
      },
    },
  })

  if (!product) notFound()

  const hasDiscount =
    product.comparePrice && Number(product.comparePrice) > Number(product.price)
  const discountPercentage = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : 0
  const isOutOfStock = product.stock <= 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="transition-colors hover:text-blue-600">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/productos?categoria=${product.category.slug}`} className="transition-colors hover:text-blue-600">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 shadow-sm ring-1 ring-gray-100">
            {product.images[0] ? (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-20 w-20 text-gray-200" />
              </div>
            )}
            {hasDiscount && (
              <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                -{discountPercentage}%
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                <span className="rounded-xl bg-white/95 px-6 py-3 text-base font-semibold text-gray-900 shadow-xl">
                  Agotado
                </span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <div
                  key={img.id}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 ring-1 transition ${
                    i === 0 ? "ring-2 ring-blue-500" : "ring-gray-200 hover:ring-blue-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt ?? ""}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
              {product.category.name}
            </span>
            {product.brand && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">{product.brand.name}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {product.name}
          </h1>

          <div className="mt-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blue-600">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>
          </div>

          {product.shortDescription && (
            <p className="mt-4 leading-relaxed text-gray-600">{product.shortDescription}</p>
          )}

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              {isOutOfStock ? (
                <>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="font-medium text-red-600">Agotado</span>
                </>
              ) : product.stock <= 5 ? (
                <>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="font-medium text-amber-600">
                    Solo quedan {product.stock} unidad{product.stock !== 1 ? "es" : ""}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="font-medium text-green-600">
                    {product.stock} en stock
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Truck className="h-4 w-4" />
              <span>Envío rápido a todo Colombia</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Producto original con garantía</span>
            </div>
          </div>

          <form action={addToCart} className="mt-8 flex items-center gap-4">
            <input type="hidden" name="productId" value={product.id} />
            <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:text-blue-600"
              >
                -
              </button>
              <input
                type="number"
                name="quantity"
                min={1}
                max={product.stock}
                defaultValue={1}
                className="h-10 w-14 border-x border-gray-200 bg-transparent text-center text-sm font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:text-blue-600"
              >
                +
              </button>
            </div>
            <button
              type="submit"
              disabled={isOutOfStock}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOutOfStock ? "Agotado" : "Agregar al carrito"}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-500 md:gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>24-48h</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Garantía</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Envío gratis</span>
            </div>
          </div>

          {product.description && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="mb-3 text-base font-semibold text-gray-900">Descripción</h2>
              <div className="prose prose-sm max-w-none leading-relaxed text-gray-600">
                {product.description}
              </div>
            </div>
          )}

          {product.galleries.length > 0 && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="mb-4 text-base font-semibold text-gray-900">Galerías</h2>
              {product.galleries.map((gallery) => (
                <div key={gallery.id} className="mb-6">
                  <h3 className="mb-2 text-sm font-medium text-gray-700">{gallery.name}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {gallery.images.map((img) => (
                      <div key={img.id} className="aspect-square overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200">
                        <img
                          src={img.url}
                          alt={img.alt ?? ""}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
