export function Logos() {
	return (
		<section className="border-y border-border bg-card py-8">
			<p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
				Trusted by creatives at
			</p>
			<div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
				<div className="flex w-max animate-marquee gap-16 pr-16 font-display text-xl font-bold text-muted-foreground/70">
					{[...Array(2)].flatMap((_, i) =>
						[
							"VOGUE",
							"SONY α",
							"Canon",
							"NATIONAL GEOGRAPHIC",
							"Leica",
							"Adobe",
						].map((x) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Static repeated array
							<span key={`${x}-${i}`}>{x}</span>
						)),
					)}
				</div>
			</div>
		</section>
	);
}
