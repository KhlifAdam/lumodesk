import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/services/bookings/options";

const TONE: Record<BookingStatus, string> = {
	NEW: "border-primary/40 bg-primary/10 text-primary",
	DISCUSSION: "border-event-meeting/40 bg-event-meeting/10 text-event-meeting",
	QUOTE_SENT: "border-event-other/40 bg-event-other/10 text-event-other",
	CONFIRMED: "border-success/40 bg-success/10 text-success",
	DECLINED: "border-destructive/40 bg-destructive/10 text-destructive",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
	const t = useTranslations("Bookings.status");

	return (
		<Badge
			variant="outline"
			className={cn("h-5 px-1.5 text-[10px] font-medium", TONE[status])}
		>
			{t(status)}
		</Badge>
	);
}
