import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function getFilteredProducts(params: {
  search?: string
  categorySlug?: string
  brandSlug?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  page?: number
  pageSize?: number
}) {
  const { search, categorySlug, minPrice, maxPrice, sort, page = 1, pageSize = 20 } = params

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  if (categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (category) {
      where.categoryId = category.id
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" }
    : sort === "price_desc" ? { price: "desc" }
    : sort === "name" ? { name: "asc" }
    : { createdAt: "desc" }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        brand: true,
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return { products, total, totalPages: Math.ceil(total / pageSize) }
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      galleries: {
        include: { images: { orderBy: { sortOrder: "asc" } } },
        orderBy: { sortOrder: "asc" },
      },
      category: true,
      brand: true,
      promotions: {
        include: { promotion: true },
        where: { promotion: { isActive: true, endsAt: { gte: new Date() } } },
      },
    },
  })
}
