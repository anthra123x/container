import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils/formatters"
import { SaveCartPhone } from "@/components/store/save-cart-phone"
import { CheckCircle, CreditCard, MessageCircle, Package, ShoppingBag, XCircle } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ payment?: string }>
}

export default async function OrderConfirmationPage({ params, searchParams }: Props) {
  const { id } = await params
  const { payment } = await searchParams

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
    },
  })

  if (!order) notFound()

  const storeConfig = await prisma.storeConfiguration.findFirst({
    where: { storeId: order.storeId },
    select: { whatsappNumber: true, storeName: true, paymentInfo: true },
  })

  const whatsappNumber = storeConfig?.whatsappNumber ?? "573000000000"
  const cleanPhone = whatsappNumber.replace(/[^\d]/g, "")
  const orderTag = `#${order.id.slice(0, 8)}`

  const paymentSuccess = payment === "success"
  const paymentFailed = payment === "failed" || payment === "error"
  const isPaid = order.status !== "PENDING" && order.status !== "CANCELLED"

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <SaveCartPhone phone={order.customerPhone ?? ""} />
      <div className="text-center">
        {paymentSuccess ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">¡Pago exitoso!</h1>
            <p className="mt-2 text-muted-foreground">
              Hemos recibido tu pago. Procesaremos tu pedido {orderTag} pronto.
            </p>
          </>
        ) : paymentFailed ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold">Pago no completado</h1>
            <p className="mt-2 text-muted-foreground">
              El pago no pudo completarse. Tu pedido {orderTag} está guardado. Puedes intentar de nuevo.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">¡Pedido creado!</h1>
            <p className="mt-2 text-muted-foreground">
              Hemos recibido tu pedido {orderTag}. Te contactaremos para coordinar la entrega.
            </p>
          </>
        )}
      </div>

      <div className="mt-10 space-y-6">
        <div className="rounded-xl border bg-white p-6 ring-1 ring-foreground/5">
          <h2 className="mb-4 text-lg font-semibold">Resumen del pedido</h2>

          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-200">
                      <Package className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                  {item.variantName && (
                    <p className="text-xs text-gray-500">{item.variantName}</p>
                  )}
                  <p className="text-xs text-gray-500">Qty: {item.quantity} x {formatCurrency(item.unitPrice)}</p>
                </div>
                <p className="text-sm font-medium">{formatCurrency(item.subtotal)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-4 text-base font-semibold">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {paymentSuccess ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 ring-1 ring-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <CreditCard className="h-5 w-5" />
              <h2 className="font-semibold">Pago confirmado</h2>
            </div>
            <p className="mt-2 text-sm text-green-700">
              Gracias por tu compra. Procesaremos tu pedido y te notificaremos cuando esté en camino.
            </p>
          </div>
        ) : paymentFailed ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 ring-1 ring-red-200">
            <h2 className="font-semibold text-red-800">Intenta de nuevo</h2>
            <p className="mt-2 text-sm text-red-700">
              El pago fue rechazado. Puedes contactarnos por WhatsApp para coordinar otro método de pago.
            </p>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-green-600 bg-green-50 px-5 py-2.5 text-sm font-medium text-green-700 transition-all hover:bg-green-100"
            >
              <MessageCircle className="h-4 w-4" />
              Contactar por WhatsApp
            </a>
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-6 ring-1 ring-foreground/5">
            <h2 className="mb-3 text-lg font-semibold">Estado del pedido</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Tu pedido está <span className="font-medium text-yellow-700">pendiente</span>.
                Te notificaremos cuando haya actualizaciones.
              </p>
              {order.epaycoRef && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="font-medium text-gray-900">Referencia ePayco:</p>
                  <p className="mt-1 text-xs text-gray-500">{order.epaycoRef}</p>
                </div>
              )}
              {storeConfig?.paymentInfo && (
                <p className="text-xs text-gray-400">{storeConfig.paymentInfo}</p>
              )}
            </div>
          </div>
        )}

        {!isPaid && (
          <div className="rounded-xl border bg-white p-6 ring-1 ring-foreground/5">
            <h2 className="mb-3 text-lg font-semibold">¿Necesitas ayuda?</h2>
            <p className="mb-4 text-sm text-gray-600">
              Si tienes dudas sobre tu pedido, contáctanos por WhatsApp.
            </p>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white ring-1 ring-green-700 transition-all hover:bg-green-700 active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              Contactar por WhatsApp
            </a>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ShoppingBag className="h-4 w-4" />
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
