import sql from "mssql";
import {
  CumplimientoEventoRow,
  DatosCumplimientoResult,
  SimposiumCumplimientoEventRow,
  StudentCumplimientoRow,
} from "@/types/reportCumplimiento.types";

const connectionConfig = {
  server: process.env.MSSQL_HOST!,
  port: Number(process.env.MSSQL_PORT) || 1433,
  database: process.env.MSSQL_DATABASE!,
  user: process.env.MSSQL_USER!,
  password: process.env.MSSQL_PASSWORD!,
  options: {
    trustServerCertificate: true,
  },
};

const globalForSqlServer = globalThis as unknown as {
  sqlServerPool: sql.ConnectionPool | undefined;
};

async function getSqlServerPool(): Promise<sql.ConnectionPool> {
  if (globalForSqlServer.sqlServerPool?.connected) {
    return globalForSqlServer.sqlServerPool;
  }

  if (!globalForSqlServer.sqlServerPool) {
    globalForSqlServer.sqlServerPool = new sql.ConnectionPool(connectionConfig);
  }

  if (!globalForSqlServer.sqlServerPool.connected) {
    await globalForSqlServer.sqlServerPool.connect();
  }

  return globalForSqlServer.sqlServerPool;
}

export async function getDatosCumplimiento(
  idSimposium: number
): Promise<DatosCumplimientoResult> {
  if (!Number.isInteger(idSimposium)) {
    throw new Error("idSimposium invalido");
  }

  const pool = await getSqlServerPool();

  const result = await pool
    .request()
    .input("idSimposium", sql.Int, idSimposium)
    .execute("sp_GetDatosCumplimiento");

  const [
    alumnosInscritos = [],
    cumplimientoPorEvento = [],
    eventosDelSimposium = [],
  ] = result.recordsets as unknown as [
    StudentCumplimientoRow[],
    CumplimientoEventoRow[],
    SimposiumCumplimientoEventRow[]
  ];

  return {
    alumnosInscritos,
    cumplimientoPorEvento,
    eventosDelSimposium,
  };
}
