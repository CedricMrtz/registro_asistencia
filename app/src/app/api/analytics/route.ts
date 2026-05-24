export async function GET() {
  return Response.json(
    { error: "Analitica no disponible: falta tabla de asistencia en el esquema" },
    { status: 501 }
  );
}
