import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Each side keeps one accent everywhere on the hub: gold for studios, teal for clients. */
export const SIDE_TONES = {
	studio: {
		text: "text-primary",
		soft: "bg-primary/10 text-primary",
		button: "bg-primary text-primary-foreground",
		hover: "hover:border-primary/60 hover:shadow-primary/15",
	},
	client: {
		text: "text-chart-2",
		soft: "bg-chart-2/10 text-chart-2",
		button: "bg-chart-2 text-white",
		hover: "hover:border-chart-2/60 hover:shadow-chart-2/15",
	},
} as const;

export type Side = keyof typeof SIDE_TONES;

interface AudienceCardProps {
	side: Side;
	href: string;
	icon: LucideIcon;
	image: string;
	imageAlt: string;
	label: string;
	title: string;
	description: string;
	points: string[];
	cta: string;
}

/** One big entry of the hub: a photo, what this side does, and its way in. */
export function AudienceCard({
	side,
	href,
	icon: Icon,
	image,
	imageAlt,
	label,
	title,
	description,
	points,
	cta,
}: AudienceCardProps) {
	const tone = SIDE_TONES[side];

	return (
		<Link
			href={href}
			className={cn(
				"group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-3 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				tone.hover,
			)}
		>
			<div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
				<Image
					src={image}
					alt={imageAlt}
					fill
					sizes="(min-width: 768px) 45vw, 100vw"
					className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
				<span className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
					<Icon className="h-3.5 w-3.5" />
					{label}
				</span>
			</div>

			<div className="flex flex-1 flex-col gap-5 px-4 pb-4 pt-6 md:px-5">
				<div className="flex flex-col gap-2">
					<h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
						{title}
					</h2>
					<p className="text-sm leading-6 text-muted-foreground">
						{description}
					</p>
				</div>
				<ul className="flex flex-col gap-2.5">
					{points.map((point) => (
						<li key={point} className="flex items-center gap-3 text-sm">
							<span
								className={cn(
									"flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
									tone.soft,
								)}
							>
								<Check className="h-3 w-3" />
							</span>
							{point}
						</li>
					))}
				</ul>
				<span
					className={cn(
						"mt-auto flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-lg transition-all duration-300 group-hover:gap-3",
						tone.button,
					)}
				>
					{cta}
					<ArrowRight className="h-4 w-4" />
				</span>
			</div>
		</Link>
	);
}
