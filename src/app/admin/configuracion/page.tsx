import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { getRoleLevel } from "@/lib/validations/user"

export const dynamic = "force-dynamic"

export default async function AdminConfigPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const isSuperAdmin = getRoleLevel(session.user.role as string) >= 3

  const config = await prisma.storeConfiguration.findFirst({
    where: { storeId: session.user.storeId as string },
  })

  async function updateConfig(formData: FormData) {
    "use server"
    const currentSession = await auth()
    if (!currentSession?.user) redirect("/login")

    const storeId = currentSession.user.storeId as string

    const data = {
      storeName: formData.get("storeName") as string,
      storeDescription: (formData.get("storeDescription") as string) || null,
      whatsappNumber: (formData.get("whatsappNumber") as string) || null,
      whatsappMessage: (formData.get("whatsappMessage") as string) || null,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      address: (formData.get("address") as string) || null,
      aboutText: (formData.get("aboutText") as string) || null,
      termsText: (formData.get("termsText") as string) || null,
      privacyText: (formData.get("privacyText") as string) || null,
      shippingInfo: (formData.get("shippingInfo") as string) || null,
      paymentInfo: (formData.get("paymentInfo") as string) || null,
      metaTitle: (formData.get("metaTitle") as string) || null,
      metaDescription: (formData.get("metaDescription") as string) || null,
    }

    await prisma.storeConfiguration.upsert({
      where: { storeId },
      update: data,
      create: { storeId, ...data },
    })

    redirect("/admin/configuracion")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">Personaliza la información de tu tienda</p>
      </div>

      <form action={updateConfig} className="max-w-2xl space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Información general</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nombre de la tienda</label>
              <input
                name="storeName"
                defaultValue={config?.storeName ?? ""}
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Descripción</label>
              <textarea
                name="storeDescription"
                rows={3}
                defaultValue={config?.storeDescription ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Contacto</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Número de WhatsApp</label>
              <input
                name="whatsappNumber"
                defaultValue={config?.whatsappNumber ?? ""}
                placeholder="+573001234567"
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-muted-foreground">Con código de país, sin espacios</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Mensaje predeterminado de WhatsApp</label>
              <textarea
                name="whatsappMessage"
                rows={2}
                defaultValue={config?.whatsappMessage ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={config?.email ?? ""}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Teléfono</label>
                <input
                  name="phone"
                  defaultValue={config?.phone ?? ""}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Dirección</label>
              <input
                name="address"
                defaultValue={config?.address ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Meta título <span className="text-muted-foreground font-normal">(70 caracteres máx)</span>
              </label>
              <input
                name="metaTitle"
                maxLength={70}
                defaultValue={config?.metaTitle ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Meta descripción <span className="text-muted-foreground font-normal">(160 caracteres máx)</span>
              </label>
              <textarea
                name="metaDescription"
                rows={2}
                maxLength={160}
                defaultValue={config?.metaDescription ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Información legal</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Sobre nosotros</label>
              <textarea
                name="aboutText"
                rows={4}
                defaultValue={config?.aboutText ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Términos y condiciones</label>
              <textarea
                name="termsText"
                rows={4}
                defaultValue={config?.termsText ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Política de privacidad</label>
              <textarea
                name="privacyText"
                rows={4}
                defaultValue={config?.privacyText ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Información de envío y pago</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Info de envío</label>
              <textarea
                name="shippingInfo"
                rows={3}
                defaultValue={config?.shippingInfo ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Info de pago</label>
              <textarea
                name="paymentInfo"
                rows={3}
                defaultValue={config?.paymentInfo ?? ""}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Guardar configuración
          </button>
        </div>
      </form>
    </div>
  )
}
