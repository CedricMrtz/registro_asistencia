import { ReportTab } from "./types";

type SearchParamsValue = string | string[] | undefined;

export function buildReportHref(tab: ReportTab, idSimposium: number | null): string {
	const searchParams = new URLSearchParams();
	searchParams.set("tab", tab);

	if (idSimposium !== null) {
		searchParams.set("idSimposium", String(idSimposium));
	}

	return `/report?${searchParams.toString()}`;
}

export function formatDate(value: Date | null | undefined): string {
	if (!value) {
		return "-";
	}

	return new Intl.DateTimeFormat("es-MX", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(value);
}

export function formatDuration(minutes: number | null | undefined): string {
	if (minutes === null || minutes === undefined) {
		return "-";
	}

	return `${minutes} min`;
}

export function parseSimposiumId(value: SearchParamsValue): number | null {
	const rawValue = Array.isArray(value) ? value[0] : value;
	if (!rawValue) {
		return null;
	}

	const parsed = Number(rawValue);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function parseReportTab(value: SearchParamsValue): ReportTab {
	const rawValue = Array.isArray(value) ? value[0] : value;
	return rawValue === "cumplimiento" ? "cumplimiento" : "asistencia";
}
