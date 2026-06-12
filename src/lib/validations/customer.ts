import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(2, "Nombre requerido").max(100).optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
})

export type CustomerInput = z.infer<typeof customerSchema>
