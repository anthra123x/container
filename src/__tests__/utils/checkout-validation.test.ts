import { describe, it, expect } from "vitest"
import { checkoutSchema } from "@/lib/validations/order"

describe("checkoutSchema", () => {
  const validData = {
    customerName: "Juan Pérez",
    customerPhone: "+57 300 123 4567",
    customerEmail: "juan@example.com",
    shippingAddress: "Cra 1 #2-3, Centro",
    shippingCity: "El Banco",
    shippingState: "Magdalena",
    shippingZip: "12345",
    notes: "Llamar antes de entregar",
  }

  it("validates correct data", () => {
    const result = checkoutSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects missing customerName", () => {
    const result = checkoutSchema.safeParse({ ...validData, customerName: "" })
    expect(result.success).toBe(false)
  })

  it("rejects short customerName", () => {
    const result = checkoutSchema.safeParse({ ...validData, customerName: "A" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid phone", () => {
    const result = checkoutSchema.safeParse({ ...validData, customerPhone: "abc" })
    expect(result.success).toBe(false)
  })

  it("rejects empty phone", () => {
    const result = checkoutSchema.safeParse({ ...validData, customerPhone: "" })
    expect(result.success).toBe(false)
  })

  it("accepts phone without country code", () => {
    const result = checkoutSchema.safeParse({ ...validData, customerPhone: "3001234567" })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = checkoutSchema.safeParse({ ...validData, customerEmail: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("accepts empty email", () => {
    const result = checkoutSchema.safeParse({ ...validData, customerEmail: "" })
    expect(result.success).toBe(true)
  })

  it("rejects short shippingAddress", () => {
    const result = checkoutSchema.safeParse({ ...validData, shippingAddress: "A" })
    expect(result.success).toBe(false)
  })

  it("accepts empty shippingAddress", () => {
    const result = checkoutSchema.safeParse({ ...validData, shippingAddress: "" })
    expect(result.success).toBe(true)
  })

  it("rejects short shippingCity", () => {
    const result = checkoutSchema.safeParse({ ...validData, shippingCity: "A" })
    expect(result.success).toBe(false)
  })

  it("accepts empty shippingCity", () => {
    const result = checkoutSchema.safeParse({ ...validData, shippingCity: "" })
    expect(result.success).toBe(true)
  })

  it("rejects with all required fields missing", () => {
    const result = checkoutSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors
      expect(fields.customerName).toBeDefined()
      expect(fields.customerPhone).toBeDefined()
    }
  })

  it("accepts minimal valid data (only required)", () => {
    const result = checkoutSchema.safeParse({
      customerName: "Juan",
      customerPhone: "3001234567",
    })
    expect(result.success).toBe(true)
  })

  it("accepts optional notes", () => {
    const result = checkoutSchema.safeParse({
      customerName: "Juan",
      customerPhone: "3001234567",
      notes: undefined,
    })
    expect(result.success).toBe(true)
  })
})
