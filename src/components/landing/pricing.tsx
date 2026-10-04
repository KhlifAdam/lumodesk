"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { reveal } from "./animations";

const PLANS = [
	{ id: "starter", price: 19 },
	{ id: "pro", price: 39 },
	{ id: "studio", price: 79 },
] as const;
const POPULAR_PLAN = "pro";
/** Yearly billing is 20% cheaper, i.e. monthly = yearly / 0.8. */
const MONTHLY_MULTIPLIER = 1.25;

export function Pricing() {
	const t = useTranslations("Landing.pricing");
	const format = useFormatter();
	const [yearly, setYearly] = useState(true);

	const money = (amount: number) =>
		format.number(amount, {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		});

	const toggleClass = (active: boolean) =>
		cn(
			"rounded-md px-4 py-2 text-xs font-semibold transition-colors",
			active ? "bg-foreground text-background" : "text-muted-foreground",
		);

	return (
		<section id="pricing" className="border-y border-border bg-card/50">
			<div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
				<motion.div {...reveal} className="text-center">
					<p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
						{t("eyebrow")}
					</p>
					<h2 className="mt-3 text-4xl font-semibold md:text-5xl">
						{t("title")}
					</h2>
					<div className="mt-7 inline-flex rounded-lg border border-border bg-background p-1">
						<button
							type="button"
							onClick={() => setYearly(false)}
							className={toggleClass(!yearly)}
						>
							{t("monthly")}
						</button>
						<button
							type="button"
							onClick={() => setYearly(true)}
							className={toggleClass(yearly)}
						>
							{t("yearly")}{" "}
							<span className="text-primary">{t("yearlyDiscount")}</span>
						</button>
					</div>
				</motion.div>
				<div className="mt-12 grid items-center gap-4 md:grid-cols-3">
					{PLANS.map(({ id, price }) => {
						const popular = id === POPULAR_PLAN;
						const features = t.raw(`plans.${id}.features`) as string[];
						return (
							<motion.article
								key={id}
								{...reveal}
								whileHover={{ y: -5 }}
								className={cn(
									"relative rounded-xl bg-background p-7",
									popular
										? "border-2 border-primary py-10 shadow-luminous md:scale-105"
										: "border border-border",
								)}
							>
								{popular && (
									<span className="absolute right-5 top-5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase text-primary">
										{t("mostPopular")}
									</span>
								)}
								<h3 className="text-lg font-semibold">
									{t(`plans.${id}.name`)}
								</h3>
								<div className="mt-5 flex items-end gap-1">
									<span className="text-4xl font-bold">
										{money(
											yearly ? price : Math.round(price * MONTHLY_MULTIPLIER),
										)}
									</span>
									<span className="pb-1 text-sm text-muted-foreground">
										{t("perMonth")}
									</span>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									{yearly ? t("billedAnnually") : t("billedMonthly")}
								</p>
								<Button
									variant={popular ? "luminous" : "outline"}
									className="mt-7 w-full"
									asChild
								>
									<Link href="/register">{t("cta")}</Link>
								</Button>
								<div className="mt-7 space-y-3">
									{features.map((feature) => (
										<p
											key={feature}
											className="flex items-center gap-2 text-sm"
										>
											<Check className="size-4 text-primary" />
											{feature}
										</p>
									))}
								</div>
							</motion.article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
