import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; pool: pg.Pool }

function createPrismaClient() {
  const url = process.env.DATABASE_URL!
  const poolUrl = process.env.DATABASE_POOL_URL || url
  const pool = new pg.Pool({
    connectionString: poolUrl,
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
  })
  globalForPrisma.pool = pool
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
