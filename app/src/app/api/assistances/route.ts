import { NextRequest } from "next/server";
import { registerAssistance } from "@/services/assistance.service";
import { AssistanceType } from "@/types/assistance.types";

interface RegisterAssistancePayload {
  matricula?: string;
  eventId?: number;
  type?: AssistanceType;
}

const VALID_TYPES: AssistanceType[] = ["Entrada", "Salida"];

function isValidAssistanceType(type: string | undefined): type is AssistanceType {
  return Boolean(type) && VALID_TYPES.includes(type as AssistanceType);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RegisterAssistancePayload;
  const matricula = body.matricula?.trim() ?? "";
  const eventId = Number(body.eventId);
  const type = body.type;

  if (!matricula || !Number.isInteger(eventId) || !isValidAssistanceType(type)) {
    return Response.json(
      { error: "Datos de asistencia invalidos" },
      { status: 422 }
    );
  }

  const result = await registerAssistance(matricula, eventId, type);

  if (!result.success) {
    return Response.json(result, { status: 422 });
  }

  return Response.json(result);
}
