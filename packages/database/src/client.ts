import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalOrWindow as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Polyfill for global/window in different environments
declare const globalOrWindow: any;
if (typeof window !== "undefined") {
  (window as any).globalOrWindow = window;
} else {
  (global as any).globalOrWindow = global;
}