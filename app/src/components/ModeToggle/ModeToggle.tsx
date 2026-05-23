"use client";

import { AssistanceType } from "@/types/assistance.types";

interface ModeToggleProps {
  mode: AssistanceType;
  onChange: (mode: AssistanceType) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-stone-700">Modo</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange("Entrada")}
          className={`h-10 flex-1 rounded-md border text-sm font-medium transition-colors ${
            mode === "Entrada"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
          }`}
        >
          Entrada
        </button>
        <button
          type="button"
          onClick={() => onChange("Salida")}
          className={`h-10 flex-1 rounded-md border text-sm font-medium transition-colors ${
            mode === "Salida"
              ? "bg-amber-600 text-white border-amber-600"
              : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
          }`}
        >
          Salida
        </button>
      </div>
    </div>
  );
}
