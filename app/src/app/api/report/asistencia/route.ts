import { getDatosAsistencia } from "@/services/reportAsistencia.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idSimposium = Number(searchParams.get("idSimposium"));

  if (!Number.isInteger(idSimposium)) {
    return Response.json({ error: "idSimposium invalido" }, { status: 422 });
  }

  const data = await getDatosAsistencia(idSimposium);
  return Response.json(data);
}
