import { prisma } from "@/lib/db"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PrivacyPage() {
  const config = await prisma.storeConfiguration.findFirst({
    select: { storeName: true, privacyText: true },
  })

  const storeName = config?.storeName ?? "Container"
  const content = config?.privacyText

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Política de Privacidad</h1>

      {content ? (
        <div className="prose prose-gray mt-8 max-w-none whitespace-pre-line text-sm leading-relaxed text-gray-600">
          {content}
        </div>
      ) : (
        <div className="mt-8 space-y-4 text-sm text-gray-500">
          <p>
            En {storeName} nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos,
            usamos y protegemos tu información personal.
          </p>
          <h2 className="text-lg font-semibold text-gray-900">Información que recopilamos</h2>
          <p>
            Recopilamos la información que nos proporcionas al realizar un pedido: nombre, número de teléfono,
            dirección de correo electrónico y dirección de envío. No almacenamos información de tarjetas de crédito.
          </p>
          <h2 className="text-lg font-semibold text-gray-900">Uso de la información</h2>
          <p>
            Usamos tu información únicamente para procesar pedidos, comunicarnos contigo sobre tu compra y
            mejorar nuestros servicios. No compartimos tu información con terceros.
          </p>
          <h2 className="text-lg font-semibold text-gray-900">Protección de datos</h2>
          <p>
            Implementamos medidas de seguridad para proteger tu información personal contra accesos no autorizados.
            Tus datos se almacenan de forma segura y solo son accesibles por personal autorizado.
          </p>
          <h2 className="text-lg font-semibold text-gray-900">Tus derechos</h2>
          <p>
            Puedes solicitar la eliminación o modificación de tus datos personales en cualquier momento
            contactándonos a través de nuestra página de contacto.
          </p>
        </div>
      )}

      <div className="mt-10 text-center text-sm text-muted-foreground">
        <Link href="/" className="text-blue-600 hover:underline">Volver a la tienda</Link>
      </div>
    </div>
  )
}
