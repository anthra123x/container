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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categorías</h1>
        <p className="mt-1 text-gray-500">Explora nuestros productos por categoría</p>
      </div>

      {categories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-8 py-20 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100">
            <FolderOpen className="h-10 w-10 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No hay categorías disponibles</h2>
          <p className="mt-2 text-gray-500">Pronto agregaremos nuevas categorías</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/productos?categoria=${cat.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-500 group-hover:scale-[2] group-hover:from-blue-100 group-hover:to-blue-200" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 ring-1 ring-blue-100">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{cat.description}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {cat._count.products} producto{cat._count.products !== 1 ? "s" : ""}
                </span>
                <ArrowRight className="h-4 w-4 text-blue-600 transition-all group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
