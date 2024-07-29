import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// This is a hack to make Prisma Client work with Next.js in development due to NextJS hot reloading feature.
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
