import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters"
import { ORDER_STATUS_LABELS } from "@/lib/constants"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const session = await auth()
  const orders = await prisma.order.findMany({
    where: { storeId: session?.user?.storeId },
    include: { items: true, _count: { select: { statusHistory: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ventas</h1>

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
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <Link href={`/admin/ventas/${order.id}`} className="text-blue-600 hover:underline">Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
