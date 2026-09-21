"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
	Aperture,
	ArrowRight,
	CalendarDays,
	CirclePlay,
	Mail,
	Sparkles,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { reveal } from "./animations";
import { BrandMark } from "./brand-mark";

export function Hero() {
	const { scrollYProgress } = useScroll();
	const dashboardY = useTransform(scrollYProgress, [0, 0.3], [0, -70]);

	return (
		<section
			id="top"
			className="relative mx-auto max-w-7xl px-5 pt-36 text-center md:pt-44"
		>
			<motion.div {...reveal}>
				<span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
					<Sparkles className="size-3.5 text-primary" /> The creative operating
					system
				</span>
				<h1 className="mx-auto max-w-5xl text-balance font-display text-5xl font-semibold leading-[1.02] md:text-7xl lg:text-[5.6rem]">
					Your Entire Photography Business,{" "}
					<span className="text-primary">In One Place.</span>
				</h1>
				<p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-7 text-muted-foreground md:text-lg">
					Manage bookings, deliver stunning client galleries, and automate your
					workflow with AI.
				</p>
				<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<Button variant="luminous" size="xl" asChild>
						<Link href="/register">
							Start free trial <ArrowRight />
						</Link>
					</Button>
					<Button variant="glass" size="xl">
						<CirclePlay /> Watch demo
					</Button>
				</div>
				<p className="mt-4 text-xs text-muted-foreground">
					14 days free · No credit card required
				</p>
			</motion.div>

			<motion.div
				style={{ y: dashboardY }}
				initial={{ opacity: 0, rotateX: 12, scale: 0.94 }}
				animate={{ opacity: 1, rotateX: 0, scale: 1 }}
				transition={{
					duration: 1.2,
					delay: 0.3,
					type: "spring",
					bounce: 0.18,
				}}
				className="relative mx-auto mt-14 max-w-6xl [perspective:1600px]"
			>
				<div className="absolute inset-x-[14%] bottom-[-5%] h-1/2 rounded-full bg-primary/20 blur-3xl" />
				<motion.div
					animate={{ y: [0, -8, 0] }}
					transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
					className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-2 shadow-2xl md:p-3 md:[transform:rotateX(2deg)]"
				>
					<div className="flex h-9 items-center gap-1.5 border-b border-border px-2">
						<i className="size-2 rounded-full bg-destructive" />
						<i className="size-2 rounded-full bg-chart-4" />
						<i className="size-2 rounded-full bg-chart-2" />
						<span className="ml-3 text-[10px] text-muted-foreground">
							lumodesk / overview
						</span>
					</div>
					<div className="grid min-h-[390px] grid-cols-[52px_1fr] md:grid-cols-[180px_1fr]">
						<aside className="border-r border-border p-3 text-left">
							<div className="mb-7 hidden items-center gap-2 text-xs font-semibold md:flex">
								<BrandMark /> Studio North
							</div>
							{[Aperture, CalendarDays, Users, Mail].map((Icon, i) => (
								<div
									key={Icon.name}
									className={`mb-2 flex items-center gap-2 rounded-md p-2 text-xs ${i === 0 ? "bg-accent text-foreground" : "text-muted-foreground"}`}
								>
									<Icon className="size-3.5" />
									<span className="hidden md:inline">
										{["Overview", "Bookings", "Clients", "Messages"][i]}
									</span>
								</div>
							))}
						</aside>
						<div className="p-4 text-left md:p-6">
							<div className="flex items-end justify-between">
								<div>
									<p className="text-xs text-muted-foreground">
										Monday, September 21
									</p>
									<h3 className="mt-1 text-xl font-semibold md:text-2xl">
										Good morning, Alex.
									</h3>
								</div>
								<Button size="sm" className="hidden sm:flex">
									New project
								</Button>
							</div>
							<div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
								{[
									["Revenue", "$24,860"],
									["Projects", "18"],
									["Inquiries", "32"],
									["Gallery views", "8.4k"],
								].map(([a, b], i) => (
									<div
										key={a}
										className="rounded-lg border border-border bg-background p-3"
									>
										<p className="text-[10px] text-muted-foreground">{a}</p>
										<p className="mt-1 font-display text-lg font-bold">{b}</p>
										<div
											className={`mt-3 h-1 rounded-full ${i === 0 ? "bg-primary" : "bg-accent"}`}
										/>
									</div>
								))}
							</div>
							<div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_.8fr]">
								<div className="overflow-hidden rounded-lg border border-border bg-background p-3">
									<div className="mb-3 flex justify-between text-xs font-medium">
										<span>Latest gallery</span>
										<span className="text-muted-foreground">View all</span>
									</div>
									<Image
										src="/images/lumodesk-editorial.jpg"
										alt="Editorial project contact sheet"
										width={1600}
										height={1104}
										className="h-44 w-full rounded-md object-cover"
									/>
								</div>
								<div className="rounded-lg border border-border bg-background p-4">
									<p className="text-xs font-medium">This month</p>
									<div className="mt-6 flex h-28 items-end gap-2">
										{[
											{ id: "h1", h: 38 },
											{ id: "h2", h: 60 },
											{ id: "h3", h: 44 },
											{ id: "h4", h: 78 },
											{ id: "h5", h: 56 },
											{ id: "h6", h: 92 },
											{ id: "h7", h: 70 },
										].map(({ id, h }, i) => (
											<motion.i
												key={id}
												initial={{ height: 0 }}
												whileInView={{ height: `${h}%` }}
												transition={{ delay: i * 0.08 }}
												className="flex-1 rounded-t-sm bg-primary/70"
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</section>
	);
}
