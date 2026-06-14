import { Suspense } from "react"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants"
import { PhoneAutoLookup } from "@/components/store/phone-lookup"
import { Package, Search } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{ phone?: string }>
}

export default async function MyOrdersPage({ searchParams }: Props) {
  const { phone } = await searchParams

  if (!phone) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold">Mis pedidos</h1>
          <p className="mt-2 text-muted-foreground">Ingresa tu número de teléfono para consultar tus pedidos.</p>
        </div>

        <form className="mt-8 flex flex-col gap-3 sm:flex-row" method="GET">
          <input
            name="phone"
            type="tel"
            required
            className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
            placeholder="+57 300 123 4567"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Search className="h-4 w-4" />
            Consultar
          </button>
        </form>

        <Suspense>
          <PhoneAutoLookup />
        </Suspense>
      </div>
    )
  }

  const cleanPhone = phone.replace(/[^\d]/g, "")
  const orders = await prisma.order.findMany({
    where: {
      customerPhone: { contains: cleanPhone },
    },
    include: {
      items: { take: 3, orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mis pedidos</h1>
        <p className="mt-1 text-muted-foreground">
          {orders.length > 0
            ? `Encontramos ${orders.length} pedido${orders.length !== 1 ? "s" : ""} para tu número.`
            : "No encontramos pedidos con este número. ¿Tal vez usaste otro?"}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
          <Package className="mx-auto h-12 w-12 text-gray-200" />
          <p className="mt-4 text-muted-foreground">No hay pedidos registrados con este número.</p>
          <Link
            href="/productos"
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusColor = ORDER_STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"
            const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status
            return (
              <Link
                key={order.id}
                href={`/pedido/${order.id}`}
                className="block rounded-xl border bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Pedido #{order.id.slice(0, 8)}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {formatDateTime(order.createdAt)} &middot; {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{formatCurrency(order.total)}</p>
                    <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
                {order.items.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 border-t pt-3 text-xs text-gray-400">
                    {order.items.slice(0, 3).map((item) => (
                      <span key={item.id} className="truncate max-w-[200px]">
                        {item.productName}
                      </span>
                    ))}
                    {order.items.length > 3 && <span>+{order.items.length - 3} más</span>}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
