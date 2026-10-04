import { Camera } from "lucide-react";
import Image from "next/image";
import type { StudioBrand } from "@/services/clients/branding";

/** Photographer identity shown above their projects and galleries. */
export function StudioHeading({
	studio,
	fallbackName,
}: {
	studio: StudioBrand | null;
	fallbackName: string;
}) {
	return (
		<div className="flex items-center gap-2.5">
			<div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
				{studio?.logoUrl ? (
					<Image
						src={studio.logoUrl}
						alt=""
						fill
						sizes="32px"
						className="object-contain"
					/>
				) : (
					<Camera className="h-4 w-4 text-muted-foreground" />
				)}
			</div>
			<p className="text-sm font-semibold">{studio?.name ?? fallbackName}</p>
		</div>
	);
}
