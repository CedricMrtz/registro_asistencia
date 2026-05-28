import { prisma } from "@/lib/prisma";
import { Event, Simposium } from "@/types/simposium.types";

export async function getSimposiums(): Promise<Simposium[]> {
  const rows = await prisma.$queryRaw<
    {
      idSimposium: number;
      nombre: string;
      fecha_comienzo: Date;
      fecha_acabado: Date;
      capacidad_asistentes: number;
      adminSimposiumID: number;
      evento_idEvento: number | null;
      evento_nombreEvento: string | null;
      evento_fecha_comienzo: Date | null;
      evento_fecha_acabado: Date | null;
      evento_idSimposium: number | null;
      evento_nombreTipo: string | null;
    }[]
  >`
    SELECT
      s.idSimposium,
      s.nombre,
      s.fecha_comienzo,
      s.fecha_acabado,
      s.capacidad_asistentes,
      s.adminSimposiumID,
      e.idEvento AS evento_idEvento,
      e.nombreEvento AS evento_nombreEvento,
      e.fecha_comienzo AS evento_fecha_comienzo,
      e.fecha_acabado AS evento_fecha_acabado,
      e.idSimposium AS evento_idSimposium,
      e.nombreTipo AS evento_nombreTipo
    FROM Simposium s
    LEFT JOIN Evento e ON e.idSimposium = s.idSimposium
    ORDER BY s.idSimposium, e.fecha_comienzo
  `;

  const simposiumById = new Map<number, Simposium>();

  for (const row of rows) {
    let simposium = simposiumById.get(row.idSimposium);
    if (!simposium) {
      simposium = {
        idSimposium: row.idSimposium,
        nombre: row.nombre,
        fecha_comienzo: row.fecha_comienzo,
        fecha_acabado: row.fecha_acabado,
        capacidad_asistentes: row.capacidad_asistentes,
        adminSimposiumID: row.adminSimposiumID,
        Evento: [],
      };
      simposiumById.set(row.idSimposium, simposium);
    }

    if (row.evento_idEvento !== null) {
      if (
        row.evento_nombreEvento === null ||
        row.evento_fecha_comienzo === null ||
        row.evento_fecha_acabado === null ||
        row.evento_idSimposium === null ||
        row.evento_nombreTipo === null
      ) {
        continue;
      }

      simposium.Evento.push({
        idEvento: row.evento_idEvento,
        nombreEvento: row.evento_nombreEvento,
        fecha_comienzo: row.evento_fecha_comienzo,
        fecha_acabado: row.evento_fecha_acabado,
        idSimposium: row.evento_idSimposium,
        nombreTipo: row.evento_nombreTipo,
      });
    }
  }

  return Array.from(simposiumById.values());
}

export async function getActiveEvent(): Promise<Event | null> {
  const result = await prisma.$queryRaw<{ idEvento: number | null }[]>`
    SELECT dbo.EventoActivo() AS idEvento
  `;

  const activeId = result[0]?.idEvento ?? null;
  if (!activeId) {
    return null;
  }

  const rows = await prisma.$queryRaw<Event[]>`
    SELECT
      idEvento,
      nombreEvento,
      fecha_comienzo,
      fecha_acabado,
      idSimposium,
      nombreTipo
    FROM Evento
    WHERE idEvento = ${activeId}
  `;

  return rows[0] ?? null;
}
