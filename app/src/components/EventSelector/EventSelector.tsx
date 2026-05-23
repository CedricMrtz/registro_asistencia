"use client";

import { Event } from "@/types/simposium.types";

interface EventSelectorProps {
  events: Event[];
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}

export function EventSelector({
  events,
  value,
  onChange,
  disabled = false,
}: EventSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-stone-700">Evento</label>
      <select
        className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-40"
        value={value ?? ""}
        onChange={(event) => {
          const nextValue = event.target.value ? Number(event.target.value) : null;
          onChange(nextValue);
        }}
        disabled={disabled}
      >
        <option value="">Seleccionar evento...</option>
        {events.map((eventItem) => (
          <option key={eventItem.id} value={eventItem.id}>
            {eventItem.name}
          </option>
        ))}
      </select>
    </div>
  );
}
