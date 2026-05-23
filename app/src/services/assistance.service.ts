import { prisma } from "@/lib/prisma";
import { AssistanceResult, AssistanceType } from "@/types/assistance.types";

export async function registerAssistance(
  matricula: string,
  eventId: number,
  type: AssistanceType
): Promise<AssistanceResult> {
  const student = await prisma.student.findUnique({ where: { matricula } });

  if (!student) {
    return { success: false, reason: "Estudiante no encontrado", matricula };
  }

  const existing = await prisma.assistance.findUnique({
    where: { eventId_studentId_type: { eventId, studentId: student.id, type } },
  });

  if (existing) {
    return { success: false, reason: `${type} ya registrada`, matricula, studentName: student.name };
  }

  await prisma.assistance.create({
    data: { eventId, studentId: student.id, type },
  });

  return { success: true, matricula, studentName: student.name };
}

export async function getEventAnalytics(eventId: number): Promise<{
  entradas: number;
  salidas: number;
  total: number;
}> {
  const [entradas, salidas, total] = await Promise.all([
    prisma.assistance.count({ where: { eventId, type: "Entrada" } }),
    prisma.assistance.count({ where: { eventId, type: "Salida" } }),
    prisma.student.count(),
  ]);

  return { entradas, salidas, total };
}
