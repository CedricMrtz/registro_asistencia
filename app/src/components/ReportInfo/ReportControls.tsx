import Link from "next/link";
import { DownloadPdfBtn } from "./DownloadPdfBtn";
import { buildReportHref } from "./report.utils";
import { ReportTab, SimposiumHeader } from "./types";

interface ReportControlsProps {
	simposiums: SimposiumHeader[];
	selectedSimposiumId: number | null;
	selectedTab: ReportTab;
}

export function ReportControls({
	simposiums,
	selectedSimposiumId,
	selectedTab,
}: ReportControlsProps) {
	return (
		<section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm no-print">
			<form method="get" className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
				<input type="hidden" name="tab" value={selectedTab} />
				<label className="space-y-2">
					<span className="text-sm font-medium text-stone-700">Simposium</span>
					<select
						name="idSimposium"
						defaultValue={selectedSimposiumId ?? ""}
						className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 outline-none transition focus:border-stone-400"
					>
						<option value="" disabled>
							Selecciona un simposium
						</option>
						{simposiums.map((simposium) => (
							<option key={simposium.idSimposium} value={simposium.idSimposium}>
								{simposium.idSimposium} - {simposium.nombre}
							</option>
						))}
					</select>
				</label>

				<button
					type="submit"
					className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-500"
				>
					Generar reporte
				</button>
			</form>

			<p className="mt-3 text-xs text-stone-500">
				El formulario envía `idSimposium` por query string para cargar el reporte en el servidor sin depender de estados locales.
			</p>

			<div className="mt-5 flex flex-wrap gap-2">
				<Link
					href={buildReportHref("asistencia", selectedSimposiumId)}
					className={`rounded-full px-4 py-2 text-sm font-medium transition ${
						selectedTab === "asistencia"
							? "bg-stone-900 text-white"
							: "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
					}`}
				>
					Reporte de asistencia
				</Link>
				<Link
					href={buildReportHref("cumplimiento", selectedSimposiumId)}
					className={`rounded-full px-4 py-2 text-sm font-medium transition ${
						selectedTab === "cumplimiento"
							? "bg-stone-900 text-white"
							: "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
					}`}
				>
					Reporte de cumplimiento
				</Link>
				<DownloadPdfBtn />
			</div>
		</section>
	);
}
