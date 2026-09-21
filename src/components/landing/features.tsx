"use client";

import { motion } from "framer-motion";
import {
	Aperture,
	Bot,
	Check,
	ChevronRight,
	Users,
	WandSparkles,
} from "lucide-react";
import Image from "next/image";
import { reveal } from "./animations";

export function Features() {
	return (
		<section id="features" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
			<motion.div {...reveal} className="max-w-2xl">
				<p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">
					Everything connected
				</p>
				<h2 className="text-4xl font-semibold leading-tight md:text-6xl">
					Less admin. More time behind the lens.
				</h2>
				<p className="mt-5 text-muted-foreground">
					Every client touchpoint, beautifully considered and perfectly in sync.
				</p>
			</motion.div>
			<div className="mt-12 grid auto-rows-[300px] grid-cols-1 gap-4 md:grid-cols-6">
				<motion.article
					{...reveal}
					whileHover={{ y: -5 }}
					className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-luminous md:col-span-4"
				>
					<div className="relative z-10">
						<Users className="size-5 text-primary" />
						<h3 className="mt-4 text-xl font-semibold">Smart CRM</h3>
						<p className="mt-2 max-w-xs text-sm text-muted-foreground">
							Know every client, conversation, and milestone at a glance.
						</p>
					</div>
					<div className="absolute -bottom-5 right-[-4%] w-[68%] rounded-lg border border-border bg-background p-4 shadow-xl">
						<div className="flex items-center gap-3">
							<Image
								src="/images/lumodesk-portrait.jpg"
								alt="Client profile"
								width={1200}
								height={1504}
								className="size-10 rounded-full object-cover"
							/>
							<div>
								<p className="text-xs font-semibold">Mara Cole</p>
								<p className="text-[10px] text-muted-foreground">
									Editorial · September 28
								</p>
							</div>
							<span className="ml-auto rounded-full bg-chart-2/15 px-2 py-1 text-[9px] text-chart-2">
								Confirmed
							</span>
						</div>
						{["Contract signed", "Invoice paid", "Questionnaire received"].map(
							(x, i) => (
								<div
									key={x}
									className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground"
								>
									<Check className="size-3 text-chart-2" />
									{x}
									<span className="ml-auto">{i + 1}d ago</span>
								</div>
							),
						)}
					</div>
				</motion.article>
				<motion.article
					{...reveal}
					whileHover={{ y: -5 }}
					className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-luminous md:col-span-2 md:row-span-2"
				>
					<Aperture className="size-5 text-primary" />
					<h3 className="mt-4 text-xl font-semibold">Client Galleries</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Deliver work that feels as premium as it looks.
					</p>
					<div className="relative mt-7 h-[390px]">
						<motion.div
							whileHover={{ rotate: -2, scale: 1.02 }}
							className="absolute left-2 top-2 h-72 w-48 -rotate-6 rounded-md border-[6px] border-card bg-muted shadow-xl"
						>
							<Image
								src="/images/lumodesk-gallery.jpg"
								alt="Wedding gallery"
								fill
								className="rounded-sm object-cover"
							/>
						</motion.div>
						<motion.div
							whileHover={{ rotate: 2, scale: 1.02 }}
							className="absolute left-12 top-24 h-52 w-48 rotate-6 rounded-md border-[6px] border-card bg-muted shadow-xl"
						>
							<Image
								src="/images/lumodesk-editorial.jpg"
								alt="Editorial gallery"
								fill
								className="rounded-sm object-cover"
							/>
						</motion.div>
					</div>
				</motion.article>
				<motion.article
					{...reveal}
					whileHover={{ y: -5 }}
					className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-luminous md:col-span-2"
				>
					<div className="absolute right-4 top-4 size-24 rounded-full bg-primary/25 blur-2xl" />
					<WandSparkles className="relative size-5 text-primary" />
					<h3 className="mt-4 text-xl font-semibold">AI Assistant</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Draft emails, curate galleries, and plan timelines in seconds.
					</p>
					<div className="mt-6 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs">
						<Bot className="size-5 text-primary" />
						Your follow-up is ready to send.
						<ChevronRight className="ml-auto size-4" />
					</div>
				</motion.article>
				<motion.article
					{...reveal}
					whileHover={{ y: -5 }}
					className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-luminous md:col-span-2"
				>
					<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
						Automated invoicing
					</p>
					<div className="mt-3 flex items-end justify-between">
						<div>
							<p className="text-3xl font-bold">$48.2k</p>
							<p className="text-xs text-muted-foreground">
								Collected this year
							</p>
						</div>
						<span className="text-xs text-chart-2">+18.4%</span>
					</div>
					<svg
						viewBox="0 0 300 90"
						className="mt-5 w-full text-primary"
						fill="none"
						aria-label="Automated invoicing chart"
						role="img"
					>
						<motion.path
							initial={{ pathLength: 0 }}
							whileInView={{ pathLength: 1 }}
							transition={{ duration: 1.4 }}
							d="M0 75 C30 72, 45 34, 78 49 S122 76, 151 39 S194 60, 225 25 S268 31,300 5"
							stroke="currentColor"
							strokeWidth="3"
						/>
						<path
							d="M0 75 C30 72, 45 34, 78 49 S122 76, 151 39 S194 60, 225 25 S268 31,300 5 V90 H0Z"
							fill="currentColor"
							opacity=".08"
						/>
					</svg>
				</motion.article>
			</div>
		</section>
	);
}
