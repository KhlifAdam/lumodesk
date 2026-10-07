import { ArrowLeft, FolderOpen, Heart, Images } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const POINT_ICONS = [FolderOpen, Images, Heart] as const;

interface WelcomeLink {
	href: string;
	label: string;
}

/** Colours and fonts differ per look (studio theme vs. app theme); layout doesn't. */
export interface WelcomeTone {
	card: string;
	heading: string;
	muted: string;
	accent: string;
	primary: string;
	secondary: string;
}

interface WelcomeCardProps {
	tone: WelcomeTone;
	brand: ReactNode;
	title: string;
	subtitle: string;
	points: string[];
	hint: string;
	signIn: WelcomeLink;
	createAccount: WelcomeLink;
	back: WelcomeLink;
}

const BUTTON =
	"flex h-11 flex-1 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-all duration-300";

/** The welcome content shared by the studio and generic versions. */
export function WelcomeCard({
	tone,
	brand,
	title,
	subtitle,
	points,
	hint,
	signIn,
	createAccount,
	back,
}: WelcomeCardProps) {
	return (
		<div
			className={cn(
				"flex w-full max-w-lg flex-col gap-7 rounded-3xl border p-8 shadow-2xl backdrop-blur-xl md:p-10",
				tone.card,
			)}
		>
			<div className="flex items-center gap-3">{brand}</div>

			<div className="flex flex-col gap-3">
				<h1
					className={cn(
						"text-3xl font-bold leading-tight tracking-tight",
						tone.heading,
					)}
				>
					{title}
				</h1>
				<p className={cn("text-sm leading-relaxed", tone.muted)}>{subtitle}</p>
			</div>

			<ul className="flex flex-col gap-3">
				{points.map((point, index) => {
					const Icon = POINT_ICONS[index % POINT_ICONS.length];
					return (
						<li key={point} className="flex items-center gap-3 text-sm">
							<Icon className={cn("h-4 w-4 shrink-0", tone.accent)} />
							{point}
						</li>
					);
				})}
			</ul>

			<div className="flex flex-col gap-3 sm:flex-row">
				<Link href={signIn.href} className={cn(BUTTON, tone.primary)}>
					{signIn.label}
				</Link>
				<Link href={createAccount.href} className={cn(BUTTON, tone.secondary)}>
					{createAccount.label}
				</Link>
			</div>

			<p className={cn("text-xs leading-relaxed", tone.muted)}>{hint}</p>

			<Link
				href={back.href}
				className={cn(
					"flex w-fit items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70",
					tone.muted,
				)}
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				{back.label}
			</Link>
		</div>
	);
}
