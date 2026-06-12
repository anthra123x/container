import { Truck } from "lucide-react"

export default function EnvioPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-blue-50 p-3">
          <Truck className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold">Envíos</h1>
      </div>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Cobertura</h2>
          <p>Realizamos envíos a todo el Perú. Lima Metropolitana recibe en 24-48 horas hábiles, provincias en 3-7 días hábiles.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Costos de envío</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Lima Metropolitana: S/ 9.90</li>
            <li>Provincias: S/ 19.90</li>
            <li>Envío gratis en compras mayores a S/ 299</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Seguimiento</h2>
          <p>Una vez despachado tu pedido, recibirás un número de seguimiento por correo electrónico y WhatsApp para que puedas tracking tu paquete en tiempo real.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Horarios de despacho</h2>
          <p>Los pedidos realizados antes de las 2:00 PM se despachan el mismo día hábil. Después de esa hora, se despachan al día siguiente hábil.</p>
        </section>
      </div>
    </div>
  )
}
