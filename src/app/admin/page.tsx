import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const session = await auth()
  const storeId = session?.user?.storeId

  const [totalProducts, totalOrders, totalCustomers, recentOrders, lowStockProducts] =
    await Promise.all([
      prisma.product.count({ where: { storeId, isActive: true } }),
      prisma.order.count({ where: { storeId } }),
      prisma.customer.count({ where: { storeId } }),
      prisma.order.count({
        where: { storeId, status: "PENDING" },
      }),
      prisma.product.count({
        where: { storeId, isActive: true, stock: { lte: 0 } },
      }),
    ])

  const recentSales = await prisma.order.aggregate({
    where: {
      storeId,
      createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
    _sum: { total: true },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Productos" value={totalProducts} />
        <StatsCard title="Pedidos Pendientes" value={recentOrders} />
        <StatsCard title="Clientes" value={totalCustomers} />
        <StatsCard title="Ventas (30d)" value={`S/ ${Number(recentSales._sum.total ?? 0).toFixed(2)}`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Pedidos Recientes</h2>
          <p className="mt-2 text-3xl font-bold">{totalOrders}</p>
          <p className="text-sm text-muted-foreground">Total de pedidos</p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Stock Bajo</h2>
          <p className="mt-2 text-3xl font-bold">{lowStockProducts}</p>
          <p className="text-sm text-muted-foreground">Productos sin stock</p>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}
