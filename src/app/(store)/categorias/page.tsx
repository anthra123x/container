import Link from "next/link"
import { prisma } from "@/lib/db"
import { ArrowRight, FolderOpen } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Categorías</h1>
      <p className="mb-8 text-muted-foreground">
        Explora nuestros productos por categoría
      </p>

      {categories.length === 0 && (
        <div className="rounded-lg border bg-muted/30 px-8 py-16 text-center">
          <FolderOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No hay categorías disponibles</h2>
          <p className="mt-2 text-muted-foreground">Pronto agregaremos nuevas categorías</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/productos?categoria=${cat.slug}`}
            className="group rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold group-hover:text-blue-600">{cat.name}</h2>
            {cat.description && (
              <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {cat._count.products} producto{cat._count.products !== 1 ? "s" : ""}
              </span>
              <ArrowRight className="h-4 w-4 text-blue-600 opacity-0 transition group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
