import { useTranslations } from "next-intl";

// Brand names are proper nouns, so they are not translated.
const BRANDS = [
	"VOGUE",
	"SONY α",
	"Canon",
	"NATIONAL GEOGRAPHIC",
	"Leica",
	"Adobe",
];

/** Two copies side by side so the marquee loops seamlessly. */
const MARQUEE = ["a", "b"].flatMap((copy) =>
	BRANDS.map((brand) => ({ key: `${copy}-${brand}`, brand })),
);

export function Logos() {
	const t = useTranslations("Landing.logos");

	return (
		<section className="border-y border-border bg-card py-8">
			<p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
				{t("title")}
			</p>
			<div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
				<div className="flex w-max animate-marquee gap-16 pr-16 font-display text-xl font-bold text-muted-foreground/70">
					{MARQUEE.map(({ key, brand }) => (
						<span key={key}>{brand}</span>
					))}
				</div>
			</div>
		</section>
	);
}
