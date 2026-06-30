import { prisma } from "@/lib/db"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function TermsPage() {
  const config = await prisma.storeConfiguration.findFirst({
    select: { storeName: true, termsText: true },
  })

  const storeName = config?.storeName ?? "Container"
  const content = config?.termsText

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Términos y Condiciones</h1>

      {content ? (
        <div className="prose prose-gray mt-8 max-w-none whitespace-pre-line text-sm leading-relaxed text-gray-600">
          {content}
        </div>
      ) : (
        <div className="mt-8 space-y-4 text-sm text-gray-500">
          <p>
            Esta tienda es operada por {storeName}. Al usar este sitio web, aceptas los siguientes términos y condiciones.
          </p>
          <h2 className="text-lg font-semibold text-gray-900">Uso del sitio</h2>
          <p>
            Todos los precios y promociones están sujetos a cambios sin previo aviso. Nos reservamos el derecho
            de rechazar o cancelar pedidos por cualquier motivo.
          </p>
          <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
          <p>
            Hacemos nuestro mejor esfuerzo por mostrar los productos con la mayor precisión posible. Sin embargo,
            no garantizamos que los colores, tamaños o descripciones sean 100% exactos.
          </p>
          <h2 className="text-lg font-semibold text-gray-900">Precios</h2>
          <p>
            Todos los precios están expresados en pesos colombianos (COP) e incluyen el IVA cuando aplica.
            Los precios de envío se calculan al momento de realizar el pedido.
          </p>
        </div>
      )}

      <div className="mt-10 text-center text-sm text-muted-foreground">
        <Link href="/" className="text-blue-600 hover:underline">Volver a la tienda</Link>
      </div>
    </div>
  )
}
