import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; pool: pg.Pool }

export async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === retries) throw err
      const errStr = String(err)
      const isPoolError = errStr.includes("DriverAdapterError") || errStr.includes("timeout") || errStr.includes("Connection terminated") || errStr.includes("AuthenticationFailed")
      if (!isPoolError) throw err
      console.warn(`[DB] retry ${i + 1}/${retries} after error:`, (err as Error).message)
      await new Promise(r => setTimeout(r, 500 * (i + 1)))
    }
  }
  throw new Error("unreachable")
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL!

  const pool = new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true,
  })

  pool.on("error", (err) => {
    console.error("[DB] Pool error:", err.message)
  })

  globalForPrisma.pool = pool
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

process.on("SIGTERM", async () => {
  await prisma.$disconnect()
})

process.on("SIGINT", async () => {
  await prisma.$disconnect()
})
