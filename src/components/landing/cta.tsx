"use client";

import { motion } from "framer-motion";
import { Aperture, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { reveal } from "./animations";

export function CTA() {
	const t = useTranslations("Landing.cta");

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
						{t("title")}
					</h2>
					<p className="mx-auto mt-5 max-w-xl text-primary-foreground/75">
						{t("subtitle")}
					</p>
					<Button size="xl" variant="secondary" className="mt-8" asChild>
						<Link href="/register">
							{t("button")} <ArrowRight />
						</Link>
					</Button>
				</div>
			</motion.div>
		</section>
	);
}
