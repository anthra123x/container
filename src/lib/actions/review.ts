"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createReviewSchema } from "@/lib/validations/review"
import { requireAdminRole } from "@/lib/auth-helpers"

export async function createReview(formData: FormData) {
  const parsed = createReviewSchema.safeParse({
    productId: formData.get("productId"),
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    rating: formData.get("rating"),
    title: formData.get("title") || "",
    content: formData.get("content"),
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const errorMsg = Object.values(errors).flat().join(", ")
    const productSlug = formData.get("productSlug") as string
    return redirect(`/productos/${productSlug}?error=${encodeURIComponent(errorMsg)}`)
  }

  const data = parsed.data

  const existing = await prisma.review.findUnique({
    where: { productId_phone: { productId: data.productId, phone: data.phone } },
    select: { id: true },
  })

  if (existing) {
    return redirect(`/productos/${formData.get("productSlug")}?error=Ya+calificaste+este+producto`)
  }

  await prisma.review.create({
    data: {
      productId: data.productId,
      customerName: data.customerName,
      phone: data.phone,
      rating: data.rating,
      title: data.title || null,
      content: data.content,
    },
  })

  revalidatePath(`/productos/${formData.get("productSlug")}`)
  redirect(`/productos/${formData.get("productSlug")}?review=success`)
}

export async function adminApproveReview(formData: FormData) {
  await requireAdminRole(2)
  const reviewId = formData.get("reviewId") as string
  if (!reviewId) return
  await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: true },
  })
  revalidatePath("/admin/resenas")
}

export async function adminDeleteReview(formData: FormData) {
  await requireAdminRole(2)
  const reviewId = formData.get("reviewId") as string
  if (!reviewId) return
  await prisma.review.delete({ where: { id: reviewId } })
  revalidatePath("/admin/resenas")
}
