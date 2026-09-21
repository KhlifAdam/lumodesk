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
			{/* Left Side: Brand & Visuals */}
			<div className="relative hidden md:flex flex-col p-10 overflow-hidden text-white">
				{/* Background Image */}
				<div className="absolute inset-0">
					<Image
						src="/images/lumodesk-editorial.jpg"
						alt="Authentication background"
						width={1600}
						height={1104}
						className="object-cover w-full h-full"
						priority
					/>
					<div className="absolute inset-0 bg-zinc-900/60 mix-blend-multiply" />
					<div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent" />
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

				{/* Quote */}
				<div className="relative z-10 mt-auto">
					<blockquote className="space-y-3">
						<p className="text-xl font-medium text-white drop-shadow-sm">
							&ldquo;This tool has completely transformed how our team
							collaborates. The attention to detail and performance is
							unmatched.&rdquo;
						</p>
						<footer className="text-sm font-medium text-zinc-300">
							Sofia Davis, Product Designer
						</footer>
					</blockquote>
				</div>
			</div>

			{/* Right Side: Auth Forms */}
			<div className="relative flex items-center justify-center p-8 md:p-12 overflow-hidden">
				{/* Glassmorphism elements for the right side */}
				<div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

				<div className="w-full max-w-[400px] z-10 relative">{children}</div>
			</div>
		</div>
	);
}
