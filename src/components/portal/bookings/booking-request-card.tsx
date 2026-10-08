import { CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { PortalBookingSummary } from "@/services/portal/booking-queries";

/** What the client has to do about a request, as a short label and tone. */
export function requestState(booking: {
	status: PortalBookingSummary["status"];
	accepted: boolean;
}) {
	if (booking.status === "CONFIRMED")
		return { key: "confirmed", tone: "text-success bg-success/10" } as const;
	if (booking.status === "DECLINED")
		return {
			key: "declined",
			tone: "text-destructive bg-destructive/10",
		} as const;
	if (booking.accepted)
		return {
			key: "waitingStudio",
			tone: "text-primary bg-primary/10",
		} as const;
	return { key: "toAnswer", tone: "text-primary bg-primary/10" } as const;
}

export async function BookingRequestCard({
	booking,
}: {
	booking: PortalBookingSummary;
}) {
	const t = await getTranslations("Portal.bookings");
	const format = await getFormatter();
	const state = requestState(booking);

	return (
		<Link
			href={`/portal/bookings/${booking.id}`}
			className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40"
		>
			<div className="min-w-0">
				<p className="truncate font-medium group-hover:text-primary">
					{booking.title}
				</p>
				<p className="flex items-center gap-2 text-xs text-muted-foreground">
					<span className="truncate">{booking.studioName}</span>
					{booking.desiredDate && (
						<span className="flex shrink-0 items-center gap-1">
							<CalendarDays className="h-3 w-3" />
							{format.dateTime(new Date(booking.desiredDate), {
								dateStyle: "medium",
								timeZone: "UTC",
							})}
						</span>
					)}
				</p>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<span
					className={cn(
						"rounded px-1.5 py-0.5 text-[10px] font-medium",
						state.tone,
					)}
				>
					{t(`state.${state.key}`)}
				</span>
				<ChevronRight className="h-4 w-4 text-muted-foreground" />
			</div>
		</Link>
	);
}
