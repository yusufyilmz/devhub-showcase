import { PrismaClient } from '@prisma/client'

export type DbClient = PrismaClient

const globalForPrisma = globalThis as unknown as {
  db: DbClient | undefined
}

const db = globalForPrisma.db ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.db = db
}

export { db }
