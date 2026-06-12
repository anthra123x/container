import { describe, it, expect } from "vitest"
import { formatCurrency, formatDate, formatDateTime, slugify, truncate, getInitials } from "@/lib/utils/formatters"

describe("formatCurrency", () => {
  it("formats a number", () => {
    expect(formatCurrency(1234.56)).toMatch(/S\/.*1[,.]234[,.]56/)
  })

  it("formats zero", () => {
    expect(formatCurrency(0)).toMatch(/S\/.*0[,.]00/)
  })

  it("returns S/ 0.00 for null", () => {
    expect(formatCurrency(null)).toBe("S/ 0.00")
  })

  it("returns S/ 0.00 for undefined", () => {
    expect(formatCurrency(undefined)).toBe("S/ 0.00")
  })

  it("parses a string number", () => {
    expect(formatCurrency("99.99")).toMatch(/S\/.*99[,.]99/)
  })
})

describe("formatDate", () => {
  it("formats a Date", () => {
    const d = new Date(2024, 0, 15)
    expect(formatDate(d)).toContain("15")
    expect(formatDate(d)).toContain("01")
    expect(formatDate(d)).toContain("2024")
  })

  it("parses a date string", () => {
    expect(formatDate("2024-01-15")).toContain("2024")
  })

  it("returns empty for null", () => {
    expect(formatDate(null)).toBe("")
  })

  it("returns empty for undefined", () => {
    expect(formatDate(undefined)).toBe("")
  })
})

describe("formatDateTime", () => {
  it("includes time in output", () => {
    const d = new Date(2024, 0, 15, 14, 30)
    const result = formatDateTime(d)
    expect(result).toContain("2024")
    expect(result.length).toBeGreaterThan(formatDate(d).length)
  })
})

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world")
  })

  it("replaces spaces with hyphens", () => {
    expect(slugify("product name here")).toBe("product-name-here")
  })

  it("removes special characters", () => {
    expect(slugify("¿Qué pasa?")).toBe("qu-pasa")
  })

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  hello  ")).toBe("hello")
  })

  it("collapses multiple hyphens", () => {
    expect(slugify("a   b")).toBe("a-b")
  })
})

describe("truncate", () => {
  it("returns the string if shorter than length", () => {
    expect(truncate("hello", 10)).toBe("hello")
  })

  it("truncates and adds ellipsis", () => {
    const result = truncate("hello world this is long", 10)
    expect(result).toMatch(/^.{10}\.\.\.$/)
  })
})

describe("getInitials", () => {
  it("returns initials from full name", () => {
    expect(getInitials("John Doe")).toBe("JD")
  })

  it("returns single initial", () => {
    expect(getInitials("John")).toBe("J")
  })

  it("handles extra spaces", () => {
    expect(getInitials("  John   Doe  ")).toBe("JD")
  })

  it("limits to 2 characters", () => {
    expect(getInitials("John Michael Doe")).toBe("JM")
  })
})
