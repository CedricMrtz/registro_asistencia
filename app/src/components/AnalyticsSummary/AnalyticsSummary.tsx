"use client";

interface AnalyticsSummaryProps {
  entradas: number;
  salidas: number;
}

export function AnalyticsSummary({ entradas, salidas }: AnalyticsSummaryProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">
        Asistencia del Evento
      </p>
      <div className="flex gap-6">
        <div>
          <p className="text-2xl font-semibold text-emerald-600">{entradas}</p>
          <p className="text-xs text-stone-500">Entradas</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-amber-600">{salidas}</p>
          <p className="text-xs text-stone-500">Salidas</p>
        </div>
      </div>
    </div>
  );
}
