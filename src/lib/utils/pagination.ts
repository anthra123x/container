export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginatedResult<T> {
  data: T[]
  metadata: {
    total: number
    page: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20))
  const skip = (page - 1) * pageSize

  return { page, pageSize, skip, take: pageSize }
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / pageSize)

  return {
    data,
    metadata: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}
