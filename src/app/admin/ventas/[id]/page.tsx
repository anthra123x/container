import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters"
import { ORDER_STATUS_LABELS } from "@/lib/constants"

export const dynamic = "force-dynamic"

interface Props {
  params: { id: string }
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: { select: { name: true, slug: true, sku: true } },
        },
      },
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!order) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/ventas" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Volver
        </Link>
        <h1 className="text-3xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border">
            <div className="border-b px-6 py-4 font-semibold">Productos</div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {item.product.sku ?? "-"} &middot; Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t px-6 py-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="border-b px-6 py-4 font-semibold">Historial de estado</div>
            <div className="divide-y">
              {order.statusHistory.map((h) => (
                <div key={h.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium">{ORDER_STATUS_LABELS[h.status] ?? h.status}</p>
                    {h.note && <p className="text-xs text-muted-foreground">{h.note}</p>}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDateTime(h.createdAt)}</p>
                </div>
              ))}
              {order.statusHistory.length === 0 && (
                <p className="px-6 py-4 text-sm text-muted-foreground">Sin historial</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border">
            <div className="border-b px-6 py-4 font-semibold">Cliente</div>
            <div className="space-y-2 px-6 py-4 text-sm">
              <p><span className="text-muted-foreground">Nombre:</span> {order.customerName ?? "-"}</p>
              <p><span className="text-muted-foreground">Email:</span> {order.customerEmail ?? "-"}</p>
              <p><span className="text-muted-foreground">Teléfono:</span> {order.customerPhone ?? "-"}</p>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="border-b px-6 py-4 font-semibold">Envío</div>
            <div className="space-y-2 px-6 py-4 text-sm">
              <p><span className="text-muted-foreground">Dirección:</span> {order.shippingAddress ?? "-"}</p>
              <p><span className="text-muted-foreground">Ciudad:</span> {order.shippingCity ?? "-"}</p>
              <p><span className="text-muted-foreground">Estado/Región:</span> {order.shippingState ?? "-"}</p>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="border-b px-6 py-4 font-semibold">Resumen</div>
            <div className="space-y-2 px-6 py-4 text-sm">
              <p><span className="text-muted-foreground">Estado:</span> {ORDER_STATUS_LABELS[order.status] ?? order.status}</p>
              <p><span className="text-muted-foreground">Fecha:</span> {formatDateTime(order.createdAt)}</p>
              <p><span className="text-muted-foreground">Items:</span> {order.items.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
