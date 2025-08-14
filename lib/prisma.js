// // import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '@/lib/generated/prisma';

// const globalForPrisma = globalThis;

// const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
    
//   });

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma;
// }

// export { prisma };


// In lib/prisma.js (or .ts)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// This prevents multiple instances of Prisma Client in development
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { prisma };
