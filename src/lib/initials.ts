/** Up to two uppercase initials for avatar fallbacks. */
export function initialsOf(name: string) {
	return (
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((word) => word[0])
			.join("")
			.toUpperCase() || "?"
	);
}
