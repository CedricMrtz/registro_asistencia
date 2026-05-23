import { getSimposiums } from "@/services/simposium.service";

export async function GET() {
  const simposiums = await getSimposiums();
  return Response.json(simposiums);
}
