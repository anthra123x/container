import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: { [key: string]: string | undefined }
}

export default async function StoreProductsPage({ searchParams }: Props) {
  const search = searchParams.q
  const categorySlug = searchParams.categoria

  const where: any = { isActive: true }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  if (categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (category) where.categoryId = category.id
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <h2 className="mb-4 font-semibold">Categorías</h2>
          <div className="space-y-2">
            <Link
              href="/productos"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Todas
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="mb-6 text-2xl font-bold">
            {search ? `Resultados para "${search}"` : "Productos"}
          </h1>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/productos/${product.slug}`}
                className="group rounded-lg border bg-card transition hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                  {product.images[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt ?? product.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">{product.category.name}</p>
                  <h3 className="mt-1 font-medium">{product.name}</h3>
                  <p className="mt-2 text-lg font-bold text-blue-600">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron productos
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
