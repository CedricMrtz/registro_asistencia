import {
  AssistanceAnalytics,
  AssistanceResult,
  AssistanceType,
} from "@/types/assistance.types";

interface RegisterAssistancePayload {
  matricula: string;
  eventId: number;
  type: AssistanceType;
}

export async function registerAssistanceApi(
  payload: RegisterAssistancePayload
): Promise<AssistanceResult> {
  const res = await fetch("/api/assistances", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as AssistanceResult | { error?: string };

  if (!res.ok && res.status !== 422) {
    const message = "error" in data && data.error ? data.error : "Error al registrar";
    throw new Error(message);
  }

  return data as AssistanceResult;
}

export async function getAnalyticsApi(
  eventId: number
): Promise<AssistanceAnalytics> {
  const res = await fetch(`/api/analytics?eventId=${eventId}`);
  if (!res.ok) {
    throw new Error("No se pudo cargar la analitica del evento");
  }

  return (await res.json()) as AssistanceAnalytics;
}
