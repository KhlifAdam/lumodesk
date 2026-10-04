const PLACEHOLDER_KEYS = Array.from(
	{ length: 16 },
	(_, i) => `placeholder-${i}`,
);

export function MediaGridSkeleton() {
	return (
		<div className="grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
			{PLACEHOLDER_KEYS.map((key) => (
				<div
					key={key}
					className="aspect-square animate-pulse rounded-lg bg-muted"
				/>
			))}
		</div>
	);
}
