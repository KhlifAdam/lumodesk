/** Placeholder squares while a gallery page loads. */
export function PhotoGridSkeleton({ count = 16 }: { count?: number }) {
	return (
		<div className="grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
			{Array.from({ length: count }, (_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
					key={i}
					className="aspect-square animate-pulse rounded-lg border border-border bg-muted"
				/>
			))}
		</div>
	);
}
