"use client";

import { motion } from "framer-motion";
import { Aperture, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { reveal } from "./animations";

export function CTA() {
	return (
		<section className="px-5 pb-8">
			<motion.div
				{...reveal}
				className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-primary px-6 py-20 text-center text-primary-foreground shadow-luminous md:py-28"
			>
				<div className="absolute inset-0 grid-fade opacity-20" />
				<div className="relative">
					<Aperture className="mx-auto size-8" />
					<h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold md:text-6xl">
						Ready to level up your studio?
					</h2>
					<p className="mx-auto mt-5 max-w-xl text-primary-foreground/75">
						Join thousands of photographers running calmer, more profitable
						businesses.
					</p>
					<Button size="xl" variant="secondary" className="mt-8" asChild>
						<Link href="/register">
							Start your free trial <ArrowRight />
						</Link>
					</Button>
				</div>
			</motion.div>
		</section>
	);
}
