import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"

export const dynamic = "force-dynamic"

interface Props {
  params: { slug: string }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findFirst({
    where: { slug: params.slug, isActive: true },
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href={`/productos?categoria=${product.category.slug}`} className="hover:text-foreground">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            {product.images[0] && (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {product.images.map((img) => (
                <div key={img.id} className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
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
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.brand && (
            <p className="mt-1 text-sm text-muted-foreground">{product.brand.name}</p>
          )}

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-blue-600">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-muted-foreground">{product.shortDescription}</p>
          )}

          <div className="mt-6">
            <p className="text-sm">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  {product.stock} en stock
                </span>
              ) : (
                <span className="text-red-600 font-medium">Agotado</span>
              )}
            </p>
          </div>

          <form className="mt-6 flex items-center gap-4">
            <input
              type="number"
              min={1}
              max={product.stock}
              defaultValue={1}
              className="w-20 rounded-md border px-3 py-2 text-center"
            />
            <button
              type="submit"
              disabled={product.stock === 0}
              className="flex-1 rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Agregar al carrito
            </button>
          </form>

          {product.description && (
            <div className="mt-8 border-t pt-6">
              <h2 className="mb-2 font-semibold">Descripción</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {product.description}
              </div>
            </div>
          )}

          {product.galleries.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h2 className="mb-4 font-semibold">Galerías</h2>
              {product.galleries.map((gallery) => (
                <div key={gallery.id} className="mb-6">
                  <h3 className="mb-2 text-sm font-medium">{gallery.name}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.images.map((img) => (
                      <div key={img.id} className="aspect-square overflow-hidden rounded-md bg-muted">
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
