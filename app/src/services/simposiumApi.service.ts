import { Simposium } from "@/types/simposium.types";

export async function getSimposiumsApi(): Promise<Simposium[]> {
  const res = await fetch("/api/simposiums");
  if (!res.ok) {
    throw new Error("No se pudieron cargar los simposios");
  }

  return (await res.json()) as Simposium[];
}
