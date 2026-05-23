"use client";

import { Simposium } from "@/types/simposium.types";

interface SimposiumSelectorProps {
  simposiums: Simposium[];
  value: number | null;
  onChange: (value: number | null) => void;
}

export function SimposiumSelector({
  simposiums,
  value,
  onChange,
}: SimposiumSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-stone-700">Simposio</label>
      <select
        className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
        value={value ?? ""}
        onChange={(event) => {
          const nextValue = event.target.value ? Number(event.target.value) : null;
          onChange(nextValue);
        }}
      >
        <option value="">Seleccionar simposio...</option>
        {simposiums.map((simposium) => (
          <option key={simposium.id} value={simposium.id}>
            {simposium.name}
          </option>
        ))}
      </select>
    </div>
  );
}
