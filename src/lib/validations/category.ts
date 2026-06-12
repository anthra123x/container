import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
})

export type CategoryInput = z.infer<typeof categorySchema>
