import { CTA } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Logos } from "@/components/landing/logos";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { Workflow } from "@/components/landing/workflow";

export default function Page() {
	return (
		<main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] mesh-glow" />
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] grid-fade opacity-60" />

			<Header />
			<Hero />
			<Logos />
			<Features />
			<Workflow />
			<Testimonials />
			<Pricing />
			<FAQ />
			<CTA />
			<Footer />
		</main>
	);
}
