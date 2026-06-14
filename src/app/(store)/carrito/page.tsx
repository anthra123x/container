import Link from "next/link"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { ShoppingBag, Trash2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CartPage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("cart_session")?.value

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold">Carrito de compras</h1>
        <p className="mt-4 text-muted-foreground">Tu carrito está vacío.</p>
        <Link
          href="/productos"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
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
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold">Carrito de compras</h1>
        <p className="mt-4 text-muted-foreground">Tu carrito está vacío.</p>
        <Link
          href="/productos"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
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
      <h1 className="mb-8 text-3xl font-bold">Carrito de compras</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
              {item.product.images[0] ? (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.images[0].alt ?? item.product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-200">
                  <ShoppingBag className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/productos/${item.product.slug}`}
                className="font-medium text-gray-900 hover:text-blue-600"
              >
                {item.product.name}
              </Link>
              <p className="mt-0.5 text-sm text-gray-500">
                Cantidad: {item.quantity}
              </p>
              <p className="text-sm font-medium text-blue-600">
                {formatCurrency(Number(item.product.price) * item.quantity)}
              </p>
            </div>
            <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-blue-600">{formatCurrency(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800"
        >
          Proceder al pago
        </Link>
      </div>
    </div>
  )
}
