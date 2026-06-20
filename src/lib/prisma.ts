import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/*
 * A single shared Prisma client, reused across API routes.
 *
 * In development Next.js hot-reloads modules, which would otherwise create a new
 * client (and a new SQLite connection) on every reload and exhaust resources.
 * Caching the instance on `globalThis` keeps one connection alive.
 *
 * Prisma 7 connects through a driver adapter; for SQLite that's better-sqlite3.
 * The database URL comes from process.env.DATABASE_URL (see .env).
 */
const createPrismaClient = () => {
  const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
