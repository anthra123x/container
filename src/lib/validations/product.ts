import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(200),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(300).optional(),
  categoryId: z.string().uuid("Categoría inválida"),
  brandId: z.string().uuid().optional().or(z.literal("")),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.coerce.number().positive("Precio debe ser mayor a 0"),
  comparePrice: z.coerce.number().optional().or(z.literal(0)),
  costPrice: z.coerce.number().optional().or(z.literal(0)),
  stock: z.coerce.number().int().min(0).default(0),
  minStock: z.coerce.number().int().min(0).default(5),
  weight: z.coerce.number().optional().or(z.literal(0)),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
})

export type ProductInput = z.infer<typeof productSchema>
