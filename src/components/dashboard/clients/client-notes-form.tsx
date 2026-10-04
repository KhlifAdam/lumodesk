"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TextField } from "@/components/dashboard/shared/form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useErrorMessage } from "@/hooks/use-error-message";
import { updateClientNotes } from "@/services/clients/actions";
import {
	type ClientNotesValues,
	clientNotesSchema,
} from "@/services/clients/schemas";

/** Notes only the photographer sees. */
export function ClientNotesForm({
	clientId,
	notes,
}: {
	clientId: string;
	notes: string;
}) {
	const t = useTranslations("Clients.notes");
	const errorMessage = useErrorMessage();
	const form = useForm<ClientNotesValues>({
		resolver: zodResolver(clientNotesSchema),
		defaultValues: { notes },
	});
	const { isSubmitting, isDirty } = form.formState;

	async function onSubmit(values: ClientNotesValues) {
		const result = await updateClientNotes({ clientId, ...values });
		if (!result.ok) return void toast.error(errorMessage(result.error));
		form.reset(values);
		toast.success(t("saved"));
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3"
			>
				<TextField<ClientNotesValues>
					name="notes"
					label={t("label")}
					description={t("hint")}
					placeholder={t("placeholder")}
					rows={5}
				/>
				<Button
					type="submit"
					size="sm"
					className="h-7 self-end text-xs"
					disabled={!isDirty || isSubmitting}
				>
					{isSubmitting && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
					{t("save")}
				</Button>
			</form>
		</Form>
	);
}
