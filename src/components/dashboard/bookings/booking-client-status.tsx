import { CircleCheck, Clock, Send } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

interface BookingClientStatusProps {
	sentToClientAt: string | null;
	clientAcceptedAt: string | null;
}

/** Where the request stands with the client: not sent, waiting, or accepted. */
export async function BookingClientStatus({
	sentToClientAt,
	clientAcceptedAt,
}: BookingClientStatusProps) {
	const t = await getTranslations("Bookings.clientStatus");
	const format = await getFormatter();
	const when = (iso: string) =>
		format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" });

	const state = clientAcceptedAt
		? {
				Icon: CircleCheck,
				tone: "border-success/40 bg-success/5 text-success",
				text: t("accepted", { date: when(clientAcceptedAt) }),
			}
		: sentToClientAt
			? {
					Icon: Clock,
					tone: "border-primary/40 bg-primary/5 text-primary",
					text: t("waiting", { date: when(sentToClientAt) }),
				}
			: {
					Icon: Send,
					tone: "border-border bg-muted/40 text-muted-foreground",
					text: t("notSent"),
				};

	return (
		<p
			className={cn(
				"flex w-fit items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium",
				state.tone,
			)}
		>
			<state.Icon className="h-3.5 w-3.5 shrink-0" />
			{state.text}
		</p>
	);
}
