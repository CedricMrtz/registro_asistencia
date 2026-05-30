import {
	ReportAttendanceRow,
	ReportData,
	ReportStudentRow,
} from "./types";
import { formatDate, formatDuration } from "./report.utils";

interface ReportAsistenciaSectionProps {
	selectedSimposiumId: number;
	reportData: ReportData;
}

function SummaryCard({
	title,
	value,
	description,
}: {
	title: string;
	value: string | number;
	description: string;
}) {
	return (
		<article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
			<p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
				{title}
			</p>
			<p className="mt-3 text-3xl font-semibold text-stone-900">{value}</p>
			<p className="mt-1 text-sm text-stone-500">{description}</p>
		</article>
	);
}

function StudentTable({ students }: { students: ReportStudentRow[] }) {
	return (
		<div className="overflow-x-auto rounded-2xl border border-stone-200">
			<table className="min-w-full divide-y divide-stone-200 text-sm">
				<thead className="bg-stone-50 text-stone-600">
					<tr>
						<th className="px-4 py-3 text-left font-medium">Matrícula</th>
						<th className="px-4 py-3 text-left font-medium">Nombre</th>
						<th className="px-4 py-3 text-left font-medium">Carrera</th>
						<th className="px-4 py-3 text-left font-medium">Escuela</th>
						<th className="px-4 py-3 text-left font-medium">Ciudad</th>
						<th className="px-4 py-3 text-left font-medium">Semestre</th>
						<th className="px-4 py-3 text-left font-medium">Correo</th>
						<th className="px-4 py-3 text-left font-medium">Teléfono</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-stone-100 bg-white text-stone-700">
					{students.length > 0 ? (
						students.map((student) => (
							<tr key={student.matricula}>
								<td className="px-4 py-3 font-medium text-stone-900">{student.matricula}</td>
								<td className="px-4 py-3">{student.nombre}</td>
								<td className="px-4 py-3">
									{student.nombre_carrera} ({student.siglas})
								</td>
								<td className="px-4 py-3">{student.nombre_escuela}</td>
								<td className="px-4 py-3">{student.ciudad}</td>
								<td className="px-4 py-3">{student.semestre}</td>
								<td className="px-4 py-3">{student.email ?? "-"}</td>
								<td className="px-4 py-3">{student.telefono ?? "-"}</td>
							</tr>
						))
					) : (
						<tr>
							<td className="px-4 py-6 text-center text-stone-500" colSpan={8}>
								No hay alumnos inscritos para este simposium.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

function AttendanceTable({ attendance }: { attendance: ReportAttendanceRow[] }) {
	return (
		<div className="overflow-x-auto rounded-2xl border border-stone-200">
			<table className="min-w-full divide-y divide-stone-200 text-sm">
				<thead className="bg-stone-50 text-stone-600">
					<tr>
						<th className="px-4 py-3 text-left font-medium">ID</th>
						<th className="px-4 py-3 text-left font-medium">Matrícula</th>
						<th className="px-4 py-3 text-left font-medium">Evento</th>
						<th className="px-4 py-3 text-left font-medium">Llegada</th>
						<th className="px-4 py-3 text-left font-medium">Salida</th>
						<th className="px-4 py-3 text-left font-medium">Staff</th>
						<th className="px-4 py-3 text-left font-medium">Minutos</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-stone-100 bg-white text-stone-700">
					{attendance.length > 0 ? (
						attendance.map((record) => (
							<tr key={record.idAsistencia}>
								<td className="px-4 py-3 font-medium text-stone-900">{record.idAsistencia}</td>
								<td className="px-4 py-3">{record.matricula}</td>
								<td className="px-4 py-3">
									{record.nombreEvento} <span className="text-stone-400">#{record.idEvento}</span>
								</td>
								<td className="px-4 py-3">{formatDate(record.fecha_llegada)}</td>
								<td className="px-4 py-3">{formatDate(record.fecha_salida)}</td>
								<td className="px-4 py-3">{record.staffID ?? "-"}</td>
								<td className="px-4 py-3">{formatDuration(record.minutos_asistido)}</td>
							</tr>
						))
					) : (
						<tr>
							<td className="px-4 py-6 text-center text-stone-500" colSpan={7}>
								No hay asistencias registradas para este simposium.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

function EventsTable({ events }: { events: ReportData["events"] }) {
	return (
		<div className="overflow-x-auto rounded-2xl border border-stone-200">
			<table className="min-w-full divide-y divide-stone-200 text-sm">
				<thead className="bg-stone-50 text-stone-600">
					<tr>
						<th className="px-4 py-3 text-left font-medium">ID</th>
						<th className="px-4 py-3 text-left font-medium">Nombre</th>
						<th className="px-4 py-3 text-left font-medium">Tipo</th>
						<th className="px-4 py-3 text-left font-medium">Inicio</th>
						<th className="px-4 py-3 text-left font-medium">Fin</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-stone-100 bg-white text-stone-700">
					{events.length > 0 ? (
						events.map((event) => (
							<tr key={event.idEvento}>
								<td className="px-4 py-3 font-medium text-stone-900">{event.idEvento}</td>
								<td className="px-4 py-3">{event.nombreEvento}</td>
								<td className="px-4 py-3">{event.nombreTipo}</td>
								<td className="px-4 py-3">{formatDate(event.fecha_comienzo)}</td>
								<td className="px-4 py-3">{formatDate(event.fecha_acabado)}</td>
							</tr>
						))
					) : (
						<tr>
							<td className="px-4 py-6 text-center text-stone-500" colSpan={5}>
								No hay eventos asociados a este simposium.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

export function ReportAsistenciaSection({
	selectedSimposiumId,
	reportData,
}: ReportAsistenciaSectionProps) {
	const selectedStudents = reportData.students;
	const selectedAttendance = reportData.attendance;
	const selectedEvents = reportData.events;
	const totalMinutes = selectedAttendance.reduce(
		(sum, row) => sum + (row.minutos_asistido ?? 0),
		0
	);
	const averageMinutes =
		selectedAttendance.length > 0 ? Math.round(totalMinutes / selectedAttendance.length) : 0;

	return (
		<>
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<SummaryCard title="Alumnos" value={selectedStudents.length} description="Inscritos al simposium" />
				<SummaryCard title="Eventos" value={selectedEvents.length} description="Eventos asociados" />
				<SummaryCard title="Asistencias" value={selectedAttendance.length} description="Registros capturados" />
				<SummaryCard title="Promedio" value={`${averageMinutes} min`} description="Tiempo asistido promedio" />
			</section>

			<section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-5">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
							Encabezado del reporte
						</p>
						<h2 className="mt-2 text-2xl font-semibold text-stone-900">
							{reportData.simposium?.nombre ?? `Simposium ${selectedSimposiumId}`}
						</h2>
					</div>
					<div className="text-sm text-stone-500 sm:text-right">
						<p>ID: {selectedSimposiumId}</p>
						{reportData.simposium ? (
							<p>
								{formatDate(reportData.simposium.fecha_comienzo)} - {formatDate(reportData.simposium.fecha_acabado)}
							</p>
						) : null}
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<div className="rounded-2xl bg-stone-50 p-4">
						<p className="text-xs uppercase tracking-[0.2em] text-stone-400">Capacidad</p>
						<p className="mt-2 text-lg font-semibold text-stone-900">
							{reportData.simposium?.capacidad_asistentes ?? "-"}
						</p>
					</div>
					<div className="rounded-2xl bg-stone-50 p-4">
						<p className="text-xs uppercase tracking-[0.2em] text-stone-400">Alumnos con correo</p>
						<p className="mt-2 text-lg font-semibold text-stone-900">
							{selectedStudents.filter((student) => Boolean(student.email)).length}
						</p>
					</div>
					<div className="rounded-2xl bg-stone-50 p-4">
						<p className="text-xs uppercase tracking-[0.2em] text-stone-400">Tiempo total asistido</p>
						<p className="mt-2 text-lg font-semibold text-stone-900">{totalMinutes} min</p>
					</div>
				</div>
			</section>

			<section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
						Primer conjunto del stored procedure
					</p>
					<h2 className="mt-2 text-xl font-semibold text-stone-900">Alumnos inscritos</h2>
				</div>

				<StudentTable students={selectedStudents} />
			</section>

			<section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
						Segundo conjunto del stored procedure
					</p>
					<h2 className="mt-2 text-xl font-semibold text-stone-900">Asistencias registradas</h2>
				</div>

				<AttendanceTable attendance={selectedAttendance} />
			</section>

			<section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
						Tercer conjunto del stored procedure
					</p>
					<h2 className="mt-2 text-xl font-semibold text-stone-900">Eventos del simposium</h2>
				</div>

				<EventsTable events={selectedEvents} />
			</section>
		</>
	);
}
