import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Setup the connection pool using the standard 'pg' driver
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap it in the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient constructor
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
