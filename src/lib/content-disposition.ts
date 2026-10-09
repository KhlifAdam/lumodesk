/**
 * `Content-Disposition` that saves the file under `filename`. The RFC 5987
 * `filename*` form keeps accents and non-Latin names intact in every browser.
 */
export function attachmentHeader(filename: string) {
	const encoded = encodeURIComponent(filename).replace(
		/['()*]/g,
		(c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
	);
	return `attachment; filename*=UTF-8''${encoded}`;
}
