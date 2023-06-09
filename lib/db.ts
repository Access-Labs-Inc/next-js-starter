import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
// IMPORTANT:
//   For production we want to use PGBouncer therfore separete ENV
//   and for migrations we need non-pgbouncer connection
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        // IMPORTANT: &pgbouncer=true is needed in search params to make it work
        url: process.env.CLIENT_DATABASE_URL,
      },
    },
  });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      log: ['query']
    });
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
