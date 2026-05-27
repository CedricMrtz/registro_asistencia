import { getEventAnalytics } from "@/services/assistance.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = Number(searchParams.get("eventId"));

  if (!Number.isInteger(eventId)) {
    return Response.json({ error: "Evento invalido" }, { status: 422 });
  }

  const analytics = await getEventAnalytics(eventId);
  return Response.json(analytics);
}
