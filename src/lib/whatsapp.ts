const API_VERSION = process.env.WHATSAPP_API_VERSION ?? "v22.0"
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID ?? ""
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN ?? ""
const STORE_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Container"

interface SendMessageResult {
  sent: boolean
  method: "api" | "link"
  waLink?: string
  error?: string
}

export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<SendMessageResult> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    return { sent: false, method: "link", waLink: getWhatsappLink(to, body) }
  }

  const cleanPhone = to.replace(/[^\d]/g, "")
  if (!cleanPhone) return { sent: false, method: "link", error: "invalid phone" }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: cleanPhone,
          type: "text",
          text: { body },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text().catch(() => "unknown")
      console.error("[WhatsApp] API error:", res.status, err)
      return { sent: false, method: "link", waLink: getWhatsappLink(to, body), error: err }
    }

    return { sent: true, method: "api" }
  } catch (err) {
    console.error("[WhatsApp] send error:", err)
    return { sent: false, method: "link", waLink: getWhatsappLink(to, body), error: String(err) }
  }
}

export function getWhatsappLink(phone: string, text: string): string {
  const clean = phone.replace(/[^\d]/g, "")
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`
}

const STATUS_MESSAGES: Record<string, string> = {
  CONFIRMED:
    "¡Hola {name}! Tu pedido #{orderId} por {total} ha sido CONFIRMAREDO ✅. " +
    "Estamos preparando todo para enviarlo. Te notificaremos cuando esté en camino.",
  PROCESSING:
    "¡Hola {name}! Tu pedido #{orderId} ya está siendo PREPARADO 📦. " +
    "Pronto lo despacharemos a {city}.",
  SHIPPED:
    "¡Hola {name}! Buenas noticias 🚚 - tu pedido #{orderId} ya está en CAMINO a {city}. " +
    "Estará contigo pronto. Gracias por comprar en {store}!",
  DELIVERED:
    "¡Hola {name}! Tu pedido #{orderId} ha sido ENTREGADO ✅. " +
    "Esperamos que disfrutes tu compra. Si tienes alguna novedad, escríbenos. Gracias por elegir {store}!",
  CANCELLED:
    "Hola {name}, lamentamos informarte que tu pedido #{orderId} ha sido CANCELADO ❌. " +
    "Si tienes dudas, contáctanos.",
  REFUNDED:
    "Hola {name}, te informamos que el reembolso de tu pedido #{orderId} ha sido procesado 💰. " +
    "El dinero será devuelto a tu método de pago en los próximos días.",
}

export function buildOrderMessage(
  order: {
    id: string
    totalFormatted: string
    customerName: string | null
    shippingCity: string | null
  },
  newStatus: string
): string {
  const template = STATUS_MESSAGES[newStatus]
  if (!template) return ""

  return template
    .replace(/{name}/g, order.customerName ?? "cliente")
    .replace(/{orderId}/g, order.id.slice(0, 8))
    .replace(/{total}/g, order.totalFormatted)
    .replace(/{city}/g, order.shippingCity ?? "tu dirección")
    .replace(/{store}/g, STORE_NAME)
}
