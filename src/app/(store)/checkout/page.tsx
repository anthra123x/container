import Link from "next/link"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { ShoppingBag } from "lucide-react"
import { createOrder } from "@/lib/actions/order"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { error } = await searchParams
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("cart_session")?.value

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Carrito vacío</h1>
        <p className="mt-2 text-muted-foreground">Agrega productos antes de finalizar tu compra.</p>
        <Link
          href="/productos"
          className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  const cart = await prisma.cart.findFirst({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, slug: true, price: true, stock: true, images: { where: { isPrimary: true }, take: 1 } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Carrito vacío</h1>
        <p className="mt-2 text-muted-foreground">Agrega productos antes de finalizar tu compra.</p>
        <Link
          href="/productos"
          className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Finalizar compra</h1>
      <p className="mb-8 text-muted-foreground">
        Completa tus datos para realizar el pedido. Te contactaremos por WhatsApp para coordinar el pago y la entrega.
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form action={createOrder} className="space-y-5">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Tus datos</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="customerName"
                    required
                    className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="customerPhone"
                      type="tel"
                      required
                      className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                      placeholder="+57 300 123 4567"
                    />
                    <p className="mt-1 text-xs text-gray-400">Te contactaremos por WhatsApp</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      name="customerEmail"
                      type="email"
                      className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Dirección de envío</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="shippingAddress"
                    required
                    className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                    placeholder="Cra 1 #2-3, Barrio Centro"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Ciudad <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="shippingCity"
                      required
                      className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                      placeholder="El Banco"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Departamento
                    </label>
                    <input
                      name="shippingState"
                      className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                      placeholder="Magdalena"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Código postal
                    </label>
                    <input
                      name="shippingZip"
                      className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Notas del pedido</h2>
              <textarea
                name="notes"
                rows={3}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                placeholder="¿Alguna indicación especial? (opcional)"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800"
            >
              Confirmar pedido
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Resumen del pedido</h2>

            <div className="divide-y">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-200">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(Number(item.product.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4 text-base font-semibold">
              <span>Total</span>
              <span className="text-blue-600">{formatCurrency(total)}</span>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
              <p className="font-medium">Pago contraentrega</p>
              <p className="mt-1">
                No necesitas pagar ahora. Te contactaremos por WhatsApp para coordinar el pago por Nequi o Daviplata.
                Enviamos a todo Colombia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
