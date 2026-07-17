import type { Product, ProductImage, Category, Brand } from "@prisma/client"

export type ProductWithRelations = Product & {
  images: ProductImage[]
  category: Category
  brand: Brand | null
}
