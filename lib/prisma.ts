import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrismaClient() {
  const existing = globalForPrisma.prisma;

  // After schema changes, an old hot-reloaded client may be missing new models.
  const deliveryLocation = (
    existing as { deliveryLocation?: { findMany?: unknown } } | undefined
  )?.deliveryLocation;
  if (existing && typeof deliveryLocation?.findMany === "function") {
    return existing;
  }

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = getPrismaClient();
