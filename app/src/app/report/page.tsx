"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatosAsistenciaResult } from "@/types/reportAsistencia.types";
import { DatosCumplimientoResult } from "@/types/reportCumplimiento.types";

type TabKey = "sp1" | "sp2";

type PdfDoc = jsPDF & {
	lastAutoTable?: {
		finalY?: number;
	};
};

function formatDisplayValue(value: string | number | Date | null | undefined): string {
	if (value === null || value === undefined || value === "") {
		return "-";
	}

	if (value instanceof Date) {
		return value.toLocaleString("es-MX");
	}

	if (typeof value === "string") {
		const parsedDate = new Date(value);
		if (!Number.isNaN(parsedDate.getTime()) && value.includes("T")) {
			return parsedDate.toLocaleString("es-MX");
		}
	}

	return String(value);
}

export default function ReportPage() {
	const [activeTab, setActiveTab] = useState<TabKey>("sp1");
	const [idSimposiumInput, setIdSimposiumInput] = useState("1");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [asistenciaData, setAsistenciaData] =
		useState<DatosAsistenciaResult | null>(null);
	const [cumplimientoData, setCumplimientoData] =
		useState<DatosCumplimientoResult | null>(null);

	const idSimposium = useMemo(() => Number(idSimposiumInput), [idSimposiumInput]);

	async function cargarReportes() {
		if (!Number.isInteger(idSimposium)) {
			setError("El idSimposium debe ser un numero entero");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const [asistenciaRes, cumplimientoRes] = await Promise.all([
				fetch(`/api/report/asistencia?idSimposium=${idSimposium}`),
				fetch(`/api/report/cumplimiento?idSimposium=${idSimposium}`),
			]);

			if (!asistenciaRes.ok || !cumplimientoRes.ok) {
				throw new Error("No se pudieron cargar los reportes");
			}

			const asistenciaJson = (await asistenciaRes.json()) as DatosAsistenciaResult;
			const cumplimientoJson =
				(await cumplimientoRes.json()) as DatosCumplimientoResult;

			setAsistenciaData(asistenciaJson);
			setCumplimientoData(cumplimientoJson);
		} catch (e) {
			const message = e instanceof Error ? e.message : "Error inesperado";
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	function addTable(doc: PdfDoc, head: string[][], body: (string | number | boolean | null)[][]) {
		autoTable(doc, {
			startY: doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : 22,
			head,
			body,
			styles: { fontSize: 8 },
			headStyles: { fillColor: [17, 24, 39] },
		});
	}

	function descargarPdf() {
		const doc = new jsPDF() as PdfDoc;

		if (activeTab === "sp1") {
			if (!asistenciaData) {
				setError("Primero carga el reporte del SP1");
				return;
			}

			doc.text(`Reporte SP1 - Asistencia (Simposium ${idSimposiumInput})`, 14, 14);

			autoTable(doc, {
				startY: 22,
				head: [["Matricula", "Nombre", "Telefono", "Semestre", "Email", "Carrera", "Siglas", "Escuela", "Ciudad"]],
				body: asistenciaData.alumnosInscritos.map((row) => [
					row.matricula,
					row.nombre,
					formatDisplayValue(row.telefono),
					formatDisplayValue(row.semestre),
					formatDisplayValue(row.email),
					row.nombre_carrera,
					row.siglas,
					row.nombre_escuela,
					row.ciudad,
				]),
			});

			autoTable(doc, {
				startY: doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : 100,
				head: [["ID Asistencia", "Matricula", "ID Evento", "Evento", "Llegada", "Salida", "Staff", "Minutos"]],
				body: asistenciaData.asistenciasPorEvento.map((row) => [
					row.idAsistencia,
					row.matricula,
					row.idEvento,
					row.nombreEvento,
					formatDisplayValue(row.fecha_llegada),
					formatDisplayValue(row.fecha_salida),
					formatDisplayValue(row.staffID),
					row.minutos_asistido,
				]),
			});

			autoTable(doc, {
				startY: doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : 100,
				head: [["ID Evento", "Nombre", "Inicio", "Fin", "ID Simposium", "Tipo"]],
				body: asistenciaData.eventosDelSimposium.map((row) => [
					row.idEvento,
					row.nombreEvento,
					formatDisplayValue(row.fecha_comienzo),
					formatDisplayValue(row.fecha_acabado),
					row.idSimposium,
					row.nombreTipo,
				]),
			});

			doc.save(`reporte_sp1_simposium_${idSimposiumInput}.pdf`);
			return;
		}

		if (!cumplimientoData) {
			setError("Primero carga el reporte del SP2");
			return;
		}

		doc.text(`Reporte SP2 - Cumplimiento (Simposium ${idSimposiumInput})`, 14, 14);

		autoTable(doc, {
			startY: 22,
			head: [["Matricula", "Nombre", "Telefono", "Semestre", "Email", "Carrera", "Siglas", "Escuela", "Ciudad"]],
			body: cumplimientoData.alumnosInscritos.map((row) => [
				row.matricula,
				row.nombre,
				formatDisplayValue(row.telefono),
				formatDisplayValue(row.semestre),
				formatDisplayValue(row.email),
				row.nombre_carrera,
				row.siglas,
				row.nombre_escuela,
				row.ciudad,
			]),
		});

		autoTable(doc, {
			startY: doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : 100,
			head: [["Matricula", "ID Evento", "Evento", "Inicio", "Fin", "Duracion", "Minutos", "% Asistencia"]],
			body: cumplimientoData.cumplimientoPorEvento.map((row) => [
				row.matricula,
				row.idEvento,
				row.nombreEvento,
				formatDisplayValue(row.fecha_comienzo),
				formatDisplayValue(row.fecha_acabado),
				row.duracion_evento_min,
				row.minutos_asistido,
				row.porcentaje_asistencia,
			]),
		});

		autoTable(doc, {
			startY: doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : 100,
			head: [["ID Evento", "Nombre", "Inicio", "Fin", "ID Simposium", "Tipo"]],
			body: cumplimientoData.eventosDelSimposium.map((row) => [
				row.idEvento,
				row.nombreEvento,
				formatDisplayValue(row.fecha_comienzo),
				formatDisplayValue(row.fecha_acabado),
				row.idSimposium,
				row.nombreTipo,
			]),
		});

		doc.save(`reporte_sp2_simposium_${idSimposiumInput}.pdf`);
	}

	return (
		<main className="mx-auto max-w-6xl px-4 py-8">
			<h1 className="mb-4 text-2xl font-semibold">Reportes</h1>

			<section className="mb-6 rounded border border-gray-300 p-4">
				<div className="flex flex-wrap items-end gap-3">
					<div>
						<label className="mb-1 block text-sm font-medium" htmlFor="idSimposium">
							idSimposium
						</label>
						<input
							id="idSimposium"
							type="number"
							min={1}
							className="w-40 rounded border border-gray-400 px-3 py-2"
							value={idSimposiumInput}
							onChange={(e) => setIdSimposiumInput(e.target.value)}
						/>
					</div>

					<button
						onClick={cargarReportes}
						className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
						disabled={loading}
					>
						{loading ? "Cargando..." : "Cargar reportes"}
					</button>

					<button
						onClick={descargarPdf}
						className="rounded border border-black px-4 py-2"
					>
						Descargar PDF
					</button>
				</div>

				{error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
			</section>

			<section className="mb-4 flex gap-2">
				<button
					onClick={() => setActiveTab("sp1")}
					className={`rounded px-3 py-2 text-sm ${
						activeTab === "sp1"
							? "bg-blue-600 text-white"
							: "border border-blue-600 text-blue-700"
					}`}
				>
					Asistencia
				</button>
				<button
					onClick={() => setActiveTab("sp2")}
					className={`rounded px-3 py-2 text-sm ${
						activeTab === "sp2"
							? "bg-emerald-600 text-white"
							: "border border-emerald-600 text-emerald-700"
					}`}
				>
					Cumplimiento
				</button>
			</section>

			{activeTab === "sp1" ? (
				<section className="space-y-5">
					<div className="rounded border border-blue-200 p-4">
						<h2 className="mb-2 font-medium text-blue-800">Alumnos inscritos</h2>
						<div className="overflow-auto">
							<table className="min-w-full border-collapse text-sm">
								<thead>
									<tr className="bg-blue-50">
										<th className="border px-2 py-1 text-left">Matricula</th>
										<th className="border px-2 py-1 text-left">Nombre</th>
										<th className="border px-2 py-1 text-left">Telefono</th>
										<th className="border px-2 py-1 text-left">Semestre</th>
										<th className="border px-2 py-1 text-left">Email</th>
										<th className="border px-2 py-1 text-left">Carrera</th>
										<th className="border px-2 py-1 text-left">Siglas</th>
										<th className="border px-2 py-1 text-left">Escuela</th>
										<th className="border px-2 py-1 text-left">Ciudad</th>
									</tr>
								</thead>
								<tbody>
									{(asistenciaData?.alumnosInscritos ?? []).map((row) => (
										<tr key={`${row.matricula}-${row.nombre}`}>
											<td className="border px-2 py-1">{row.matricula}</td>
											<td className="border px-2 py-1">{row.nombre}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.telefono)}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.semestre)}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.email)}</td>
											<td className="border px-2 py-1">{row.nombre_carrera}</td>
											<td className="border px-2 py-1">{row.siglas}</td>
											<td className="border px-2 py-1">{row.nombre_escuela}</td>
											<td className="border px-2 py-1">{row.ciudad}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="rounded border border-blue-200 p-4">
						<h2 className="mb-2 font-medium text-blue-800">Asistencias</h2>
						<div className="overflow-auto">
							<table className="min-w-full border-collapse text-sm">
								<thead>
									<tr className="bg-blue-50">
										<th className="border px-2 py-1 text-left">ID Asistencia</th>
										<th className="border px-2 py-1 text-left">Matricula</th>
										<th className="border px-2 py-1 text-left">ID Evento</th>
										<th className="border px-2 py-1 text-left">Evento</th>
										<th className="border px-2 py-1 text-left">Llegada</th>
										<th className="border px-2 py-1 text-left">Salida</th>
										<th className="border px-2 py-1 text-left">Staff</th>
										<th className="border px-2 py-1 text-left">Minutos asistido</th>
									</tr>
								</thead>
								<tbody>
									{(asistenciaData?.asistenciasPorEvento ?? []).map((row) => (
										<tr key={`${row.idAsistencia}-${row.matricula}`}>
											<td className="border px-2 py-1">{row.idAsistencia}</td>
											<td className="border px-2 py-1">{row.matricula}</td>
											<td className="border px-2 py-1">{row.idEvento}</td>
											<td className="border px-2 py-1">{row.nombreEvento}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.fecha_llegada)}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.fecha_salida)}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.staffID)}</td>
											<td className="border px-2 py-1">{row.minutos_asistido}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="rounded border border-blue-200 p-4">
						<h2 className="mb-2 font-medium text-blue-800">Eventos</h2>
						<div className="overflow-auto">
							<table className="min-w-full border-collapse text-sm">
								<thead>
									<tr className="bg-blue-50">
										<th className="border px-2 py-1 text-left">ID Evento</th>
										<th className="border px-2 py-1 text-left">Nombre</th>
										<th className="border px-2 py-1 text-left">Inicio</th>
										<th className="border px-2 py-1 text-left">Fin</th>
										<th className="border px-2 py-1 text-left">ID Simposium</th>
										<th className="border px-2 py-1 text-left">Tipo</th>
									</tr>
								</thead>
								<tbody>
									{(asistenciaData?.eventosDelSimposium ?? []).map((row) => (
										<tr key={row.idEvento}>
											<td className="border px-2 py-1">{row.idEvento}</td>
											<td className="border px-2 py-1">{row.nombreEvento}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.fecha_comienzo)}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.fecha_acabado)}</td>
											<td className="border px-2 py-1">{row.idSimposium}</td>
											<td className="border px-2 py-1">{row.nombreTipo}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			) : (
				<section className="space-y-5">
					<div className="rounded border border-emerald-200 p-4">
						<h2 className="mb-2 font-medium text-emerald-800">Alumnos</h2>
						<div className="overflow-auto">
							<table className="min-w-full border-collapse text-sm">
								<thead>
									<tr className="bg-emerald-50">
										<th className="border px-2 py-1 text-left">Matricula</th>
										<th className="border px-2 py-1 text-left">Nombre</th>
										<th className="border px-2 py-1 text-left">Telefono</th>
										<th className="border px-2 py-1 text-left">Semestre</th>
										<th className="border px-2 py-1 text-left">Email</th>
										<th className="border px-2 py-1 text-left">Carrera</th>
										<th className="border px-2 py-1 text-left">Siglas</th>
										<th className="border px-2 py-1 text-left">Escuela</th>
										<th className="border px-2 py-1 text-left">Ciudad</th>
									</tr>
								</thead>
								<tbody>
									{(cumplimientoData?.alumnosInscritos ?? []).map((row) => (
										<tr key={`${row.matricula}-${row.nombre}`}>
											<td className="border px-2 py-1">{row.matricula}</td>
											<td className="border px-2 py-1">{row.nombre}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.telefono)}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.semestre)}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.email)}</td>
											<td className="border px-2 py-1">{row.nombre_carrera}</td>
											<td className="border px-2 py-1">{row.siglas}</td>
											<td className="border px-2 py-1">{row.nombre_escuela}</td>
											<td className="border px-2 py-1">{row.ciudad}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="rounded border border-emerald-200 p-4">
						<h2 className="mb-2 font-medium text-emerald-800">Cumplimiento por evento</h2>
						<div className="overflow-auto">
							<table className="min-w-full border-collapse text-sm">
								<thead>
									<tr className="bg-emerald-50">
										<th className="border px-2 py-1 text-left">Matricula</th>
										<th className="border px-2 py-1 text-left">ID Evento</th>
										<th className="border px-2 py-1 text-left">Evento</th>
										<th className="border px-2 py-1 text-left">Inicio</th>
										<th className="border px-2 py-1 text-left">Fin</th>
										<th className="border px-2 py-1 text-left">Duracion</th>
										<th className="border px-2 py-1 text-left">Minutos asistido</th>
										<th className="border px-2 py-1 text-left">Asistencia (%)</th>
									</tr>
								</thead>
								<tbody>
									{(cumplimientoData?.cumplimientoPorEvento ?? []).map((row) => (
										<tr key={`${row.matricula}-${row.idEvento}`}>
											<td className="border px-2 py-1">{row.matricula}</td>
											<td className="border px-2 py-1">{row.idEvento}</td>
											<td className="border px-2 py-1">{row.nombreEvento}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.fecha_comienzo)}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.fecha_acabado)}</td>
											<td className="border px-2 py-1">{row.duracion_evento_min}</td>
											<td className="border px-2 py-1">{row.minutos_asistido}</td>
											<td className="border px-2 py-1">{row.porcentaje_asistencia}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="rounded border border-emerald-200 p-4">
						<h2 className="mb-2 font-medium text-emerald-800">Eventos</h2>
						<div className="overflow-auto">
							<table className="min-w-full border-collapse text-sm">
								<thead>
									<tr className="bg-emerald-50">
										<th className="border px-2 py-1 text-left">ID Evento</th>
										<th className="border px-2 py-1 text-left">Nombre</th>
										<th className="border px-2 py-1 text-left">Inicio</th>
										<th className="border px-2 py-1 text-left">Fin</th>
										<th className="border px-2 py-1 text-left">ID Simposium</th>
										<th className="border px-2 py-1 text-left">Tipo</th>
									</tr>
								</thead>
								<tbody>
									{(cumplimientoData?.eventosDelSimposium ?? []).map((row) => (
										<tr key={row.idEvento}>
											<td className="border px-2 py-1">{row.idEvento}</td>
											<td className="border px-2 py-1">{row.nombreEvento}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.fecha_comienzo)}</td>
											<td className="border px-2 py-1">{formatDisplayValue(row.fecha_acabado)}</td>
											<td className="border px-2 py-1">{row.idSimposium}</td>
											<td className="border px-2 py-1">{row.nombreTipo}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			)}
		</main>
	);
}
