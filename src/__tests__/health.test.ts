import { describe, it, expect } from "vitest"

describe("vitest infrastructure", () => {
  it("runs a basic test", () => {
    expect(1 + 1).toBe(2)
  })

  it("handles async code", async () => {
    const result = await Promise.resolve(42)
    expect(result).toBe(42)
  })
})
