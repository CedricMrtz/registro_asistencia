"use client";

import { useEffect, useMemo, useState } from "react";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { FeedbackFeed } from "@/components/FeedbackFeed";
import { MatriculaInput } from "@/components/MatriculaInput";
import { ModeToggle } from "@/components/ModeToggle";
import { useAssistances } from "@/hooks/useAssistances";
import { getActiveEventApi, getSimposiumsApi } from "@/services/simposiumApi.service";
import {
  AssistanceFeedback,
  AssistanceType,
} from "@/types/assistance.types";
import { Simposium } from "@/types/simposium.types";

export default function DashboardPage() {
  const [simposiums, setSimposiums] = useState<Simposium[]>([]);
  const [isLoadingSimposiums, setIsLoadingSimposiums] = useState(false);
  const [simposiumId, setSimposiumId] = useState<number | null>(null);
  const [eventId, setEventId] = useState<number | null>(null);
  const [mode, setMode] = useState<AssistanceType>("Entrada");
  const [feed, setFeed] = useState<AssistanceFeedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simposiumError, setSimposiumError] = useState<string | null>(null);
  const [activeEventError, setActiveEventError] = useState<string | null>(null);
  const [isLoadingActiveEvent, setIsLoadingActiveEvent] = useState(false);
  const [isAutoEvent, setIsAutoEvent] = useState(false);

  const {
    analytics,
    isLoadingAnalytics,
    error,
    registerAssistance,
    refreshAnalytics,
    clearAnalytics,
  } = useAssistances();

  const selectedSimposium = useMemo(
    () => simposiums.find((item) => item.idSimposium === simposiumId) ?? null,
    [simposiums, simposiumId]
  );

  const events = useMemo(() => selectedSimposium?.Evento ?? [], [selectedSimposium]);

  useEffect(() => {
    let isMounted = true;

    const loadSimposiums = async () => {
      setIsLoadingSimposiums(true);
      setSimposiumError(null);

      try {
        const data = await getSimposiumsApi();
        if (isMounted) {
          setSimposiums(data);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Error al cargar simposios";
          setSimposiumError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSimposiums(false);
        }
      }
    };

    loadSimposiums();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadActiveEvent = async () => {
      setIsLoadingActiveEvent(true);
      setActiveEventError(null);

      try {
        const event = await getActiveEventApi();
        if (!isMounted) {
          return;
        }

        if (event) {
          setSimposiumId(event.idSimposium);
          setEventId(event.idEvento);
          setIsAutoEvent(true);
          return;
        }

        setIsAutoEvent(false);
        setSimposiumId(null);
        setEventId(null);
        setActiveEventError("No hay evento activo");
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Error al cargar evento activo";
          setActiveEventError(message);
          setIsAutoEvent(false);
          setSimposiumId(null);
          setEventId(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingActiveEvent(false);
        }
      }
    };

    loadActiveEvent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!eventId) {
      clearAnalytics();
      return;
    }

    refreshAnalytics(eventId);
  }, [eventId, refreshAnalytics, clearAnalytics]);

  const refreshActiveEvent = async () => {
    setIsLoadingActiveEvent(true);
    setActiveEventError(null);

    try {
      const event = await getActiveEventApi();
      if (event) {
        setSimposiumId(event.idSimposium);
        setEventId(event.idEvento);
        setIsAutoEvent(true);
        return;
      }

      setIsAutoEvent(false);
      setSimposiumId(null);
      setEventId(null);
      setActiveEventError("No hay evento activo");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar evento activo";
      setActiveEventError(message);
      setIsAutoEvent(false);
      setSimposiumId(null);
      setEventId(null);
    } finally {
      setIsLoadingActiveEvent(false);
    }
  };

  const handleRegister = async (matricula: string) => {
    if (!eventId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerAssistance({
        matricula,
        eventId,
        type: mode,
      });

      setFeed((prev) => [{ ...result, type: mode }, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo registrar";
      setFeed((prev) => [
        { success: false, matricula, reason: message, type: mode },
        ...prev,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
              Control de Asistencia
            </h1>
            <p className="text-sm text-stone-500">Panel de registro por evento</p>
          </div>
          <div className="text-sm text-stone-500">
            Modo actual: <span className="font-medium text-stone-800">{mode}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="space-y-6 rounded-lg border border-stone-200 bg-white p-6 lg:col-span-1">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-stone-700">Evento activo</label>
                <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800">
                  {eventId ? "Evento activo encontrado" : "Sin evento activo"}
                </div>
                <button
                  type="button"
                  onClick={refreshActiveEvent}
                  className="h-9 w-full rounded-md border border-stone-200 bg-white text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                  disabled={isLoadingActiveEvent}
                >
                  {isLoadingActiveEvent ? "Actualizando..." : "Actualizar evento activo"}
                </button>
              </div>
              {isLoadingSimposiums && (
                <p className="text-xs text-stone-500">Cargando simposios...</p>
              )}
              {simposiumError && (
                <p className="text-xs text-rose-600">{simposiumError}</p>
              )}
              {activeEventError && (
                <p className="text-xs text-rose-600">{activeEventError}</p>
              )}
            </div>

            <ModeToggle mode={mode} onChange={setMode} />

            <div className="border-t border-stone-200 pt-4">
              {isLoadingAnalytics ? (
                <p className="text-xs text-stone-500">Cargando analitica...</p>
              ) : (
                <AnalyticsSummary
                  entradas={analytics?.entradas ?? 0}
                  salidas={analytics?.salidas ?? 0}
                />
              )}
              {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
            </div>
          </section>

          <section className="space-y-6 rounded-lg border border-stone-200 bg-white p-6 lg:col-span-2">
            <MatriculaInput
              disabled={!eventId}
              isSubmitting={isSubmitting}
              onSubmit={handleRegister}
            />

            <div className="space-y-3">
              <p className="text-sm font-medium text-stone-500 uppercase tracking-widest">
                Registro reciente
              </p>
              <FeedbackFeed items={feed} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
