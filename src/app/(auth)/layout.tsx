import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Authentication | Lumodesk",
	description: "Log in or register for an account.",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid min-h-screen grid-cols-1 md:grid-cols-2 bg-background">
			<div className="relative hidden md:flex flex-col p-10 overflow-hidden text-foreground">
				{/* Creative Image Frame */}
				<div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-24 pointer-events-none">
					{/* Decorative blur elements behind the frame */}
					<div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/30 rounded-full blur-[60px]" />
					<div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-chart-2/20 rounded-full blur-[60px]" />

					{/* Main Floating Frame */}
					<div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] -rotate-3 transition-transform duration-700 ease-out">
						<Image
							src="/images/lumodesk-editorial.jpg"
							alt="Authentication background"
							fill
							className="object-cover w-full h-full"
							priority
						/>
						{/* Subtle gradient overlay to ensure text contrast if it overlaps */}
						<div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
						{/* Inner shine */}
						<div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem]" />
					</div>
				</div>

				{/* Brand */}
				<Link
					href="/"
					className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight w-fit hover:opacity-90 transition-opacity"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							aria-label="Lumodesk Logo"
							role="img"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-5 w-5"
						>
							<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
						</svg>
					</div>
					Lumodesk
				</Link>

				{/* Minimalist Testimonial Pill */}
				<div className="relative z-10 mt-auto flex items-center gap-3 bg-background/60 backdrop-blur-md px-4 py-3 rounded-full border border-border/50 shadow-sm w-fit max-w-[90%]">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
						SD
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-semibold text-foreground leading-tight">
							Sofia Davis, Product Designer
						</span>
						<span className="text-[10px] text-muted-foreground italic mt-0.5 truncate">
							"This tool has transformed how our team collaborates."
						</span>
					</div>
				</div>
			</div>

			{/* Right Side: Auth Forms */}
			<div className="relative flex items-center justify-center lg:justify-start lg:pl-24 p-8 md:p-12 overflow-hidden">
				{/* Glassmorphism elements for the right side */}
				<div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

				<div className="w-full max-w-[400px] z-10 relative">{children}</div>
			</div>
		</div>
	);
}
