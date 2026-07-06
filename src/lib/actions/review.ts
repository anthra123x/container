"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createReviewSchema } from "@/lib/validations/review"
import { auth } from "@/lib/auth"

export async function createReview(formData: FormData) {
  const parsed = createReviewSchema.safeParse({
    productId: formData.get("productId"),
    orderId: formData.get("orderId"),
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    rating: formData.get("rating"),
    title: formData.get("title") || "",
    content: formData.get("content"),
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const errorMsg = Object.values(errors).flat().join(", ")
    return redirect(`/pedido/${formData.get("orderId")}?error=${encodeURIComponent(errorMsg)}`)
  }

  const data = parsed.data

  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    select: { status: true, customerPhone: true, storeId: true },
  })

  if (!order) {
    return redirect(`/pedido/${data.orderId}?error=Pedido+no+encontrado`)
  }

  if (order.status !== "DELIVERED") {
    return redirect(`/pedido/${data.orderId}?error=Solo+puedes+calificar+productos+de+pedidos+entregados`)
  }

  const phoneClean = data.phone.replace(/[^\d]/g, "")
  const orderPhoneClean = (order.customerPhone ?? "").replace(/[^\d]/g, "")
  if (!phoneClean || phoneClean !== orderPhoneClean) {
    return redirect(`/pedido/${data.orderId}?error=El+teléfono+no+coincide+con+el+pedido`)
  }

  const orderItem = await prisma.orderItem.findFirst({
    where: { orderId: data.orderId, productId: data.productId },
    select: { id: true },
  })

  if (!orderItem) {
    return redirect(`/pedido/${data.orderId}?error=Este+producto+no+está+en+tu+pedido`)
  }

  const existing = await prisma.review.findUnique({
    where: { productId_orderId: { productId: data.productId, orderId: data.orderId } },
    select: { id: true },
  })

  if (existing) {
    return redirect(`/pedido/${data.orderId}?error=Ya+calificaste+este+producto`)
  }

  await prisma.review.create({
    data: {
      productId: data.productId,
      orderId: data.orderId,
      customerName: data.customerName,
      phone: data.phone,
      rating: data.rating,
      title: data.title || null,
      content: data.content,
    },
  })

  revalidatePath(`/productos/${formData.get("productSlug") ?? data.productId}`)
  redirect(`/pedido/${data.orderId}?review=success`)
}

export async function getProductReviews(productId: string) {
  const [reviews, aggregate] = await Promise.all([
    prisma.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        rating: true,
        title: true,
        content: true,
        createdAt: true,
      },
      take: 50,
    }),
    prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: true,
    }),
  ])

  return {
    reviews,
    averageRating: aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : null,
    totalReviews: aggregate._count,
  }
}

export async function adminGetReviews() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { id: true, name: true, slug: true } },
      order: { select: { id: true } },
    },
    take: 100,
  })

  return reviews
}

export async function adminApproveReview(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const reviewId = formData.get("reviewId") as string
  if (!reviewId) return

  await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: true },
  })

  revalidatePath("/admin/resenas")
  revalidatePath("/productos")
}

export async function adminDeleteReview(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const reviewId = formData.get("reviewId") as string
  if (!reviewId) return

  await prisma.review.delete({ where: { id: reviewId } })

  revalidatePath("/admin/resenas")
  revalidatePath("/productos")
}

export async function getOrdersForReview(productId: string, phone: string) {
  const cleanPhone = phone.replace(/[^\d]/g, "")
  if (!cleanPhone || cleanPhone.length < 7) return []

  const orders = await prisma.order.findMany({
    where: {
      customerPhone: { contains: cleanPhone },
      status: "DELIVERED",
      items: { some: { productId } },
      reviews: { none: { productId } },
    },
    select: {
      id: true,
      customerName: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return orders
}
