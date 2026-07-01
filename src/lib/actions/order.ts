"use server"

import { cookies } from "next/headers"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { checkoutSchema } from "@/lib/validations/order"
import { createEpaycoCheckout } from "@/lib/epayco"

export async function createOrder(formData: FormData) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("cart_session")?.value
  if (!sessionId) return redirect("/carrito?error=empty")

  const cart = await prisma.cart.findFirst({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true, price: true, stock: true, storeId: true } },
          variant: { select: { id: true, name: true, value: true, price: true, stock: true } },
        },
      },
    },
  })

  if (!cart || cart.items.length === 0) return redirect("/carrito?error=empty")

  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail") || "",
    customerPhone: formData.get("customerPhone"),
    shippingAddress: formData.get("shippingAddress") || "",
    shippingCity: formData.get("shippingCity") || "",
    shippingState: formData.get("shippingState") || "",
    shippingZip: formData.get("shippingZip") || "",
    notes: formData.get("notes") || "",
    source: "STORE",
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const errorMsg = Object.values(errors).flat().join(", ")
    return redirect(`/checkout?error=${encodeURIComponent(errorMsg)}`)
  }

  const data = parsed.data
  const subtotal = cart.items.reduce((sum, item) => {
    const unitPrice = item.variant?.price ? Number(item.variant.price) : Number(item.product.price)
    return sum + unitPrice * item.quantity
  }, 0)
  const total = subtotal

  for (const item of cart.items) {
    const maxStock = item.variant?.stock ?? item.product.stock
    if (maxStock < item.quantity) {
      return redirect(
        `/checkout?error=${encodeURIComponent(`Stock insuficiente para "${item.product.name}". Disponible: ${maxStock}`)}`
      )
    }
  }

  const existingCustomer = data.customerPhone
    ? await prisma.customer.findFirst({
        where: { storeId: cart.storeId, phone: data.customerPhone },
        select: { id: true, storeId: true },
      })
    : null

  const order = await prisma.$transaction(async (tx) => {
    let customerId: string

    if (existingCustomer) {
      await tx.customer.update({
        where: { id: existingCustomer.id },
        data: {
          name: data.customerName,
          email: data.customerEmail || null,
          totalOrders: { increment: 1 },
          totalSpent: { increment: total },
          lastPurchaseAt: new Date(),
        },
      })
      customerId = existingCustomer.id
    } else {
      const created = await tx.customer.create({
        data: {
          storeId: cart.storeId,
          name: data.customerName,
          email: data.customerEmail || null,
          phone: data.customerPhone,
          isRegistered: false,
        },
      })
      customerId = created.id
    }

    const created = await tx.order.create({
      data: {
        storeId: cart.storeId,
        customerId,
        customerName: data.customerName,
        customerEmail: data.customerEmail || null,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress || null,
        shippingCity: data.shippingCity || null,
        shippingState: data.shippingState || null,
        shippingZip: data.shippingZip || null,
        subtotal,
        total,
        status: "PENDING",
        source: "STORE",
        notes: data.notes || null,
        items: {
          create: cart.items.map((item) => {
            const unitPrice = item.variant?.price ? Number(item.variant.price) : Number(item.product.price)
            return {
              productId: item.product.id,
              productName: item.product.name,
              productSku: item.product.sku,
              variantName: item.variant?.name ?? null,
              quantity: item.quantity,
              unitPrice,
              subtotal: unitPrice * item.quantity,
            }
          }),
        },
        statusHistory: {
          create: {
            status: "PENDING",
            note: "Pedido creado desde la tienda",
          },
        },
      },
    })

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.product.id },
        data: { stock: { decrement: item.quantity } },
      })
      if (item.variant && item.variant.stock !== null) {
        await tx.productVariant.update({
          where: { id: item.variant.id },
          data: { stock: { decrement: item.quantity } },
        })
      }
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

    return created
  })

  cookieStore.delete("cart_session")
  revalidatePath("/carrito")

  const description = cart.items.map(i => i.product.name).join(", ").slice(0, 250)

  const epayco = await createEpaycoCheckout({
    orderId: order.id,
    total: Number(order.total),
    customerName: data.customerName,
    customerEmail: data.customerEmail || "",
    customerPhone: data.customerPhone || "",
    description,
  })

  if (epayco.ok && epayco.redirectUrl) {
    if (epayco.epaycoRef) {
      await prisma.order.update({
        where: { id: order.id },
        data: { epaycoRef: epayco.epaycoRef },
      })
    }
    redirect(epayco.redirectUrl)
  }

  redirect(`/pedido/${order.id}`)
}
