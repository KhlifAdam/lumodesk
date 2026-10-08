"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { TextField } from "@/components/dashboard/shared/form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useErrorMessage } from "@/hooks/use-error-message";
import { updateBookingAsClient } from "@/services/bookings/client-actions";
import { clientEditSchema } from "@/services/bookings/schemas";
import type { PortalBookingDetail } from "@/services/portal/booking-queries";

const formSchema = clientEditSchema.omit({ id: true });
type FormValues = z.infer<typeof formSchema>;

const isUrl = (value: string) => /^https?:\/\//i.test(value);

/** The client's part of the request: when, where and what they need. */
export function ClientBookingForm({
	booking,
}: {
	booking: PortalBookingDetail;
}) {
	const t = useTranslations("Portal.bookings.form");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: booking.description,
			desiredDate: booking.desiredDate?.slice(0, 10) ?? "",
			startTime: booking.startTime,
			durationHours: booking.durationMinutes
				? booking.durationMinutes / 60
				: null,
			location: booking.location,
			clientBudget: booking.clientBudget,
		},
	});
	const { isSubmitting, isDirty } = form.formState;
	const location = useWatch({ control: form.control, name: "location" });

	async function onSubmit(values: FormValues) {
		const result = await updateBookingAsClient({ ...values, id: booking.id });
		if (!result.ok) return void toast.error(errorMessage(result.error));
		toast.success(t("saved"));
		form.reset(values);
		router.refresh();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
			>
				<div>
					<h2 className="text-sm font-semibold">{t("title")}</h2>
					<p className="text-xs text-muted-foreground">{t("hint")}</p>
				</div>
				<TextField<FormValues>
					name="description"
					label={t("description")}
					description={t("descriptionHint")}
					rows={3}
				/>
				<div className="grid gap-3 sm:grid-cols-3">
					<TextField<FormValues>
						name="desiredDate"
						label={t("date")}
						type="date"
					/>
					<TextField<FormValues>
						name="startTime"
						label={t("startTime")}
						type="time"
					/>
					<TextField<FormValues>
						name="durationHours"
						label={t("duration")}
						type="number"
						step="0.5"
					/>
				</div>
				<div className="flex items-start gap-2">
					<TextField<FormValues>
						name="location"
						label={t("location")}
						description={t("locationHint")}
						placeholder="https://maps.google.com/…"
						className="flex-1"
					/>
					{isUrl(location) && (
						<Button
							asChild
							variant="outline"
							size="sm"
							className="mt-5 h-8 gap-1.5 text-xs"
						>
							<a href={location} target="_blank" rel="noopener noreferrer">
								<ExternalLink className="h-3.5 w-3.5" />
								{t("openMap")}
							</a>
						</Button>
					)}
				</div>
				<TextField<FormValues>
					name="clientBudget"
					label={t("budget")}
					description={t("budgetHint")}
					type="number"
					step="0.001"
					className="sm:max-w-xs"
				/>
				<div className="flex justify-end">
					<Button type="submit" size="sm" disabled={isSubmitting || !isDirty}>
						{isSubmitting && (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						)}
						{t("save")}
					</Button>
				</div>
			</form>
		</Form>
	);
}
