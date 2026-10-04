"use client";

import { motion } from "framer-motion";
import { Aperture, CalendarDays, Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { reveal } from "./animations";

const STEPS = [
	{ id: "capture", number: "01", icon: CalendarDays },
	{ id: "experience", number: "02", icon: Sparkles },
	{ id: "deliver", number: "03", icon: Aperture },
] as const;

export function Workflow() {
	const t = useTranslations("Landing.workflow");

	return (
		<section id="workflow" className="border-y border-border bg-card/50">
			<div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[.8fr_1.2fr] md:py-32">
				<div className="md:sticky md:top-28 md:h-fit">
					<p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
						{t("eyebrow")}
					</p>
					<h2 className="mt-3 text-4xl font-semibold md:text-5xl">
						{t("title")}
					</h2>
					<p className="mt-5 max-w-md text-muted-foreground">{t("subtitle")}</p>
				</div>
				<div className="space-y-20">
					{STEPS.map(({ id, number, icon: Icon }) => (
						<motion.article
							key={id}
							{...reveal}
							className="min-h-[420px] overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm"
						>
							<span className="font-mono text-xs text-primary">{number}</span>
							<h3 className="mt-4 text-2xl font-semibold">
								{t(`steps.${id}.title`)}
							</h3>
							<p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
								{t(`steps.${id}.description`)}
							</p>
							<div className="relative mt-8 h-52 overflow-hidden rounded-lg border border-border bg-soft">
								<div className="absolute inset-0 grid-fade opacity-50" />
								<motion.div
									whileInView={{ scale: 1, y: 0 }}
									initial={{ scale: 0.9, y: 30 }}
									transition={{ type: "spring", bounce: 0.2 }}
									className="absolute inset-x-[12%] top-10 rounded-lg border border-border bg-card p-4 shadow-xl"
								>
									<div className="flex items-center gap-3">
										<span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
											<Icon className="size-4" />
										</span>
										<div>
											<p className="text-xs font-semibold">
												{t(`steps.${id}.cardTitle`)}
											</p>
											<p className="text-[10px] text-muted-foreground">
												{t(`steps.${id}.cardMeta`)}
											</p>
										</div>
										<Check className="ml-auto size-4 text-chart-2" />
									</div>
								</motion.div>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
