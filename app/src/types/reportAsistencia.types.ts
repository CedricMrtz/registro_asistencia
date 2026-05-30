export interface StudentAttendanceRow {
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

export interface EventAttendanceRow {
  idAsistencia: number;
  matricula: string;
  idEvento: number;
  nombreEvento: string;
  fecha_llegada: Date;
  fecha_salida: Date | null;
  staffID: number | null;
  minutos_asistido: number;
}

export interface SimposiumEventRow {
  idEvento: number;
  nombreEvento: string;
  fecha_comienzo: Date;
  fecha_acabado: Date;
  idSimposium: number;
  nombreTipo: string;
}

export interface DatosAsistenciaResult {
  alumnosInscritos: StudentAttendanceRow[];
  asistenciasPorEvento: EventAttendanceRow[];
  eventosDelSimposium: SimposiumEventRow[];
}
