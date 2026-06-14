import Link from "next/link"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react"
import { removeFromCart, updateCartQuantity } from "@/lib/actions/cart"

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
            className="flex items-start gap-3 rounded-xl border bg-white p-3 shadow-sm md:items-center md:gap-4 md:p-4"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50 md:h-20 md:w-20">
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
                {formatCurrency(item.product.price)} c/u
              </p>
              <div className="mt-2 flex items-center gap-2">
                <form action={updateCartQuantity} className="flex items-center">
                  <input type="hidden" name="itemId" value={item.id} />
                  <button
                    type="submit"
                    name="quantity"
                    value={item.quantity - 1}
                    disabled={item.quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-l-lg border text-gray-500 transition-colors hover:bg-gray-50 hover:text-blue-600 disabled:opacity-40"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="flex h-8 w-10 items-center justify-center border-t border-b text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="submit"
                    name="quantity"
                    value={item.quantity + 1}
                    disabled={item.quantity >= item.product.stock}
                    className="flex h-8 w-8 items-center justify-center rounded-r-lg border text-gray-500 transition-colors hover:bg-gray-50 hover:text-blue-600 disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </form>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-blue-600">
                {formatCurrency(Number(item.product.price) * item.quantity)}
              </p>
              <form action={removeFromCart} className="mt-2">
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 text-xs text-red-500 transition-colors hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar
                </button>
              </form>
            </div>
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
