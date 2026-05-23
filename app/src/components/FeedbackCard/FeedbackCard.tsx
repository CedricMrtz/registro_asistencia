"use client";

import { AssistanceFeedback } from "@/types/assistance.types";

interface FeedbackCardProps {
  item: AssistanceFeedback;
}

export function FeedbackCard({ item }: FeedbackCardProps) {
  const isSuccess = item.success;
  const isEntrada = item.type === "Entrada";

  if (!isSuccess) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
        <span className="text-rose-700 text-xs font-semibold uppercase tracking-wide">
          ✗ No Registrado
        </span>
        <p className="font-mono text-sm text-stone-700 mt-1">{item.matricula}</p>
        <p className="text-sm text-stone-500">
          {item.reason ?? "No fue posible registrar la asistencia"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border p-4 ${
        isEntrada
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <span
        className={`text-xs font-semibold uppercase tracking-wide ${
          isEntrada ? "text-emerald-700" : "text-amber-700"
        }`}
      >
        {isEntrada ? "✓ Entrada Registrada" : "✓ Salida Registrada"}
      </span>
      <p className="font-mono text-sm text-stone-700 mt-1">{item.matricula}</p>
      <p className="text-sm font-semibold text-stone-800">
        {item.studentName ?? "Estudiante"}
      </p>
    </div>
  );
}
