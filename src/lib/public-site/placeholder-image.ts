const toDataUri = (svg: string) =>
	`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/** Round monogram logo for demo content. */
export function placeholderLogo(initials: string) {
	return toDataUri(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="#1c1917"/>` +
			`<text x="48" y="58" text-anchor="middle" font-family="Georgia,serif" font-size="32" fill="#f5f0e6">${initials}</text></svg>`,
	);
}
