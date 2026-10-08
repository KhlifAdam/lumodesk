import { getFormatter, getTranslations } from "next-intl/server";
import { getRequestTimeZone } from "@/lib/request-time-zone";
import type { BookingActivityItem } from "@/services/bookings/types";
import { BookingNoteForm } from "./booking-note-form";

/** History of the request: creation, status changes and follow-up notes. */
export async function BookingActivity({
	bookingId,
	activities,
}: {
	bookingId: string;
	activities: BookingActivityItem[];
}) {
	const t = await getTranslations("Bookings.activity");
	const tStatus = await getTranslations("Bookings.status");
	const format = await getFormatter();
	const timeZone = await getRequestTimeZone();

	const label = (activity: BookingActivityItem) => {
		if (activity.kind === "CREATED") return t("created");
		if (activity.kind === "NOTE") return null;
		return t("statusChanged", {
			status: activity.toStatus ? tStatus(activity.toStatus) : "",
		});
	};

	return (
		<section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
			<h2 className="text-xs font-medium text-muted-foreground">
				{t("title")}
			</h2>
			<BookingNoteForm bookingId={bookingId} />
			<ol className="flex flex-col gap-2.5">
				{activities.map((activity) => (
					<li key={activity.id} className="flex gap-2.5">
						<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
						<div className="min-w-0 flex-1">
							{label(activity) && (
								<p className="text-xs font-medium">{label(activity)}</p>
							)}
							{activity.body && (
								<p className="whitespace-pre-wrap break-words text-sm">
									{activity.body}
								</p>
							)}
							<p className="text-[11px] text-muted-foreground">
								{format.dateTime(new Date(activity.createdAt), {
									dateStyle: "medium",
									timeStyle: "short",
									timeZone,
								})}
							</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
