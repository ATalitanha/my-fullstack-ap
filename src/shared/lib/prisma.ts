import { PrismaClient } from '@prisma/client';

/**
 * A Prisma client instance.
 *
 * In development, a global Prisma client is used to prevent hot-reloading
 * from creating too many connections.
 *
 * @type {PrismaClient}
 */
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
