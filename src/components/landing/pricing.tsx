"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { reveal } from "./animations";

export function Pricing() {
	const [yearly, setYearly] = useState(true);

	return (
		<section id="pricing" className="border-y border-border bg-card/50">
			<div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
				<motion.div {...reveal} className="text-center">
					<p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
						Simple pricing
					</p>
					<h2 className="mt-3 text-4xl font-semibold md:text-5xl">
						Grow at your own pace.
					</h2>
					<div className="mt-7 inline-flex rounded-lg border border-border bg-background p-1">
						<button
							type="button"
							onClick={() => setYearly(false)}
							className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${!yearly ? "bg-foreground text-background" : "text-muted-foreground"}`}
						>
							Monthly
						</button>
						<button
							type="button"
							onClick={() => setYearly(true)}
							className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${yearly ? "bg-foreground text-background" : "text-muted-foreground"}`}
						>
							Yearly <span className="text-primary">−20%</span>
						</button>
					</div>
				</motion.div>
				<div className="mt-12 grid items-center gap-4 md:grid-cols-3">
					{[
						[
							"Starter",
							19,
							[
								"3 active projects",
								"20 GB gallery storage",
								"Contracts & invoices",
							],
						],
						[
							"Pro",
							39,
							[
								"Unlimited projects",
								"250 GB gallery storage",
								"AI workflow assistant",
								"Automations & analytics",
							],
						],
						[
							"Studio",
							79,
							[
								"5 team members",
								"1 TB gallery storage",
								"Priority concierge",
								"Custom branding",
							],
						],
					].map(([name, price, features], i) => (
						<motion.article
							key={name as string}
							{...reveal}
							whileHover={{ y: -5 }}
							className={`relative rounded-xl bg-background p-7 ${i === 1 ? "border-2 border-primary py-10 shadow-luminous md:scale-105" : "border border-border"}`}
						>
							{i === 1 && (
								<span className="absolute right-5 top-5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase text-primary">
									Most popular
								</span>
							)}
							<h3 className="text-lg font-semibold">{name as string}</h3>
							<div className="mt-5 flex items-end gap-1">
								<span className="text-4xl font-bold">
									$
									{yearly
										? (price as number)
										: Math.round((price as number) * 1.25)}
								</span>
								<span className="pb-1 text-sm text-muted-foreground">
									/ month
								</span>
							</div>
							<p className="mt-2 text-xs text-muted-foreground">
								{yearly ? "Billed annually" : "Billed monthly"}
							</p>
							<Button
								variant={i === 1 ? "luminous" : "outline"}
								className="mt-7 w-full"
								asChild
							>
								<Link href="/register">Start free trial</Link>
							</Button>
							<div className="mt-7 space-y-3">
								{(features as string[]).map((f) => (
									<p key={f} className="flex items-center gap-2 text-sm">
										<Check className="size-4 text-primary" />
										{f}
									</p>
								))}
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
