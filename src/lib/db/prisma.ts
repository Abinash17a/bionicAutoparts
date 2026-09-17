// src/lib/db/prisma.ts
/**
 * Prisma Database Client Singleton
 * 
 * Provides a single shared PrismaClient instance for Next.js Server Components
 * and server-side route handlers, avoiding multiple connections during development HMR.
 * 
 * Guarded against client-side execution to prevent exposing database credentials.
 */

import { PrismaClient } from '@prisma/client';

if (typeof window !== 'undefined') {
  throw new Error('PrismaClient cannot be imported or executed in client-side bundles.');
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prismaGlobal: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaGlobal = prisma;
}

export default prisma;
