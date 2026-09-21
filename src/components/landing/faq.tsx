"use client";

import { motion } from "framer-motion";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { reveal } from "./animations";

const faqs = [
	[
		"Can I try Lumodesk before paying?",
		"Yes. Every plan begins with a 14-day free trial, with no credit card required.",
	],
	[
		"Can I migrate my existing clients?",
		"Absolutely. Import contacts, projects, and contracts from a CSV, or let our concierge team handle it.",
	],
	[
		"Are client galleries included?",
		"Every plan includes beautiful, mobile-ready galleries. Storage limits vary by plan.",
	],
	[
		"Does Lumodesk take a commission?",
		"Never. Payments go directly to your connected account, with no Lumodesk commission.",
	],
	[
		"Can my team use the same workspace?",
		"Studio plans include five seats, granular permissions, and shared workflow templates.",
	],
];

export function FAQ() {
	return (
		<section
			id="faq"
			className="mx-auto grid max-w-5xl gap-12 px-5 py-24 md:grid-cols-[.7fr_1.3fr] md:py-32"
		>
			<motion.div {...reveal}>
				<p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
					Questions, answered
				</p>
				<h2 className="mt-3 text-4xl font-semibold">
					A few things you might wonder.
				</h2>
				<p className="mt-5 text-sm text-muted-foreground">
					Still curious?{" "}
					<a
						href="mailto:hello@lumodesk.co"
						className="text-primary underline underline-offset-4"
					>
						Talk to our team.
					</a>
				</p>
			</motion.div>
			<motion.div {...reveal}>
				<Accordion type="single" collapsible>
					{faqs.map(([q, a], i) => (
						<AccordionItem key={q} value={`item-${i}`}>
							<AccordionTrigger className="py-5 text-base hover:no-underline">
								{q}
							</AccordionTrigger>
							<AccordionContent className="max-w-xl pb-5 leading-6 text-muted-foreground">
								{a}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</motion.div>
		</section>
	);
}
