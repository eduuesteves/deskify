dotenv.config();
import dotenv, { config } from "dotenv";
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Garante que o Node leia a variável de ambiente corretamente
const connectionString = process.env.DATABASE_URL;

// Configura o pool de conexão do Postgres e passa para o adaptador do Prisma
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Instancia o PrismaClient passando o adapter
export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: ['query', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}