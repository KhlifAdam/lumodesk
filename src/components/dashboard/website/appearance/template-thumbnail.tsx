import type { SiteTemplate } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const PLACEHOLDER_KEYS = ["a", "b", "c", "d", "e", "f"];

/** Schematic wireframe of each template's layout, tinted with the accent. */
export function TemplateThumbnail({
	template,
	accent,
}: {
	template: SiteTemplate;
	accent: string;
}) {
	const isBold = template === "BOLD";

	return (
		<div
			className={cn(
				"flex aspect-[4/3] w-full flex-col gap-1.5 overflow-hidden rounded-md p-2",
				isBold ? "bg-foreground" : "bg-muted/60",
			)}
		>
			{/* Nav */}
			<div className="flex items-center justify-between">
				<div
					className="h-1.5 w-6 rounded-full"
					style={{ background: accent }}
				/>
				<div className="flex gap-1">
					{PLACEHOLDER_KEYS.slice(0, 3).map((key) => (
						<div
							key={key}
							className={cn(
								"h-1 w-3 rounded-full",
								isBold ? "bg-background/40" : "bg-foreground/20",
							)}
						/>
					))}
				</div>
			</div>

			{template === "MINIMAL" && (
				<>
					<div className="mx-auto mt-1 h-1.5 w-1/3 rounded-full bg-foreground/30" />
					<div className="grid flex-1 grid-cols-3 gap-1">
						{PLACEHOLDER_KEYS.map((key) => (
							<div key={key} className="rounded-sm bg-foreground/15" />
						))}
					</div>
				</>
			)}

			{template === "EDITORIAL" && (
				<div className="grid flex-1 grid-cols-5 gap-1.5">
					<div className="col-span-3 rounded-sm bg-foreground/20" />
					<div className="col-span-2 flex flex-col justify-center gap-1">
						<div className="h-2 w-full rounded-sm bg-foreground/40" />
						<div className="h-1 w-4/5 rounded-full bg-foreground/15" />
						<div className="h-1 w-3/5 rounded-full bg-foreground/15" />
						<div
							className="mt-1 h-1.5 w-1/2 rounded-full"
							style={{ background: accent }}
						/>
					</div>
				</div>
			)}

			{isBold && (
				<>
					<div className="flex flex-1 flex-col justify-end gap-1 rounded-sm bg-background/10 p-1.5">
						<div
							className="h-2.5 w-3/4 rounded-sm"
							style={{ background: accent }}
						/>
						<div className="h-1 w-1/2 rounded-full bg-background/40" />
					</div>
					<div className="grid h-1/4 grid-cols-4 gap-1">
						{PLACEHOLDER_KEYS.slice(0, 4).map((key) => (
							<div key={key} className="rounded-sm bg-background/20" />
						))}
					</div>
				</>
			)}
		</div>
	);
}
