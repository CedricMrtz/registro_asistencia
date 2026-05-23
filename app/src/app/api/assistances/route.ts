import { NextRequest } from "next/server";
import { registerAssistance } from "@/services/assistance.service";
import { AssistanceType } from "@/types/assistance.types";

function isAssistanceType(value: string): value is AssistanceType {
  return value === "Entrada" || value === "Salida";
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { matricula?: string; eventId?: number; type?: string };
  const { matricula, eventId, type } = body;

  if (!matricula || !eventId || !type) {
    return Response.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  if (!isAssistanceType(type)) {
    return Response.json({ error: "Tipo invalido" }, { status: 400 });
  }

  const result = await registerAssistance(matricula, Number(eventId), type);
  return Response.json(result, { status: result.success ? 200 : 422 });
}
