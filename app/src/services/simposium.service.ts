import { prisma } from "@/lib/prisma";
import { Simposium } from "@/types/simposium.types";

export async function getSimposiums(): Promise<Simposium[]> {
  return prisma.simposium.findMany({
    include: { Evento: true },
  });
}
