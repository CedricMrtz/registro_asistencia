export type ReportTab = "asistencia" | "cumplimiento";

export interface ReportStudentRow {
	matricula: string;
	nombre: string;
	telefono: string | null;
	semestre: number;
	email: string | null;
	nombre_carrera: string;
	siglas: string;
	nombre_escuela: string;
	ciudad: string;
}

export interface ReportAttendanceRow {
	idAsistencia: number;
	matricula: string;
	idEvento: number;
	nombreEvento: string;
	fecha_llegada: Date | null;
	fecha_salida: Date | null;
	staffID: number | null;
	minutos_asistido: number | null;
}

export interface ReportEventRow {
	idEvento: number;
	nombreEvento: string;
	fecha_comienzo: Date;
	fecha_acabado: Date;
	idSimposium: number;
	nombreTipo: string;
}

export interface SimposiumHeader {
	idSimposium: number;
	nombre: string;
	fecha_comienzo: Date;
	fecha_acabado: Date;
	capacidad_asistentes: number;
}

export interface ReportData {
	simposium: SimposiumHeader | null;
	students: ReportStudentRow[];
	attendance: ReportAttendanceRow[];
	events: ReportEventRow[];
}

export interface ReportComplianceRow {
	matricula: string;
	idEvento: number;
	nombreEvento: string;
	fecha_comienzo: Date;
	fecha_acabado: Date;
	duracion_evento_min: number;
	minutos_asistido: number | null;
	porcentaje_asistencia: number;
}

export interface ComplianceReportData {
	simposium: SimposiumHeader | null;
	students: ReportStudentRow[];
	compliance: ReportComplianceRow[];
	events: ReportEventRow[];
}
