import { getSimposiums } from "@/services/simposium.service";
import {
	getAttendanceReportData,
	getComplianceReportData,
} from "@/services/report.service";
import {
	ComplianceReportData,
	ReportAsistenciaSection,
	ReportComplianceSection,
	ReportControls,
	ReportEmptyState,
	ReportHeader,
	ReportData,
	ReportTab,
	parseReportTab,
	parseSimposiumId,
} from "@/components/ReportInfo/Index";

type SearchParamsValue = string | string[] | undefined;
type SearchParamsInput =
	| Record<string, SearchParamsValue>
	| Promise<Record<string, SearchParamsValue>>;

export default async function ReportPage({
	searchParams,
}: {
	searchParams?: SearchParamsInput;
}) {
	const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
	const selectedSimposiumId = parseSimposiumId(resolvedSearchParams.idSimposium);
	const selectedTab = parseReportTab(resolvedSearchParams.tab) as ReportTab;
	const simposiums = await getSimposiums();
	const reportData =
		selectedSimposiumId !== null && selectedTab === "asistencia"
			? await getAttendanceReportData(selectedSimposiumId)
			: null;
	const complianceReportData =
		selectedSimposiumId !== null && selectedTab === "cumplimiento"
			? await getComplianceReportData(selectedSimposiumId)
			: null;

	return (
		<div className="flex-1 bg-[radial-gradient(circle_at_top,rgba(231,229,228,0.9),rgba(250,250,249,1)_55%)]">
			<div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
				<ReportHeader selectedTab={selectedTab} />
				<ReportControls
					simposiums={simposiums}
					selectedSimposiumId={selectedSimposiumId}
					selectedTab={selectedTab}
				/>
				{selectedSimposiumId === null && <ReportEmptyState />}
				{selectedSimposiumId !== null && selectedTab === "asistencia" && reportData && (
					<ReportAsistenciaSection
						selectedSimposiumId={selectedSimposiumId}
						reportData={reportData}
					/>
				)}
				{selectedSimposiumId !== null &&
					selectedTab === "cumplimiento" &&
					complianceReportData && (
						<ReportComplianceSection
							selectedSimposiumId={selectedSimposiumId}
							reportData={complianceReportData}
						/>
					)}
			</div>
		</div>
	);
}