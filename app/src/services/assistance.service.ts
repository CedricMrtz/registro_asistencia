import { prisma } from "@/lib/prisma";
import { AssistanceResult, AssistanceType } from "@/types/assistance.types";

const VALID_TYPES: AssistanceType[] = ["Entrada", "Salida"];

function isValidAssistanceType(type: string): type is AssistanceType {
  return VALID_TYPES.includes(type as AssistanceType);
}

async function getStudentName(matricula: string): Promise<string | undefined> {
  const student = await prisma.alumno.findUnique({
    where: { matricula },
    select: { nombre: true },
  });

  return student?.nombre;
}

async function ensureEventExists(eventId: number): Promise<boolean> {
  const event = await prisma.evento.findUnique({
    where: { idEvento: eventId },
    select: { idEvento: true },
  });

  return Boolean(event);
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

  const lastRecord = await prisma.alumnoAsistioEvento.findFirst({
    where: {
      matricula,
      idEvento: eventId,
    },
    orderBy: {
      idAsistencia: "desc",
    },
  });

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
      await prisma.alumnoAsistioEvento.create({
        data: {
          matricula,
          idEvento: eventId,
          fecha_llegada: new Date(),
        },
      });
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error
        ? String((error as { code?: string }).code)
        : "";

      if (code === "P2003" || code === "P2025") {
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
    await prisma.alumnoAsistioEvento.update({
      where: {
        idAsistencia: lastRecord.idAsistencia,
      },
      data: {
        fecha_salida: new Date(),
      },
    });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error
      ? String((error as { code?: string }).code)
      : "";

    if (code === "P2025") {
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
    prisma.alumnoAsistioEvento.count({
      where: { idEvento: eventId },
    }),
    prisma.alumnoAsistioEvento.count({
      where: { idEvento: eventId, fecha_salida: { not: null } },
    }),
  ]);

  return { entradas, salidas, total: entradas };
}
