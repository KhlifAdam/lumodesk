import {
	CalendarCheck,
	Camera,
	Heart,
	Images,
	Send,
	UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { SIDE_TONES, type Side } from "./audience-card";

const STEPS = [
	{ key: "plan", side: "studio", icon: CalendarCheck },
	{ key: "invite", side: "studio", icon: Send },
	{ key: "gallery", side: "client", icon: Images },
	{ key: "pick", side: "client", icon: Heart },
] as const satisfies readonly { key: string; side: Side; icon: unknown }[];

const SIDE_ICONS = { studio: Camera, client: UserRound } as const;

/** How the two sides meet: who acts at each step, from booking to delivery. */
export function HowItWorks() {
	const t = useTranslations("Home.how");

	return (
		<section className="mx-auto w-full max-w-6xl px-5 py-24">
			<div className="mx-auto max-w-2xl text-center">
				<p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
					{t("eyebrow")}
				</p>
				<h2 className="mt-3 text-balance font-display text-3xl font-semibold md:text-5xl">
					{t("title")}
				</h2>
				<p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
			</div>

			<ol className="relative mt-16 grid gap-5 md:grid-cols-4">
				{/* The thread that links the steps (desktop). */}
				<span className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-primary/60 via-border to-chart-2/60 md:block" />
				{STEPS.map(({ key, side, icon: Icon }, index) => {
					const tone = SIDE_TONES[side];
					const SideIcon = SIDE_ICONS[side];
					return (
						<li
							key={key}
							className="relative flex flex-col items-center text-center"
						>
							<span
								className={cn(
									"relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background shadow-lg",
									tone.text,
								)}
							>
								<Icon className="h-6 w-6" />
							</span>
							<div className="mt-5 flex w-full flex-1 flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur transition-colors duration-300 hover:bg-card">
								<span
									className={cn(
										"flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
										tone.soft,
									)}
								>
									<SideIcon className="h-3 w-3" />
									{t(`actors.${side}`)}
								</span>
								<h3 className="font-display text-base font-semibold">
									<span className="mr-1.5 text-muted-foreground">
										0{index + 1}
									</span>
									{t(`steps.${key}.title`)}
								</h3>
								<p className="text-sm leading-6 text-muted-foreground">
									{t(`steps.${key}.text`)}
								</p>
							</div>
						</li>
					);
				})}
			</ol>
		</section>
	);
}
