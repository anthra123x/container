import { RotateCcw } from "lucide-react"

export default function DevolucionesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-blue-50 p-3">
          <RotateCcw className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold">Devoluciones</h1>
      </div>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Política de devolución</h2>
          <p>Tienes hasta 7 días calendario desde la recepción del producto para solicitar una devolución o cambio, siempre que el producto se encuentre en su empaque original y sin señales de uso.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Requisitos</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Producto en empaque original completo</li>
            <li>Boleta o factura de compra</li>
            <li>Producto sin señales de uso o daño</li>
            <li>Solicitud dentro de los 7 días posteriores a la entrega</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Proceso</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Contáctanos vía WhatsApp o email para generar el número de devolución</li>
            <li>Empaca el producto con todos sus accesorios y empaque original</li>
            <li>Coordinamos el recojo sin costo para ti</li>
            <li>Recibimos y revisamos el producto (1-2 días hábiles)</li>
            <li>Procedemos con el reembolso o cambio</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Reembolsos</h2>
          <p>Los reembolsos se procesan en un plazo de 5-7 días hábiles y se realizan a través del mismo método de pago utilizado en la compra.</p>
        </section>
      </div>
    </div>
  )
}
