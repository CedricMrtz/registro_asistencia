import sql from "mssql";
import { sqlPool } from "@/lib/prisma";
import type {
	ComplianceReportData,
	ReportAttendanceRow,
	ReportComplianceRow,
	ReportData,
	ReportEventRow,
	ReportStudentRow,
	SimposiumHeader,
} from "@/components/ReportInfo/Index";

type ReportProcedureResult = {
	recordsets: Array<Array<unknown>>;
};

function toSimposiumHeader(rows: Array<Record<string, unknown>>): SimposiumHeader | null {
	const row = rows[0];
	if (!row) {
		return null;
	}

	return {
		idSimposium: Number(row.idSimposium),
		nombre: String(row.nombre ?? ""),
		fecha_comienzo: new Date(String(row.fecha_comienzo)),
		fecha_acabado: new Date(String(row.fecha_acabado)),
		capacidad_asistentes: Number(row.capacidad_asistentes ?? 0),
	};
}

function toStudents(rows: Array<Record<string, unknown>>): ReportStudentRow[] {
	return rows.map((row) => ({
		matricula: String(row.matricula ?? ""),
		nombre: String(row.nombre ?? ""),
		telefono: row.telefono === null || row.telefono === undefined ? null : String(row.telefono),
		semestre: Number(row.semestre ?? 0),
		email: row.email === null || row.email === undefined ? null : String(row.email),
		nombre_carrera: String(row.nombre_carrera ?? ""),
		siglas: String(row.siglas ?? ""),
		nombre_escuela: String(row.nombre_escuela ?? ""),
		ciudad: String(row.ciudad ?? ""),
	}));
}

function toAttendance(rows: Array<Record<string, unknown>>): ReportAttendanceRow[] {
	return rows.map((row) => ({
		idAsistencia: Number(row.idAsistencia ?? 0),
		matricula: String(row.matricula ?? ""),
		idEvento: Number(row.idEvento ?? 0),
		nombreEvento: String(row.nombreEvento ?? ""),
		fecha_llegada: row.fecha_llegada ? new Date(String(row.fecha_llegada)) : null,
		fecha_salida: row.fecha_salida ? new Date(String(row.fecha_salida)) : null,
		staffID: row.staffID === null || row.staffID === undefined ? null : Number(row.staffID),
		minutos_asistido:
			row.minutos_asistido === null || row.minutos_asistido === undefined
				? null
				: Number(row.minutos_asistido),
	}));
}

function toEvents(rows: Array<Record<string, unknown>>): ReportEventRow[] {
	return rows.map((row) => ({
		idEvento: Number(row.idEvento ?? 0),
		nombreEvento: String(row.nombreEvento ?? ""),
		fecha_comienzo: new Date(String(row.fecha_comienzo)),
		fecha_acabado: new Date(String(row.fecha_acabado)),
		idSimposium: Number(row.idSimposium ?? 0),
		nombreTipo: String(row.nombreTipo ?? ""),
	}));
}

function toCompliance(rows: Array<Record<string, unknown>>): ReportComplianceRow[] {
	return rows.map((row) => ({
		matricula: String(row.matricula ?? ""),
		idEvento: Number(row.idEvento ?? 0),
		nombreEvento: String(row.nombreEvento ?? ""),
		fecha_comienzo: new Date(String(row.fecha_comienzo)),
		fecha_acabado: new Date(String(row.fecha_acabado)),
		duracion_evento_min: Number(row.duracion_evento_min ?? 0),
		minutos_asistido:
			row.minutos_asistido === null || row.minutos_asistido === undefined
				? null
				: Number(row.minutos_asistido),
		porcentaje_asistencia: Number(row.porcentaje_asistencia ?? 0),
	}));
}

async function executeReportProcedure(
	procedureName: string,
	idSimposium: number
): Promise<ReportProcedureResult> {
	const pool = await sqlPool.connect();
	const result = (await pool
		.request()
		.input("idSimposium", sql.Int, idSimposium)
		.execute(procedureName)) as ReportProcedureResult;

	return result;
}

export async function getAttendanceReportData(idSimposium: number): Promise<ReportData> {
	const result = await executeReportProcedure("sp_GetDatosAsistencia", idSimposium);
	const [studentsRaw = [], attendanceRaw = [], eventsRaw = []] = result.recordsets as [
		Array<Record<string, unknown>>,
		Array<Record<string, unknown>>,
		Array<Record<string, unknown>>,
	];

	return {
		simposium: null,
		students: toStudents(studentsRaw),
		attendance: toAttendance(attendanceRaw),
		events: toEvents(eventsRaw),
	};
}

export async function getComplianceReportData(
	idSimposium: number
): Promise<ComplianceReportData> {
	const result = await executeReportProcedure("sp_GetDatosCumplimiento", idSimposium);
	const [studentsRaw = [], complianceRaw = [], eventsRaw = []] = result.recordsets as [
		Array<Record<string, unknown>>,
		Array<Record<string, unknown>>,
		Array<Record<string, unknown>>,
	];

	return {
		simposium: null,
		students: toStudents(studentsRaw),
		compliance: toCompliance(complianceRaw),
		events: toEvents(eventsRaw),
	};
}
