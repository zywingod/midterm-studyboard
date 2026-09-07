import { PrismaClient } from "@prisma/client";
import "@/lib/env";

// In development, Next.js hot-reloads modules, which would otherwise
// create a brand-new PrismaClient (and a new DB connection) on every
// file save. This singleton pattern stores one instance on the global
// object so it survives hot reloads. In production, a fresh instance
// is created once per server start, which is what we want.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
