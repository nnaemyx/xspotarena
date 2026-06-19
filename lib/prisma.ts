import { PrismaClient } from '@prisma/client';

function cleanDatabaseUrl(url: string | undefined): string {
  const defaultUrl = "mongodb://localhost:27017/calcio-threads";
  if (!url) {
    return defaultUrl;
  }

  // Strip wrapping quotes
  let cleanUrl = url.trim().replace(/^["']|["']$/g, "");

  try {
    if (cleanUrl.startsWith("mongodb://") || cleanUrl.startsWith("mongodb+srv://")) {
      const parsedUrl = new URL(cleanUrl);
      if (parsedUrl.pathname === "/" || parsedUrl.pathname === "") {
        parsedUrl.pathname = "/calcio-threads";
        return parsedUrl.toString();
      }
    }
    return cleanUrl;
  } catch (error) {
    console.error("Error parsing DATABASE_URL:", error);
    return cleanUrl;
  }
}

console.log("Original DATABASE_URL in process.env:", process.env.DATABASE_URL);
process.env.DATABASE_URL = cleanDatabaseUrl(process.env.DATABASE_URL);
console.log("Sanitized DATABASE_URL in process.env:", process.env.DATABASE_URL);

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error"],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export { prisma };