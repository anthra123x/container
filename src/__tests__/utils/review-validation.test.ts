import { describe, it, expect } from "vitest"
import { createReviewSchema } from "@/lib/validations/review"

describe("createReviewSchema", () => {
  const validData = {
    productId: "15f7365c-1e83-435a-b94b-7f3590ec08cd",
    customerName: "Juan Pérez",
    phone: "+57 300 123 4567",
    rating: 5,
    title: "Excelente producto",
    content: "Muy buen producto, llegó rápido y en perfecto estado. Lo recomiendo ampliamente.",
  }

  it("validates a correct review", () => {
    const result = createReviewSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects missing productId", () => {
    const result = createReviewSchema.safeParse({ ...validData, productId: "not-a-uuid" })
    expect(result.success).toBe(false)
  })

  it("rejects missing customerName", () => {
    const result = createReviewSchema.safeParse({ ...validData, customerName: "" })
    expect(result.success).toBe(false)
  })

  it("rejects short customerName", () => {
    const result = createReviewSchema.safeParse({ ...validData, customerName: "A" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid phone", () => {
    const result = createReviewSchema.safeParse({ ...validData, phone: "abc" })
    expect(result.success).toBe(false)
  })

  it("rejects rating below 1", () => {
    const result = createReviewSchema.safeParse({ ...validData, rating: 0 })
    expect(result.success).toBe(false)
  })

  it("rejects rating above 5", () => {
    const result = createReviewSchema.safeParse({ ...validData, rating: 6 })
    expect(result.success).toBe(false)
  })

  it("accepts decimal string rating", () => {
    const result = createReviewSchema.safeParse({ ...validData, rating: "4" })
    expect(result.success).toBe(true)
  })

  it("rejects short content", () => {
    const result = createReviewSchema.safeParse({ ...validData, content: "Corto" })
    expect(result.success).toBe(false)
  })

  it("rejects long title", () => {
    const result = createReviewSchema.safeParse({ ...validData, title: "x".repeat(101) })
    expect(result.success).toBe(false)
  })

  it("accepts empty title", () => {
    const result = createReviewSchema.safeParse({ ...validData, title: "" })
    expect(result.success).toBe(true)
  })

  it("rejects long content", () => {
    const result = createReviewSchema.safeParse({ ...validData, content: "x".repeat(2001) })
    expect(result.success).toBe(false)
  })
})
