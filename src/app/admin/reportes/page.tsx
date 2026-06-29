import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils/formatters"
import { SalesChart } from "./sales-chart"
import { TopProductsChart } from "./top-products-chart"

export const dynamic = "force-dynamic"

export default async function AdminReportsPage() {
  const session = await auth()
  const storeId = session?.user?.storeId

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const [
    dayRevenue,
    monthRevenue,
    yearRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    productsSold,
    monthlyData,
    topProducts,
    ordersByStatus,
    lowStock,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { storeId, createdAt: { gte: startOfDay }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { storeId, createdAt: { gte: startOfMonth }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { storeId, createdAt: { gte: startOfYear }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { storeId } }),
    prisma.customer.count({ where: { storeId } }),
    prisma.product.count({ where: { storeId, isActive: true } }),
    prisma.orderItem.aggregate({
      where: { order: { storeId } },
      _sum: { quantity: true },
    }),
    prisma.$queryRaw<{ month: string; total: number }[]>`
      SELECT
        to_char("createdAt", 'YYYY-MM') as month,
        SUM(total) as total
      FROM "Order"
      WHERE "storeId" = ${storeId} AND status NOT IN ('CANCELLED', 'REFUNDED')
        AND "createdAt" >= ${startOfYear}
      GROUP BY month
      ORDER BY month ASC
    `,
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: { order: { storeId } },
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { subtotal: "desc" } },
      take: 10,
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { storeId },
      _count: true,
    }),
    prisma.product.count({
      where: { storeId, isActive: true, stock: { lte: 0 } },
    }),
  ])

  const topProductDetails = topProducts.length > 0
    ? await prisma.product.findMany({
        where: { id: { in: topProducts.map((t) => t.productId) } },
        select: { id: true, name: true },
      })
    : []

  const topProductsData = topProducts.map((t) => ({
    name: topProductDetails.find((d) => d.id === t.productId)?.name ?? "N/A",
    total: Number(t._sum.subtotal ?? 0),
    quantity: t._sum.quantity ?? 0,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reportes</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Ventas hoy</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(Number(dayRevenue._sum.total ?? 0))}</p>
          <p className="mt-1 text-xs text-muted-foreground">{dayRevenue._count} pedido(s)</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Ventas del mes</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(Number(monthRevenue._sum.total ?? 0))}</p>
          <p className="mt-1 text-xs text-muted-foreground">{monthRevenue._count} pedido(s)</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Ventas del año</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(Number(yearRevenue._sum.total ?? 0))}</p>
          <p className="mt-1 text-xs text-muted-foreground">{totalOrders} pedido(s) totales</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Productos vendidos</p>
          <p className="mt-2 text-2xl font-bold">{productsSold._sum.quantity ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">{totalProducts} activos</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 font-semibold">Ventas mensuales</h2>
          <SalesChart data={monthlyData.map((d) => ({ month: d.month, total: Number(d.total) }))} />
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 font-semibold">Productos más vendidos</h2>
          <TopProductsChart data={topProductsData} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 font-semibold">Pedidos por estado</h2>
          <div className="space-y-3">
            {ordersByStatus.map((os) => (
              <div key={os.status} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{os.status}</span>
                <span className="font-medium">{os._count}</span>
              </div>
            ))}
            {ordersByStatus.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin datos</p>
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 font-semibold">Resumen</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Clientes registrados</span>
              <span className="font-medium">{totalCustomers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Productos activos</span>
              <span className="font-medium">{totalProducts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total pedidos</span>
              <span className="font-medium">{totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sin stock</span>
              <span className={`font-medium ${lowStock > 0 ? "text-red-600" : ""}`}>{lowStock}</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 font-semibold">Ticket promedio</h2>
          <p className="text-2xl font-bold">
            {totalOrders > 0
              ? formatCurrency(Number(yearRevenue._sum.total ?? 0) / totalOrders)
              : formatCurrency(0)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {totalOrders > 0 ? `${(productsSold._sum.quantity ?? 0 / totalOrders).toFixed(1)} productos por pedido` : "Sin datos"}
          </p>
        </div>
      </div>
    </div>
  )
}
