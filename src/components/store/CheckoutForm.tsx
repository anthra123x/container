"use client"

import { useState, useTransition } from "react"
import { createOrder } from "@/lib/actions/order"
import { checkoutSchema } from "@/lib/validations/order"
import { formatCurrency } from "@/lib/utils/formatters"
import { ArrowLeft, ArrowRight, Check, CreditCard, MapPin, User } from "lucide-react"

interface CartItemDisplay {
  id: string
  quantity: number
  product: {
    name: string
    slug: string
    price: number
    images: { url: string }[]
  }
  variant?: { name: string; price?: number | null } | null
}

interface CheckoutFormProps {
  items: CartItemDisplay[]
  total: number
}

const steps = [
  { id: 1, label: "Datos personales", icon: User },
  { id: 2, label: "Dirección", icon: MapPin },
  { id: 3, label: "Confirmar", icon: CreditCard },
]

interface FieldErrors {
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  shippingAddress?: string
  shippingCity?: string
}

export function CheckoutForm({ items, total }: CheckoutFormProps) {
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    notes: "",
  })

  function validateStep(stepNum: number): boolean {
    const stepFields: Record<number, Partial<Record<keyof FieldErrors, boolean>>> = {
      1: { customerName: true, customerPhone: true, customerEmail: false },
      2: { shippingAddress: true, shippingCity: true },
      3: {},
    }

    const fields = stepFields[stepNum]
    if (!fields) return true

    const partial: Record<string, string> = {}
    for (const key of Object.keys(fields)) {
      partial[key] = (formData as any)[key] || ""
    }

    const result = checkoutSchema.safeParse(partial)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as FieldErrors
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function nextStep() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3))
    }
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1))
    setErrors({})
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const allData = {
      ...formData,
      customerName: formData.customerName || "",
      customerPhone: formData.customerPhone || "",
      shippingAddress: formData.shippingAddress || "",
      shippingCity: formData.shippingCity || "",
    }

    const result = checkoutSchema.safeParse(allData)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as FieldErrors)
      return
    }

    startTransition(async () => {
      const fd = new FormData()
      fd.set("customerName", formData.customerName)
      fd.set("customerPhone", formData.customerPhone)
      fd.set("customerEmail", formData.customerEmail)
      fd.set("shippingAddress", formData.shippingAddress)
      fd.set("shippingCity", formData.shippingCity)
      fd.set("shippingState", formData.shippingState)
      fd.set("shippingZip", formData.shippingZip)
      fd.set("notes", formData.notes)

      await createOrder(fd)
    })
  }

  function inputClass(field: keyof FieldErrors) {
    return `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? "border-red-300 bg-red-50 focus:ring-red-500" : ""
    }`
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                      step > s.id
                        ? "bg-blue-600 text-white"
                        : step === s.id
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={`mt-1.5 text-xs font-medium ${
                      step >= s.id ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {s.id < 3 && (
                  <div
                    className={`mx-4 h-0.5 w-12 transition-colors duration-300 sm:w-20 ${
                      step > s.id ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="rounded-xl border bg-white p-6 ring-1 ring-foreground/5">
                <h2 className="mb-4 text-lg font-semibold">Tus datos</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={(e) => updateField("customerName", e.target.value)}
                      className={inputClass("customerName")}
                      placeholder="Ej: Juan Pérez"
                      autoFocus
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-red-600">{errors.customerName}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="customerPhone"
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => updateField("customerPhone", e.target.value)}
                        className={inputClass("customerPhone")}
                        placeholder="+57 300 123 4567"
                      />
                      <p className="mt-1 text-xs text-gray-400">Te contactaremos por WhatsApp</p>
                      {errors.customerPhone && (
                        <p className="mt-1 text-xs text-red-600">{errors.customerPhone}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => updateField("customerEmail", e.target.value)}
                        className={inputClass("customerEmail")}
                        placeholder="correo@ejemplo.com"
                      />
                      {errors.customerEmail && (
                        <p className="mt-1 text-xs text-red-600">{errors.customerEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="rounded-xl border bg-white p-6 ring-1 ring-foreground/5">
                <h2 className="mb-4 text-lg font-semibold">Dirección de envío</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="shippingAddress"
                      required
                      value={formData.shippingAddress}
                      onChange={(e) => updateField("shippingAddress", e.target.value)}
                      className={inputClass("shippingAddress")}
                      placeholder="Cra 1 #2-3, Barrio Centro"
                      autoFocus
                    />
                    {errors.shippingAddress && (
                      <p className="mt-1 text-xs text-red-600">{errors.shippingAddress}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Ciudad <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="shippingCity"
                        required
                        value={formData.shippingCity}
                        onChange={(e) => updateField("shippingCity", e.target.value)}
                        className={inputClass("shippingCity")}
                        placeholder="El Banco"
                      />
                      {errors.shippingCity && (
                        <p className="mt-1 text-xs text-red-600">{errors.shippingCity}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Departamento
                      </label>
                      <input
                        name="shippingState"
                        value={formData.shippingState}
                        onChange={(e) => updateField("shippingState", e.target.value)}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                        placeholder="Magdalena"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Código postal
                      </label>
                      <input
                        name="shippingZip"
                        value={formData.shippingZip}
                        onChange={(e) => updateField("shippingZip", e.target.value)}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border bg-white p-6 ring-1 ring-foreground/5">
                <h2 className="mb-4 text-lg font-semibold">Notas del pedido</h2>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500"
                  placeholder="¿Alguna indicación especial? (opcional)"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="rounded-xl border bg-white p-6 ring-1 ring-foreground/5">
                <h2 className="mb-4 text-lg font-semibold">Confirma tus datos</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-muted-foreground">Nombre</span>
                    <span className="font-medium text-gray-900">{formData.customerName}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-muted-foreground">Teléfono</span>
                    <span className="font-medium text-gray-900">{formData.customerPhone}</span>
                  </div>
                  {formData.customerEmail && (
                    <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium text-gray-900">{formData.customerEmail}</span>
                    </div>
                  )}
                  <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-muted-foreground">Dirección</span>
                    <span className="font-medium text-gray-900">
                      {formData.shippingAddress}, {formData.shippingCity}
                      {formData.shippingState ? `, ${formData.shippingState}` : ""}
                    </span>
                  </div>
                  {formData.notes && (
                    <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-muted-foreground">Notas</span>
                      <span className="font-medium text-gray-900">{formData.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center gap-2 rounded-xl border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 active:scale-[0.98]"
              >
                <ArrowLeft className="h-4 w-4" />
                Atrás
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Ir a pagar
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-6 rounded-xl border bg-white p-6 ring-1 ring-foreground/5">
          <h2 className="mb-4 text-lg font-semibold">Resumen del pedido</h2>

          <div className="divide-y">
            {items.map((item) => {
              const unitPrice = item.variant?.price ? Number(item.variant.price) : Number(item.product.price)
              return (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{item.product.name}</p>
                    {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                    <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">{formatCurrency(unitPrice * item.quantity)}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-4 text-base font-semibold">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>

          <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
            <p className="font-medium">Pago seguro con ePayco</p>
            <p className="mt-1">
              Al confirmar serás redirigido a ePayco para pagar con tarjeta, PSE, Nequi o Daviplata.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
