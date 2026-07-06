import { createHash } from "crypto"

const EPAYCO_API = "https://api.secure.payco.co/v1/checkout"

interface EpaycoCheckoutParams {
  orderId: string
  total: number
  customerName: string
  customerEmail: string
  customerPhone: string
  description: string
}

interface EpaycoCheckoutResponse {
  success: boolean
  data?: {
    url: string
    ref: string
  }
  message?: string
}

export async function createEpaycoCheckout(params: EpaycoCheckoutParams): Promise<{
  ok: boolean
  redirectUrl?: string
  epaycoRef?: string
  error?: string
}> {
  const publicKey = process.env.EPAYCO_PUBLIC_KEY
  const privateKey = process.env.EPAYCO_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    return { ok: false, error: "ePayco no configurado" }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  try {
    const body: Record<string, string> = {
      public_key: publicKey,
      amount: String(Math.round(Number(params.total))),
      currency: "COP",
      invoice: params.orderId,
      description: params.description.slice(0, 250),
      tax: "0",
      tax_base: "0",
      country: "CO",
      test: process.env.EPAYCO_TEST === "true" ? "true" : "false",
      name: params.customerName,
      email: params.customerEmail || "cliente@containerstore.com",
      phone: params.customerPhone || "573000000000",
      url_response: `${baseUrl}/pedido/${params.orderId}`,
      url_confirmation: `${baseUrl}/api/epayco/confirm`,
      method: "0",
    }

    const res = await fetch(EPAYCO_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": privateKey,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "unknown error")
      console.error("[ePayco] API error:", res.status, text)
      return { ok: false, error: `ePayco: ${res.status}` }
    }

    const json: EpaycoCheckoutResponse = await res.json()

    if (!json.success || !json.data?.url) {
      return { ok: false, error: json.message ?? "ePayco: respuesta inválida" }
    }

    return {
      ok: true,
      redirectUrl: json.data.url,
      epaycoRef: json.data.ref,
    }
  } catch (err) {
    console.error("[ePayco] fetch error:", err)
    return { ok: false, error: "Error conectando con ePayco" }
  }
}

export function verifyEpaycoSignature(params: Record<string, string>): boolean {
  const privateKey = process.env.EPAYCO_PRIVATE_KEY
  if (!privateKey) return false

  const payload = [
    privateKey,
    params.x_ref_payco || "",
    params.x_id_factura || "",
    params.x_amount || "",
    params.x_currency || "",
  ].join("~")

  const hash = createHash("sha256").update(payload).digest("hex")

  return hash === params.x_signature
}
