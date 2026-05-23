import { NextRequest } from "next/server";
import { getEventAnalytics } from "@/services/assistance.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return Response.json({ error: "eventId requerido" }, { status: 400 });
  }

  const analytics = await getEventAnalytics(Number(eventId));
  return Response.json(analytics);
}
