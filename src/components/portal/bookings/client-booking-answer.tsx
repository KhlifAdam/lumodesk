"use client";

import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { DeclineDialog } from "@/components/dashboard/bookings/decline-dialog";
import { Button } from "@/components/ui/button";
import { useErrorMessage } from "@/hooks/use-error-message";
import { answerBooking } from "@/services/bookings/client-actions";

interface ClientBookingAnswerProps {
	bookingId: string;
	/** The studio still has to add the date or the price. */
	incomplete: boolean;
	/** Unsaved changes would be lost: they must be saved first. */
	hasUnsavedChanges?: boolean;
}

/** Accept the proposal or decline the request. */
export function ClientBookingAnswer({
	bookingId,
	incomplete,
}: ClientBookingAnswerProps) {
	const t = useTranslations("Portal.bookings.answer");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [isPending, startTransition] = useTransition();
	const [reason, setReason] = useState("");

	const answer = (accept: boolean) =>
		startTransition(async () => {
			const result = await answerBooking({ id: bookingId, accept, reason });
			if (!result.ok) return void toast.error(errorMessage(result.error));
			toast.success(accept ? t("accepted") : t("declined"));
			router.refresh();
		});

	return (
		<div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
			<div>
				<h2 className="text-sm font-semibold">{t("title")}</h2>
				<p className="text-xs text-muted-foreground">
					{incomplete ? t("incomplete") : t("hint")}
				</p>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Button
					size="sm"
					className="h-8 gap-1.5 text-xs"
					disabled={isPending || incomplete}
					onClick={() => answer(true)}
				>
					{isPending ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<Check className="h-3.5 w-3.5" />
					)}
					{t("accept")}
				</Button>
				<DeclineDialog
					title={t("declineTitle")}
					description={t("declineDescription")}
					trigger={t("decline")}
					reason={reason}
					onReason={setReason}
					disabled={isPending}
					onConfirm={() => answer(false)}
				/>
			</div>
		</div>
	);
}
