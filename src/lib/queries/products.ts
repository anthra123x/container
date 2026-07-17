import { prisma } from "@/lib/db"
import type { Prisma } from "@prisma/client"

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
  const { search, categorySlug, brandSlug, minPrice, maxPrice, sort, page = 1, pageSize = 20 } = params

  const where: Prisma.ProductWhereInput = { isActive: true }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  if (categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (category) where.categoryId = category.id
  }

  if (brandSlug) {
    const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } })
    if (brand) where.brandId = brand.id
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
    },
  })
}

export async function getCatalogFacets() {
  const baseWhere: Prisma.ProductWhereInput = { isActive: true }

  const [categories, brands, priceAgg] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.aggregate({
      where: baseWhere,
      _min: { price: true },
      _max: { price: true },
    }),
  ])

  return {
    categories: categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      count: c._count.products,
    })),
    brands: brands.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      count: b._count.products,
    })),
    priceRange: {
      min: Number(priceAgg._min.price ?? 0),
      max: Number(priceAgg._max.price ?? 1000000),
    },
  }
}
