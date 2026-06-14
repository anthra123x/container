import type { OrderStatus } from "@prisma/client"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants"

export const dynamic = "force-dynamic"

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
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

  const storeConfig = await prisma.storeConfiguration.findFirst({
    where: { storeId: order.storeId },
    select: { whatsappNumber: true, storeName: true },
  })
  const adminWhatsApp = storeConfig?.whatsappNumber ? storeConfig.whatsappNumber.replace(/[^\d]/g, "") : null
  const customerPhone = order.customerPhone ? order.customerPhone.replace(/[^\d]/g, "") : null

  const validTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: ["REFUNDED"],
    CANCELLED: [],
    REFUNDED: [],
  }

  const nextStatuses = validTransitions[order.status] ?? []

  async function updateOrderStatus(formData: FormData) {
    "use server"
    const currentSession = await auth()
    if (!currentSession?.user) redirect("/login")

    const newStatus = formData.get("status") as string
    const note = formData.get("note") as string

    const currentOrder = await prisma.order.findUnique({ where: { id } })
    if (!currentOrder) return

    const allowed = validTransitions[currentOrder.status] ?? []
    if (!allowed.includes(newStatus)) return

    const timestampFields: Record<string, Date> = {}
    if (newStatus === "DELIVERED") timestampFields.deliveredAt = new Date()

    const transactions: any[] = [
      prisma.order.update({
        where: { id },
        data: {
          status: newStatus as OrderStatus,
          ...timestampFields,
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status: newStatus as OrderStatus,
          changedBy: currentSession.user.id,
          note: note || null,
        },
      }),
    ]

    if ((newStatus === "CANCELLED" || newStatus === "REFUNDED") && currentOrder.status !== "CANCELLED" && currentOrder.status !== "REFUNDED") {
      const items = await prisma.orderItem.findMany({ where: { orderId: id } })
      for (const item of items) {
        transactions.push(
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        )
      }
    }

    await prisma.$transaction(transactions)

    redirect(`/admin/ventas/${id}`)
  }

  const currentStatusColor = ORDER_STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"

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
                    <p className="text-sm font-medium">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[h.status] ?? ""}`}>
                        {ORDER_STATUS_LABELS[h.status] ?? h.status}
                      </span>
                    </p>
                    {h.note && <p className="text-xs text-muted-foreground mt-1">{h.note}</p>}
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
              {customerPhone && (
                <a
                  href={`https://wa.me/${customerPhone}?text=${encodeURIComponent(`Hola ${order.customerName ?? ""}, te escribimos de ${storeConfig?.storeName ?? "la tienda"} sobre tu pedido #${order.id.slice(0, 8)}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              )}
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
              <p>
                <span className="text-muted-foreground">Estado: </span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${currentStatusColor}`}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
              </p>
              <p><span className="text-muted-foreground">Fecha:</span> {formatDateTime(order.createdAt)}</p>
              <p><span className="text-muted-foreground">Items:</span> {order.items.length}</p>
            </div>
          </div>

          {nextStatuses.length > 0 && (
            <div className="rounded-lg border">
              <div className="border-b px-6 py-4 font-semibold">Cambiar estado</div>
              <form action={updateOrderStatus} className="space-y-3 px-6 py-4">
                <div>
                  <select
                    name="status"
                    required
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar...</option>
                    {nextStatuses.map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS_LABELS[s] ?? s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    name="note"
                    placeholder="Nota (opcional)"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Actualizar estado
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
