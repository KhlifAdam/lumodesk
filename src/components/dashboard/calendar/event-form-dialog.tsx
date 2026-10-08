"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ConfirmDeleteButton } from "@/components/dashboard/shared/confirm-delete-button";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useErrorMessage } from "@/hooks/use-error-message";
import {
	createCalendarEvent,
	deleteCalendarEvent,
	updateCalendarEvent,
} from "@/services/calendar/actions";
import { valuesToPayload } from "@/services/calendar/form-values";
import {
	type EventFormValues,
	eventFormSchema,
} from "@/services/calendar/schemas";
import type { ProjectOption } from "@/services/calendar/types";
import { EventFormFields } from "./event-form-fields";

/** What the dialog is editing: a new event, or an existing one by id. */
export interface EventDraft {
	id?: string;
	values: EventFormValues;
}

interface EventFormDialogProps {
	draft: EventDraft | null;
	onClose: () => void;
	timeZone: string;
	projects: ProjectOption[];
}

export function EventFormDialog({
	draft,
	onClose,
	timeZone,
	projects,
}: EventFormDialogProps) {
	const t = useTranslations("Calendar.form");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const form = useForm<EventFormValues>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: draft?.values,
	});
	const { isSubmitting } = form.formState;
	const id = draft?.id;

	useEffect(() => {
		if (draft) form.reset(draft.values);
	}, [draft, form]);

	async function onSubmit(values: EventFormValues) {
		const event = valuesToPayload(values, timeZone);
		const result = id
			? await updateCalendarEvent({ id, event })
			: await createCalendarEvent(event);
		if (!result.ok) return void toast.error(errorMessage(result.error));

		const { conflicts } = result.data;
		if (conflicts > 0) toast.warning(t("conflicts", { count: conflicts }));
		else toast.success(id ? t("updated") : t("created"));
		onClose();
		router.refresh();
	}

	async function onDelete() {
		if (!id) return;
		const result = await deleteCalendarEvent(id);
		if (!result.ok) return void toast.error(errorMessage(result.error));
		toast.success(t("deleted"));
		onClose();
		router.refresh();
	}

	return (
		<Dialog open={draft !== null} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{id ? t("editTitle") : t("createTitle")}</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-3"
					>
						<EventFormFields projects={projects} />
						<DialogFooter className="mt-1 flex-row items-center sm:justify-between">
							{id ? (
								<ConfirmDeleteButton
									title={t("deleteTitle")}
									description={t("deleteDescription")}
									onConfirm={onDelete}
								/>
							) : (
								<span />
							)}
							<Button type="submit" size="sm" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
								)}
								{id ? t("save") : t("create")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
