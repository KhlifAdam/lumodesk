"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { reveal } from "./animations";

export function Testimonials() {
	return (
		<section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
			<motion.div {...reveal} className="text-center">
				<p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
					Loved by working creatives
				</p>
				<h2 className="mt-3 text-4xl font-semibold md:text-5xl">
					The calm behind the craft.
				</h2>
			</motion.div>
			<div className="mt-12 grid gap-4 md:grid-cols-3">
				{[
					[
						"Lumodesk gave me back my Sundays. My clients feel cared for, and I finally feel in control.",
						"Maya Chen",
						"Wedding photographer",
					],
					[
						"It’s the first tool that understands both the art and business of what we do.",
						"Theo Martins",
						"Commercial director",
					],
					[
						"Our booking rate jumped almost immediately. Every touchpoint finally feels like our brand.",
						"Nina Ross",
						"Portrait studio",
					],
				].map(([q, n, r], i) => (
					<motion.article
						key={n}
						{...reveal}
						transition={{ ...reveal.transition, delay: i * 0.1 }}
						className={`rounded-xl border border-border bg-card/80 p-6 backdrop-blur ${i === 1 ? "md:-translate-y-5" : ""}`}
					>
						<Quote className="size-6 text-primary" />
						<div className="mt-5 flex gap-1">
							{[1, 2, 3, 4, 5].map((x) => (
								<Star key={x} className="size-3.5 fill-primary text-primary" />
							))}
						</div>
						<p className="mt-5 leading-7">“{q}”</p>
						<div className="mt-7 flex items-center gap-3">
							<Image
								src={
									i === 1
										? "/images/lumodesk-portrait.jpg"
										: i === 0
											? "/images/lumodesk-gallery.jpg"
											: "/images/lumodesk-editorial.jpg"
								}
								alt={n}
								width={1200}
								height={1504}
								className="size-10 rounded-full object-cover"
							/>
							<div>
								<p className="text-sm font-semibold">{n}</p>
								<p className="text-xs text-muted-foreground">{r}</p>
							</div>
						</div>
					</motion.article>
				))}
			</div>
		</section>
	);
}
