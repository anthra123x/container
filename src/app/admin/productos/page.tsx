import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Nuevo Producto
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Producto</th>
              <th className="px-4 py-3 text-left text-sm font-medium">SKU</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Precio</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Ventas</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{product.sku ?? "-"}</td>
                <td className="px-4 py-3 text-sm">{product.category.name}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={product.stock <= product.minStock ? "text-red-600 font-medium" : ""}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    product.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {product.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{product._count.orderItems}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
