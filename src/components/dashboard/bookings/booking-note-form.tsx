"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useErrorMessage } from "@/hooks/use-error-message";
import { addBookingNote } from "@/services/bookings/status-actions";
import { requiredText } from "@/services/shared/schemas";

const formSchema = z.object({ body: requiredText(2000) });
type NoteValues = z.infer<typeof formSchema>;

/** Records a follow-up in the booking history. */
export function BookingNoteForm({ bookingId }: { bookingId: string }) {
	const t = useTranslations("Bookings.activity");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const form = useForm<NoteValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { body: "" },
	});
	const { isSubmitting } = form.formState;

	async function onSubmit(values: NoteValues) {
		const result = await addBookingNote({ id: bookingId, ...values });
		if (!result.ok) return void toast.error(errorMessage(result.error));
		form.reset({ body: "" });
		router.refresh();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
				<FormField
					control={form.control}
					name="body"
					render={({ field }) => (
						<FormItem className="flex-1 space-y-1">
							<FormControl>
								<Textarea
									rows={2}
									placeholder={t("placeholder")}
									aria-label={t("placeholder")}
									className="min-h-0 text-sm"
									{...field}
								/>
							</FormControl>
							<FormMessage className="text-xs" />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					size="icon"
					className="h-9 w-9 shrink-0"
					disabled={isSubmitting}
					aria-label={t("add")}
				>
					{isSubmitting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Send className="h-4 w-4" />
					)}
				</Button>
			</form>
		</Form>
	);
}
