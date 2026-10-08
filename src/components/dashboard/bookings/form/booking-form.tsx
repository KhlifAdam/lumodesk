"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useErrorMessage } from "@/hooks/use-error-message";
import { createBooking, updateBooking } from "@/services/bookings/actions";
import { type BookingValues, bookingSchema } from "@/services/bookings/schemas";
import { BookingClientSection } from "./booking-client-section";
import { BookingNeedSection } from "./booking-need-section";
import { BookingQuoteSection } from "./booking-quote-section";

interface BookingFormProps {
	initial: BookingValues;
	/** Edit mode when set. */
	bookingId?: string;
}

export function BookingForm({ initial, bookingId }: BookingFormProps) {
	const t = useTranslations("Bookings.form");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const form = useForm<BookingValues>({
		resolver: zodResolver(bookingSchema),
		defaultValues: initial,
	});
	const { isSubmitting } = form.formState;
	const cancelHref = bookingId
		? `/dashboard/bookings/${bookingId}`
		: "/dashboard/bookings";

	async function onSubmit(values: BookingValues) {
		if (bookingId) {
			const result = await updateBooking({ ...values, id: bookingId });
			if (!result.ok) return void toast.error(errorMessage(result.error));
			toast.success(t("updated"));
			router.push(cancelHref);
			return router.refresh();
		}
		const result = await createBooking(values);
		if (!result.ok) return void toast.error(errorMessage(result.error));
		toast.success(t("created"));
		router.push(`/dashboard/bookings/${result.data.id}`);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex max-w-3xl flex-col gap-4"
			>
				<p className="text-xs text-muted-foreground">{t("requiredNote")}</p>
				<BookingClientSection />
				<BookingNeedSection />
				<BookingQuoteSection />
				<div className="sticky bottom-4 z-20 flex justify-end gap-2 rounded-xl border border-border bg-card/80 p-3 backdrop-blur-md">
					<Button asChild type="button" variant="ghost" size="sm">
						<Link href={cancelHref}>{t("cancel")}</Link>
					</Button>
					<Button type="submit" size="sm" disabled={isSubmitting}>
						{isSubmitting && (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						)}
						{bookingId ? t("save") : t("create")}
					</Button>
				</div>
			</form>
		</Form>
	);
}
