import { z } from "zod"

export const createReviewSchema = z.object({
  productId: z.string().uuid("Producto inválido"),
  orderId: z.string().uuid("Pedido inválido"),
  customerName: z.string().min(2, "Nombre requerido").max(100),
  phone: z.string().regex(/^\+?[\d\s-]{7,15}$/, "Teléfono inválido"),
  rating: z.coerce.number().int().min(1, "Selecciona una calificación").max(5),
  title: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  content: z.string().min(10, "Mínimo 10 caracteres").max(2000, "Máximo 2000 caracteres"),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
