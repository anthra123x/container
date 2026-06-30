import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters"
import { SaveCartPhone } from "@/components/store/save-cart-phone"
import { CheckCircle, MessageCircle, Package, ShoppingBag } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params

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

  const whatsappMessage = encodeURIComponent(
    `Hola, acabo de hacer el pedido ${orderTag} por ${formatCurrency(order.total)}. ` +
    `Ya realicé la transferencia. Mi nombre es ${order.customerName ?? ""}. Quedo atento a la confirmación.`
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <SaveCartPhone phone={order.customerPhone ?? ""} />
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">¡Pedido confirmado!</h1>
        <p className="mt-2 text-muted-foreground">
          Hemos recibido tu pedido {orderTag}. Te contactaremos por WhatsApp para coordinar el pago y la entrega.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
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

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Instrucciones de pago</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Tu pedido está <span className="font-medium text-yellow-700">pendiente</span>.
              Te contactaremos por WhatsApp para coordinar el pago.
            </p>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">Métodos de pago disponibles:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li><strong>Nequi</strong> — transferencia desde la app</li>
                <li><strong>Daviplata</strong> — transferencia desde la app</li>
                <li><strong>Efectivo</strong> — contraentrega (pregunta disponibilidad en tu ciudad)</li>
              </ul>
            </div>
            {storeConfig?.paymentInfo && (
              <p className="text-xs text-gray-400">{storeConfig.paymentInfo}</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">¿Ya realizaste el pago?</h2>
          <p className="mb-4 text-sm text-gray-600">
            Si ya hiciste la transferencia, contáctanos por WhatsApp para confirmar tu pedido.
          </p>
          <a
            href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-green-700"
          >
            <MessageCircle className="h-5 w-5" />
            Confirmar pago por WhatsApp
          </a>
        </div>
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
