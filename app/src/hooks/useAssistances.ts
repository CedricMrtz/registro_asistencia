"use client";

import { useCallback, useState } from "react";
import {
  AssistanceAnalytics,
  AssistanceResult,
  AssistanceType,
} from "@/types/assistance.types";
import { getAnalyticsApi, registerAssistanceApi } from "@/services/assistanceApi.service";

interface UseAssistancesResult {
  analytics: AssistanceAnalytics | null;
  isLoadingAnalytics: boolean;
  error: string | null;
  registerAssistance: (params: {
    matricula: string;
    eventId: number;
    type: AssistanceType;
  }) => Promise<AssistanceResult>;
  refreshAnalytics: (eventId: number) => Promise<void>;
  clearAnalytics: () => void;
}

export function useAssistances(): UseAssistancesResult {
  const [analytics, setAnalytics] = useState<AssistanceAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAnalytics = useCallback(async (eventId: number) => {
    setIsLoadingAnalytics(true);
    setError(null);

    try {
      const nextAnalytics = await getAnalyticsApi(eventId);
      setAnalytics(nextAnalytics);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar analitica";
      setError(message);
      setAnalytics(null);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  const registerAssistance = useCallback(
    async ({ matricula, eventId, type }: {
      matricula: string;
      eventId: number;
      type: AssistanceType;
    }) => {
      setError(null);
      const result = await registerAssistanceApi({ matricula, eventId, type });

      if (result.success) {
        await refreshAnalytics(eventId);
      }

      return result;
    },
    [refreshAnalytics]
  );

  const clearAnalytics = useCallback(() => {
    setAnalytics(null);
    setError(null);
  }, []);

  return {
    analytics,
    isLoadingAnalytics,
    error,
    registerAssistance,
    refreshAnalytics,
    clearAnalytics,
  };
}
