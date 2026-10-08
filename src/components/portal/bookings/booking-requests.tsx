import { getTranslations } from "next-intl/server";
import { requireClient } from "@/lib/auth/require-client";
import { listPortalBookings } from "@/services/portal/booking-queries";
import { BookingRequestCard } from "./booking-request-card";

/** Requests a studio sent to this client; nothing renders when there are none. */
export async function BookingRequests() {
	const t = await getTranslations("Portal.bookings");
	const { session } = await requireClient();
	const bookings = await listPortalBookings(session.user);
	if (bookings.length === 0) return null;

	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-sm font-semibold">
				{t("title", { count: bookings.length })}
			</h2>
			<div className="grid gap-3 sm:grid-cols-2">
				{bookings.map((booking) => (
					<BookingRequestCard key={booking.id} booking={booking} />
				))}
			</div>
		</section>
	);
}
