import { getActiveEvent } from "@/services/simposium.service";

export async function GET() {
  const event = await getActiveEvent();
  return Response.json({ event });
}
