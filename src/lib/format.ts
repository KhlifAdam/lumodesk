const UNITS = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;

/** Locale-aware file size, e.g. "4.2 MB" / "4,2 Mo". */
export function formatBytes(bytes: number, locale: string) {
	let value = bytes;
	let unit = 0;
	while (value >= 1024 && unit < UNITS.length - 1) {
		value /= 1024;
		unit++;
	}
	return new Intl.NumberFormat(locale, {
		style: "unit",
		unit: UNITS[unit],
		unitDisplay: "short",
		maximumFractionDigits: unit === 0 ? 0 : 1,
	}).format(value);
}

/** Video duration as m:ss or h:mm:ss. */
export function formatDuration(totalSeconds: number) {
	const s = Math.round(totalSeconds);
	const hours = Math.floor(s / 3600);
	const minutes = Math.floor((s % 3600) / 60);
	const seconds = String(s % 60).padStart(2, "0");
	return hours > 0
		? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
		: `${minutes}:${seconds}`;
}
