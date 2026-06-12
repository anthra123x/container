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

    await prisma.$transaction([
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
    ])

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
