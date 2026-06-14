"use server"

import { cookies } from "next/headers"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function addToCart(formData: FormData) {
  const productId = formData.get("productId") as string
  const quantity = parseInt(formData.get("quantity") as string) || 1

  if (!productId) return

  const cookieStore = await cookies()
  let sessionId = cookieStore.get("cart_session")?.value

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    cookieStore.set("cart_session", sessionId, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { storeId: true, stock: true },
  })

  if (!product || product.stock < 1) return

  let cart = await prisma.cart.findFirst({ where: { sessionId } })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { storeId: product.storeId, sessionId },
    })
  }

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: null },
  })

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    })
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    })
  }

  revalidatePath("/carrito")
}
