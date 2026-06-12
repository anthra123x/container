import { describe, it, expect } from "vitest"
import { getPaginationParams, createPaginatedResult } from "@/lib/utils/pagination"

describe("getPaginationParams", () => {
  it("uses defaults when no params", () => {
    const result = getPaginationParams({})
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(20)
    expect(result.skip).toBe(0)
    expect(result.take).toBe(20)
  })

  it("respects custom page and pageSize", () => {
    const result = getPaginationParams({ page: 3, pageSize: 10 })
    expect(result.page).toBe(3)
    expect(result.pageSize).toBe(10)
    expect(result.skip).toBe(20)
    expect(result.take).toBe(10)
  })

  it("clamps page to minimum 1", () => {
    expect(getPaginationParams({ page: 0 }).page).toBe(1)
    expect(getPaginationParams({ page: -5 }).page).toBe(1)
  })

  it("clamps pageSize between 1 and 100", () => {
    expect(getPaginationParams({ pageSize: 0 }).pageSize).toBe(1)
    expect(getPaginationParams({ pageSize: 200 }).pageSize).toBe(100)
  })
})

describe("createPaginatedResult", () => {
  const items = ["a", "b", "c"]

  it("creates paginated result with metadata", () => {
    const result = createPaginatedResult(items, 30, 1, 10)
    expect(result.data).toEqual(items)
    expect(result.metadata.total).toBe(30)
    expect(result.metadata.page).toBe(1)
    expect(result.metadata.totalPages).toBe(3)
    expect(result.metadata.hasNextPage).toBe(true)
    expect(result.metadata.hasPreviousPage).toBe(false)
  })

  it("detects last page correctly", () => {
    const result = createPaginatedResult(items, 10, 2, 5)
    expect(result.metadata.totalPages).toBe(2)
    expect(result.metadata.hasNextPage).toBe(false)
    expect(result.metadata.hasPreviousPage).toBe(true)
  })

  it("handles single page", () => {
    const result = createPaginatedResult(items, 3, 1, 10)
    expect(result.metadata.totalPages).toBe(1)
    expect(result.metadata.hasNextPage).toBe(false)
    expect(result.metadata.hasPreviousPage).toBe(false)
  })

  it("handles empty data", () => {
    const result = createPaginatedResult([], 0, 1, 20)
    expect(result.metadata.totalPages).toBe(0)
    expect(result.metadata.hasNextPage).toBe(false)
    expect(result.metadata.hasPreviousPage).toBe(false)
  })
})
