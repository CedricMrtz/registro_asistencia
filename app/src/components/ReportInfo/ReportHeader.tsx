import Link from "next/link";
import { ReportTab } from "./types";

interface ReportHeaderProps {
	selectedTab: ReportTab;
}

export function ReportHeader({ selectedTab }: ReportHeaderProps) {
	return (
		<header className="rounded-3xl border border-stone-200/80 bg-white/90 p-8 shadow-sm backdrop-blur no-print">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div className="space-y-3">
					<p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-400">
						Reporte de Simposium
					</p>
					<h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
						{selectedTab === "asistencia"
							? "Consulta de asistencia por simposium"
							: "Consulta de cumplimiento por simposium"}
					</h1>
					<p className="max-w-2xl text-sm leading-6 text-stone-500">
						{selectedTab === "asistencia"
							? "Esta vista usa el parámetro `idSimposium` como la función principal del reporte y reproduce los tres conjuntos de datos del primer stored procedure."
							: "Esta vista usa el parámetro `idSimposium` como la función principal del reporte y reproduce los tres conjuntos de datos del segundo stored procedure, enfocándose en el cumplimiento por evento."}
					</p>
				</div>

				<Link
					href="/dashboard"
					className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-stone-900 px-5 text-sm font-medium text-white transition hover:bg-stone-700"
				>
					Volver al panel
				</Link>
			</div>
		</header>
	);
}
