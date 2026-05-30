"use client";

export function DownloadPdfBtn() {
	const handleDownload = () => {
		window.print();
	};

	return (
		<button
			type="button"
			onClick={handleDownload}
			className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
		>
			Descargar PDF
		</button>
	);
}
