import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  // Prevent instantiating on the client side (browsers)
  if (typeof window !== "undefined") {
    return new PrismaClient();
  }

  const connectionString = process.env.DATABASE_URL;

  // Fallback to basic client if DATABASE_URL is not set (e.g. during build phase)
  if (!connectionString || connectionString.includes("placeholder")) {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
export type PrismaClientType = ReturnType<typeof prismaClientSingleton>;
