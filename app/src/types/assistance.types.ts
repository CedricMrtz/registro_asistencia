export interface AssistanceResult {
  success: boolean;
  matricula: string;
  studentName?: string;
  reason?: string;
}

export type AssistanceType = "Entrada" | "Salida";

export interface AssistanceAnalytics {
  entradas: number;
  salidas: number;
  total?: number;
}

export interface AssistanceFeedback extends AssistanceResult {
  type: AssistanceType;
}
