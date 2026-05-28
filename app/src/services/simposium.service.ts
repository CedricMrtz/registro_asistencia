import { prisma } from "@/lib/prisma";
import { Event, Simposium } from "@/types/simposium.types";

export async function getSimposiums(): Promise<Simposium[]> {
  return prisma.simposium.findMany({
    include: { Evento: true },
  });
}

export async function getActiveEvent(): Promise<Event | null> {
  const result = await prisma.$queryRaw<{ idEvento: number | null }[]>`
    SELECT dbo.EventoActivo() AS idEvento
  `;

  const activeId = result[0]?.idEvento ?? null;
  if (!activeId) {
    return null;
  }

  return prisma.evento.findUnique({
    where: { idEvento: activeId },
  });
}
