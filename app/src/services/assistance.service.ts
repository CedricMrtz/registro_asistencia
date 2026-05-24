import { AssistanceResult, AssistanceType } from "@/types/assistance.types";

export async function registerAssistance(
  matricula: string,
  _eventId: number,
  _type: AssistanceType
): Promise<AssistanceResult> {
  return {
    success: false,
    matricula,
    reason: "Registro de asistencia no disponible: falta tabla en el esquema",
  };
}

export async function getEventAnalytics(_eventId: number): Promise<{
  entradas: number;
  salidas: number;
  total: number;
}> {
  return { entradas: 0, salidas: 0, total: 0 };
}
