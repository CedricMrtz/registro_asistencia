import { Event, Simposium } from "@/types/simposium.types";

export async function getSimposiumsApi(): Promise<Simposium[]> {
  const res = await fetch("/api/simposiums");
  if (!res.ok) {
    throw new Error("No se pudieron cargar los simposios");
  }

  return (await res.json()) as Simposium[];
}

export async function getActiveEventApi(): Promise<Event | null> {
  const res = await fetch("/api/events/active");
  if (!res.ok) {
    throw new Error("No se pudo cargar el evento activo");
  }

  const data = (await res.json()) as { event: Event | null };
  return data.event ?? null;
}
