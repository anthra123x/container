import type { Product, ProductImage, Category, Brand, Promotion } from "@prisma/client"

export type ProductWithRelations = Product & {
  images: ProductImage[]
  category: Category
  brand: Brand | null
  promotions?: (Promotion & {
    promotion: Promotion
  })[]
}

export type CartItem = {
  id: string
  productId: string
  variantId?: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  variantName?: string
  maxStock: number
}

export type CartState = {
  items: CartItem[]
  totalItems: number
  subtotal: number
}

export type DashboardMetrics = {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  monthlySales: { month: string; total: number }[]
  topProducts: { name: string; total: number; quantity: number }[]
  ordersByStatus: { status: string; count: number }[]
  recentOrders: number
  lowStockProducts: number
}

export type ReportFilters = {
  startDate?: string
  endDate?: string
  period?: "daily" | "weekly" | "monthly"
}

export type SelectOption = {
  label: string
  value: string
}
