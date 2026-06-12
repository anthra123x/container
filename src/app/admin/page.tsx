import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const session = await auth()
  const storeId = session?.user?.storeId

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    todayRevenue,
    weekRevenue,
    monthRevenue,
    totalProducts,
    totalCustomers,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    totalOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { storeId, createdAt: { gte: startOfDay }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { storeId, createdAt: { gte: startOfWeek }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { storeId, createdAt: { gte: startOfMonth }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
      _sum: { total: true },
    }),
    prisma.product.count({ where: { storeId, isActive: true } }),
    prisma.customer.count({ where: { storeId } }),
    prisma.order.count({ where: { storeId, status: "PENDING" } }),
    prisma.product.findMany({
      where: { storeId, isActive: true, stock: { lte: 0 } },
      select: { id: true, name: true, stock: true, minStock: true, slug: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
    prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, customerName: true, total: true, status: true, createdAt: true },
    }),
    prisma.order.count({ where: { storeId } }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/productos/nuevo"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nuevo Producto
          </Link>
          <Link
            href="/admin/ventas"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Ver Pedidos
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ventas Hoy"
          value={formatCurrency(Number(todayRevenue._sum.total ?? 0))}
          subtitle={formatDateTime(startOfDay)}
        />
        <StatsCard
          title="Ventas Semana"
          value={formatCurrency(Number(weekRevenue._sum.total ?? 0))}
        />
        <StatsCard
          title="Ventas Mes"
          value={formatCurrency(Number(monthRevenue._sum.total ?? 0))}
        />
        <StatsCard
          title="Pedidos Pendientes"
          value={pendingOrders}
          highlight={pendingOrders > 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="font-semibold">Pedidos Recientes</h2>
              <Link href="/admin/ventas" className="text-sm text-blue-600 hover:underline">Ver todos</Link>
            </div>
            <div className="divide-y">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/ventas/${order.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">#{order.id.slice(0, 8)}</span>
                    <span className="text-sm text-muted-foreground">{order.customerName ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[order.status] ?? ""}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</span>
                  </div>
                </Link>
              ))}
              {recentOrders.length === 0 && (
                <p className="px-6 py-8 text-center text-sm text-muted-foreground">No hay pedidos aún</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border">
            <div className="border-b px-6 py-4 font-semibold">Resumen</div>
            <div className="space-y-3 px-6 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Productos activos</span>
                <span className="font-medium">{totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total pedidos</span>
                <span className="font-medium">{totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clientes registrados</span>
                <span className="font-medium">{totalCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ventas del mes</span>
                <span className="font-medium">{formatCurrency(Number(monthRevenue._sum.total ?? 0))}</span>
              </div>
            </div>
          </div>

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
                    <span className="text-red-600 font-medium">Stock: {product.stock}</span>
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
                Agregar nuevo producto
              </Link>
              <Link
                href="/admin/ventas"
                className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
              >
                Gestionar pedidos pendientes
              </Link>
              <Link
                href="/admin/productos"
                className="flex items-center gap-3 rounded-lg bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
              >
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
  title, value, subtitle, highlight,
}: {
  title: string
  value: string | number
  subtitle?: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-lg border bg-card p-6 text-card-foreground shadow-sm ${highlight ? "border-yellow-300 bg-yellow-50" : ""}`}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${highlight ? "text-yellow-800" : ""}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
