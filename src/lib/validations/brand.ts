import { z } from "zod"

export const brandSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  slug: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
})

export type BrandInput = z.infer<typeof brandSchema>
