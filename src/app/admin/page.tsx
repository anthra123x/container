import Link from "next/link"
import { prisma } from "@/lib/db"
import { Package, MessageSquare, AlertTriangle, Plus, Eye } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [totalProducts, pendingReviews, lowStockProducts, recentReviews] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: 0 } },
      select: { id: true, name: true, stock: true, slug: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
    prisma.review.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        customerName: true,
        rating: true,
        content: true,
        createdAt: true,
        product: { select: { name: true, slug: true } },
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuevo Producto
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Productos activos"
          value={totalProducts}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Reseñas pendientes"
          value={pendingReviews}
          icon={MessageSquare}
          color="amber"
          highlight={pendingReviews > 0}
        />
        <StatsCard
          title="Productos sin stock"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="red"
          highlight={lowStockProducts.length > 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-semibold">Reseñas Pendientes</h2>
            <Link href="/admin/resenas" className="text-sm text-blue-600 hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y">
            {recentReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{review.customerName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      en {review.product.name} &middot; {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/resenas"
                  className="shrink-0 text-xs text-blue-600 hover:underline"
                >
                  Revisar
                </Link>
              </div>
            ))}
            {recentReviews.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">No hay reseñas pendientes</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {lowStockProducts.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50">
              <div className="border-b border-red-200 px-6 py-4 font-semibold text-red-800">
                Productos sin stock ({lowStockProducts.length})
              </div>
              <div className="divide-y divide-red-100">
                {lowStockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/productos/${product.id}`}
                    className="flex items-center justify-between px-6 py-3 text-sm hover:bg-red-100/50 transition-colors"
                  >
                    <span className="font-medium text-red-900">{product.name}</span>
                    <span className="font-medium text-red-600">Stock: {product.stock}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border">
            <div className="border-b px-6 py-4 font-semibold">Acciones Rápidas</div>
            <div className="space-y-2 px-6 py-4">
              <Link
                href="/admin/productos/nuevo"
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Agregar nuevo producto
              </Link>
              <Link
                href="/admin/resenas"
                className="flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Moderar reseñas ({pendingReviews})
              </Link>
              <Link
                href="/admin/productos"
                className="flex items-center gap-3 rounded-lg bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Revisar inventario
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({
  title, value, icon: Icon, color, highlight,
}: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
  highlight?: boolean
}) {
  const colorMap: Record<string, { bg: string; text: string; icon: string; card: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600", card: "" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-600", card: "border-amber-200 bg-amber-50" },
    red: { bg: "bg-red-50", text: "text-red-700", icon: "text-red-600", card: "border-red-200 bg-red-50" },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className={`rounded-lg border bg-card p-6 text-card-foreground shadow-sm ${highlight ? c.card : ""}`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.bg}`}>
          <Icon className={`h-6 w-6 ${c.icon}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${highlight ? c.text : ""}`}>{value}</p>
        </div>
      </div>
    </div>
  )
}
