import Link from "next/link"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { CheckoutForm } from "@/components/store/CheckoutForm"

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
          className="btn-primary mt-6"
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
          variant: { select: { id: true, name: true, value: true, price: true, stock: true } },
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
          className="btn-primary mt-6"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  const total = cart.items.reduce((sum, item) => {
    const unitPrice = item.variant?.price ? Number(item.variant.price) : Number(item.product.price)
    return sum + unitPrice * item.quantity
  }, 0)

  const items = cart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      images: item.product.images.map((img) => ({ url: img.url })),
    },
    variant: item.variant
      ? { name: item.variant.name, price: item.variant.price ? Number(item.variant.price) : null }
      : null,
  }))

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Finalizar compra</h1>
      <p className="mb-8 text-muted-foreground">
        Completa tus datos y serás redirigido a ePayco para pagar de forma segura con tarjeta, PSE, Nequi o Daviplata.
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <CheckoutForm items={items} total={total} />
    </div>
  )
}
