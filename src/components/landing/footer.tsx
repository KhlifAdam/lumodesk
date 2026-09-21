import { Camera, MessageCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "./brand-mark";

export function Footer() {
	return (
		<footer className="mx-auto max-w-7xl px-5 py-10">
			<div className="flex flex-col items-center justify-between gap-6 border-b border-border pb-8 md:flex-row">
				<a
					href="#top"
					className="flex items-center gap-2 font-display text-sm font-bold"
				>
					<BrandMark /> Lumodesk
				</a>
				<div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
					<a href="#features">Features</a>
					<a href="#pricing">Pricing</a>
					<a href="#faq">FAQ</a>
					<a href="/privacy">Privacy</a>
					<a href="/terms">Terms</a>
				</div>
				<div className="flex gap-2">
					<Button variant="ghost" size="icon" aria-label="Instagram">
						<Camera />
					</Button>
					<Button variant="ghost" size="icon" aria-label="Twitter">
						<MessageCircle />
					</Button>
					<Button variant="ghost" size="icon" aria-label="Play videos">
						<Play />
					</Button>
				</div>
			</div>
			<p className="pt-6 text-center text-[11px] text-muted-foreground md:text-left">
				© 2026 Lumodesk, Inc. Built for the ones who see differently.
			</p>
		</footer>
	);
}
