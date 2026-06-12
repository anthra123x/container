import { z } from "zod"
import { OrderSource } from "@prisma/client"

const phoneRegex = /^\+?[\d\s-]{7,15}$/

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Nombre requerido").max(100),
  customerEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  customerPhone: z.string().regex(phoneRegex, "Teléfono inválido"),
  shippingAddress: z.string().min(5, "Dirección requerida").optional().or(z.literal("")),
  shippingCity: z.string().min(2, "Ciudad requerida").optional().or(z.literal("")),
  shippingState: z.string().optional().or(z.literal("")),
  shippingZip: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
  source: z.nativeEnum(OrderSource).default("STORE"),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
