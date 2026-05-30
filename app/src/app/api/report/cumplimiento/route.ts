import { getDatosCumplimiento } from "@/services/reportCumplimiento.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idSimposium = Number(searchParams.get("idSimposium"));

  if (!Number.isInteger(idSimposium)) {
    return Response.json({ error: "idSimposium invalido" }, { status: 422 });
  }

  const data = await getDatosCumplimiento(idSimposium);
  return Response.json(data);
}
