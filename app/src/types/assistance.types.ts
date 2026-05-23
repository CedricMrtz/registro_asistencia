export interface AssistanceResult {
  success: boolean;
  matricula: string;
  studentName?: string;
  reason?: string;
}

export type AssistanceType = "Entrada" | "Salida";
