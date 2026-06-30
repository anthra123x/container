import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils/formatters"
import { SearchBar } from "@/components/admin/SearchBar"
import { Pagination } from "@/components/admin/Pagination"
import type { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"
const PAGE_SIZE = 15

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const sp = await searchParams
  const session = await auth()
  const storeId = session?.user?.storeId ?? ""
  const page = Math.max(1, parseInt(sp.page ?? "1"))
  const search = sp.q

  const where: Prisma.ProductWhereInput = { storeId }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ]
  }

  const [products, total, allProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: { storeId },
      select: { price: true, stock: true },
    }),
  ])

  const totalValue = allProducts.reduce((sum, p) => sum + Number(p.price) * p.stock, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Valor inventario: <span className="font-medium text-foreground">{formatCurrency(totalValue)}</span>
          </p>
          <Link
            href="/admin/productos/nuevo"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nuevo Producto
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar placeholder="Buscar por nombre o SKU..." />
        {search && (
          <Link href="/admin/productos" className="text-sm text-muted-foreground hover:text-foreground">
            Limpiar filtro
          </Link>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[700px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Producto</th>
              <th className="px-4 py-3 text-left text-sm font-medium">SKU</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Precio</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Vendidos</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => {
              const stockStatus = product.stock <= 0 ? "out" : product.stock <= product.minStock ? "low" : "ok"
              return (
                <tr key={product.id} className={`hover:bg-muted/50 ${product.stock <= 0 ? "bg-red-50/50" : product.stock <= product.minStock ? "bg-yellow-50/50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                        {product.images[0] && (
                          <Image
                            src={product.images[0].url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
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
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                      stockStatus === "out" ? "bg-red-100 text-red-700" :
                      stockStatus === "low" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        stockStatus === "out" ? "bg-red-500" :
                        stockStatus === "low" ? "bg-yellow-500" :
                        "bg-green-500"
                      }`} />
                      {stockStatus === "out" ? "Sin stock" :
                       stockStatus === "low" ? `${product.stock} uds` :
                       product.stock}
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
              )
            })}
          </tbody>
        </table>
        <Pagination total={total} page={page} pageSize={PAGE_SIZE} />
      </div>

      {products.length === 0 && (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">No hay productos aún</p>
          <Link
            href="/admin/productos/nuevo"
            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
          >
            Crear el primer producto
          </Link>
        </div>
      )}
    </div>
  )
}
