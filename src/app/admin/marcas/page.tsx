import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marcas</h1>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Productos</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 text-sm font-medium">{brand.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{brand.slug}</td>
                <td className="px-4 py-3 text-sm">{brand._count.products}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    brand.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {brand.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
