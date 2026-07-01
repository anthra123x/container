import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyEpaycoSignature } from "@/lib/epayco"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const params: Record<string, string> = {}
    formData.forEach((value, key) => { params[key] = String(value) })

    const refPayco = params.x_ref_payco
    const invoiceId = params.x_id_factura
    const codResponse = params.x_cod_response
    const responseText = params.x_response
    const transactionId = params.x_transaction_id
    const paymentMethod = params.x_franchise || params.x_bank_name || "EPAYCO"

    if (!refPayco || !invoiceId) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 })
    }

    const signatureValid = verifyEpaycoSignature(params)
    if (!signatureValid) {
      console.warn("[ePayco] invalid signature for order:", invoiceId)
      return NextResponse.json({ error: "invalid signature" }, { status: 401 })
    }

    const order = await prisma.order.findUnique({ where: { id: invoiceId }, select: { id: true, status: true } })
    if (!order) {
      return NextResponse.json({ error: "order not found" }, { status: 404 })
    }

    const cod = parseInt(codResponse || "0")

    if (cod === 1) {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: invoiceId },
          data: {
            status: "CONFIRMED",
            paidAt: new Date(),
            epaycoRef: refPayco,
            paymentMethod,
          },
        })
        await tx.orderStatusHistory.create({
          data: {
            orderId: invoiceId,
            status: "CONFIRMED",
            note: `Pago confirmado vía ePayco. Ref: ${refPayco}, Transacción: ${transactionId}, Respuesta: ${responseText}`,
          },
        })
      })
      console.log(`[ePayco] payment confirmed for order ${invoiceId}, ref: ${refPayco}`)
    } else if (cod === 2 || cod === 4) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: invoiceId,
          status: order.status,
          note: `Pago rechazado vía ePayco. Código: ${cod}, Respuesta: ${responseText}, Ref: ${refPayco}`,
        },
      })
      console.log(`[ePayco] payment rejected for order ${invoiceId}, code: ${cod}`)
    } else if (cod === 3) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: invoiceId,
          status: order.status,
          note: `Pago pendiente vía ePayco. Ref: ${refPayco}, Respuesta: ${responseText}`,
        },
      })
      console.log(`[ePayco] payment pending for order ${invoiceId}, ref: ${refPayco}`)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[ePayco] webhook error:", err)
    return NextResponse.json({ error: "internal error" }, { status: 500 })
  }
}
