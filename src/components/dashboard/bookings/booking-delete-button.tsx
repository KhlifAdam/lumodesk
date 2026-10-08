"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmDeleteButton } from "@/components/dashboard/shared/confirm-delete-button";
import { useErrorMessage } from "@/hooks/use-error-message";
import { deleteBooking } from "@/services/bookings/actions";

export function BookingDeleteButton({ bookingId }: { bookingId: string }) {
	const t = useTranslations("Bookings.detail");
	const router = useRouter();
	const errorMessage = useErrorMessage();

	return (
		<ConfirmDeleteButton
			title={t("deleteTitle")}
			description={t("deleteDescription")}
			onConfirm={async () => {
				const result = await deleteBooking(bookingId);
				if (!result.ok) return void toast.error(errorMessage(result.error));
				toast.success(t("deleted"));
				router.push("/dashboard/bookings");
			}}
		/>
	);
}
