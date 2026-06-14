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
    const newQty = Math.min(existing.quantity + quantity, product.stock)
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    })
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity: Math.min(quantity, product.stock) },
    })
  }

  revalidatePath("/carrito")
}

export async function removeFromCart(formData: FormData) {
  const itemId = formData.get("itemId") as string
  if (!itemId) return

  const cookieStore = await cookies()
  const sessionId = cookieStore.get("cart_session")?.value
  if (!sessionId) return

  const cart = await prisma.cart.findFirst({ where: { sessionId } })
  if (!cart) return

  await prisma.cartItem.deleteMany({
    where: { id: itemId, cartId: cart.id },
  })

  revalidatePath("/carrito")
}

export async function updateCartQuantity(formData: FormData) {
  const itemId = formData.get("itemId") as string
  const quantity = parseInt(formData.get("quantity") as string) || 1

  if (!itemId || quantity < 1) return

  const cookieStore = await cookies()
  const sessionId = cookieStore.get("cart_session")?.value
  if (!sessionId) return

  const cart = await prisma.cart.findFirst({ where: { sessionId } })
  if (!cart) return

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
    include: { product: { select: { stock: true } } },
  })
  if (!item) return

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: Math.min(quantity, item.product.stock) },
  })

  revalidatePath("/carrito")
}
