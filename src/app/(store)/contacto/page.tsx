import { prisma } from "@/lib/db"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export default async function ContactoPage() {
  const config = await prisma.storeConfiguration.findFirst({
    select: {
      whatsappNumber: true,
      storeName: true,
      email: true,
      phone: true,
      address: true,
    },
  })

  const whatsappNumber = config?.whatsappNumber?.replace(/[^\d]/g, "") ?? "573000000000"
  const email = config?.email ?? "ventas@container.co"
  const phone = config?.phone ?? "+57 300 000 0000"
  const address = config?.address ?? "El Banco, Magdalena, Colombia"

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-center text-3xl font-bold">Contacto</h1>
      <p className="mt-4 text-center text-muted-foreground">
        Estamos para ayudarte. Escríbenos por WhatsApp o visítanos.
      </p>

      <div className="mt-10 space-y-6">
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex w-full items-center justify-center gap-2 py-4 text-base"
        >
          <MessageCircle className="h-5 w-5" />
          Escríbenos por WhatsApp
        </a>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Información de contacto</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Email:</span>
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Teléfono:</span>
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Dirección:</span>
              <span>{address}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="text-blue-600 hover:underline">Volver a la tienda</Link>
        </div>
      </div>
    </div>
  )
}
