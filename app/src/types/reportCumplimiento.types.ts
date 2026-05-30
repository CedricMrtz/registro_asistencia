export interface StudentCumplimientoRow {
  matricula: string;
  nombre: string;
  telefono: string | null;
  semestre: number | null;
  email: string | null;
  nombre_carrera: string;
  siglas: string;
  nombre_escuela: string;
  ciudad: string;
}

export interface CumplimientoEventoRow {
  matricula: string;
  idEvento: number;
  nombreEvento: string;
  fecha_comienzo: Date;
  fecha_acabado: Date;
  duracion_evento_min: number;
  minutos_asistido: number;
  porcentaje_asistencia: number;
}

export interface SimposiumCumplimientoEventRow {
  idEvento: number;
  nombreEvento: string;
  fecha_comienzo: Date;
  fecha_acabado: Date;
  nombreTipo: string;
}

export interface DatosCumplimientoResult {
  alumnosInscritos: StudentCumplimientoRow[];
  cumplimientoPorEvento: CumplimientoEventoRow[];
  eventosDelSimposium: SimposiumCumplimientoEventRow[];
}
