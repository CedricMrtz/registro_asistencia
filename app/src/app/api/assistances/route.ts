import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  return Response.json(
    { error: "Registro de asistencia no disponible: falta tabla en el esquema" },
    { status: 501 }
  );
}
