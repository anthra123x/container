import { z } from "zod"

export const storeConfigSchema = z.object({
  storeName: z.string().min(2, "Nombre requerido").max(100),
  storeDescription: z.string().optional(),
  whatsappNumber: z.string().optional(),
  whatsappMessage: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  aboutText: z.string().optional(),
  termsText: z.string().optional(),
  privacyText: z.string().optional(),
  shippingInfo: z.string().optional(),
  paymentInfo: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
})

export type StoreConfigInput = z.infer<typeof storeConfigSchema>
