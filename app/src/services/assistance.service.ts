import { prisma } from "@/lib/prisma";
import { AssistanceResult, AssistanceType } from "@/types/assistance.types";
import { isValidAssistanceType } from "@/utils/assistance.utils";
import { getSqlServerErrorNumber } from "@/utils/sqlServer.utils";

async function getStudentName(matricula: string): Promise<string | undefined> {
  const rows = await prisma.$queryRaw<{ nombre: string }[]>`
    SELECT nombre
    FROM Alumno
    WHERE matricula = ${matricula}
  `;

  return rows[0]?.nombre;
}

async function ensureEventExists(eventId: number): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ idEvento: number }[]>`
    SELECT idEvento
    FROM Evento
    WHERE idEvento = ${eventId}
  `;

  return rows.length > 0;
}

export async function registerAssistance(
  matricula: string,
  eventId: number,
  type: AssistanceType
): Promise<AssistanceResult> {
  if (!matricula) {
    return { success: false, matricula, reason: "Matricula requerida" };
  }

  if (!Number.isInteger(eventId)) {
    return { success: false, matricula, reason: "Evento invalido" };
  }

  if (!isValidAssistanceType(type)) {
    return { success: false, matricula, reason: "Tipo de asistencia invalido" };
  }

  const [eventExists, studentName] = await Promise.all([
    ensureEventExists(eventId),
    getStudentName(matricula),
  ]);

  if (!eventExists) {
    return { success: false, matricula, studentName, reason: "Evento no existe" };
  }

  if (!studentName) {
    return { success: false, matricula, reason: "Matricula no encontrada" };
  }

  const lastRecords = await prisma.$queryRaw<
    { idAsistencia: number; fecha_salida: Date | null }[]
  >`
    SELECT TOP 1 idAsistencia, fecha_salida
    FROM AlumnoAsistioEvento
    WHERE matricula = ${matricula} AND idEvento = ${eventId}
    ORDER BY idAsistencia DESC
  `;
  const lastRecord = lastRecords[0];

  if (type === "Entrada") {
    if (lastRecord && !lastRecord.fecha_salida) {
      return {
        success: false,
        matricula,
        studentName,
        reason: "Debe registrar salida antes de una nueva entrada",
      };
    }

    try {
      const inserted = await prisma.$queryRaw<{ idAsistencia: number }[]>`
        INSERT INTO AlumnoAsistioEvento (matricula, idEvento, fecha_llegada)
        OUTPUT inserted.idAsistencia
        VALUES (${matricula}, ${eventId}, ${new Date()})
      `;

      if (inserted.length === 0) {
        return {
          success: false,
          matricula,
          studentName,
          reason: "No se pudo registrar la entrada",
        };
      }
    } catch (error) {
      const sqlErrorNumber = getSqlServerErrorNumber(error);

      if (sqlErrorNumber === 547) {
        return {
          success: false,
          matricula,
          studentName,
          reason: "No se pudo registrar la entrada",
        };
      }

      throw error;
    }

    return { success: true, matricula, studentName };
  }

  if (!lastRecord || lastRecord.fecha_salida) {
    return {
      success: false,
      matricula,
      studentName,
      reason: "No hay entrada pendiente",
    };
  }

  try {
    const updated = await prisma.$queryRaw<{ idAsistencia: number }[]>`
      UPDATE AlumnoAsistioEvento
      SET fecha_salida = ${new Date()}
      OUTPUT inserted.idAsistencia
      WHERE idAsistencia = ${lastRecord.idAsistencia}
    `;

    if (updated.length === 0) {
      return {
        success: false,
        matricula,
        studentName,
        reason: "No se pudo registrar la salida",
      };
    }
  } catch (error) {
    const sqlErrorNumber = getSqlServerErrorNumber(error);

    if (sqlErrorNumber === 547) {
      return {
        success: false,
        matricula,
        studentName,
        reason: "No se pudo registrar la salida",
      };
    }

    throw error;
  }

  return { success: true, matricula, studentName };
}

export async function getEventAnalytics(eventId: number): Promise<{
  entradas: number;
  salidas: number;
  total: number;
}> {
  if (!Number.isInteger(eventId)) {
    return { entradas: 0, salidas: 0, total: 0 };
  }

  const [entradas, salidas] = await Promise.all([
    prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total
      FROM AlumnoAsistioEvento
      WHERE idEvento = ${eventId}
    `,
    prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total
      FROM AlumnoAsistioEvento
      WHERE idEvento = ${eventId} AND fecha_salida IS NOT NULL
    `,
  ]);

  const entradasTotal = entradas[0]?.total ?? 0;
  const salidasTotal = salidas[0]?.total ?? 0;

  return { entradas: entradasTotal, salidas: salidasTotal, total: entradasTotal };
}
