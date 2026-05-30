import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { ConnectionPool } from "mssql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: ConnectionPool | undefined;
};

const connectionConfig = {
  server: process.env.MSSQL_HOST!,
  port: Number(process.env.MSSQL_PORT) || 1433,
  database: process.env.MSSQL_DATABASE!,
  user: "sa",
  password: process.env.MSSQL_SA_PASSWORD!,
  options: {
    trustServerCertificate: true,
  },
};

const pool =
  globalForPrisma.pool ??
  new ConnectionPool(connectionConfig);

// PrismaMssql expects either a connection string or a config object.
// Pass the underlying config from the ConnectionPool instance to satisfy the expected type.
const adapter = new PrismaMssql(connectionConfig);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

export const sqlPool = pool;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
