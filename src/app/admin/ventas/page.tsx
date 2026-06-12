import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const session = await auth()
  const orders = await prisma.order.findMany({
    where: { storeId: session?.user?.storeId },
    orderBy: { createdAt: "desc" },
  })

  const totalRevenue = orders
    .filter((o) => !["CANCELLED", "REFUNDED"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total), 0)

  const statusCounts: Record<string, number> = {}
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ventas</h1>
        <p className="text-sm text-muted-foreground">
          Total ingresos: <span className="font-medium text-foreground">{formatCurrency(totalRevenue)}</span>
          <span className="mx-2">&middot;</span>
          {orders.length} pedidos
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
          <span
            key={status}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}
          >
            {label}
            <span className="ml-1 opacity-70">({statusCounts[status] || 0})</span>
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Pedido</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Cliente</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 text-sm font-medium">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-sm">{order.customerName ?? "—"}</td>
                <td className="px-4 py-3 text-sm">{order.customerPhone ?? "—"}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${ORDER_STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <Link href={`/admin/ventas/${order.id}`} className="text-blue-600 hover:underline">Ver detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">No hay ventas registradas</p>
        </div>
      )}
    </div>
  )
}
