"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { MESSAGE_MAX_LENGTH } from "@/services/messages/constants";
import {
	type ComposerValues,
	composerSchema,
} from "@/services/messages/schemas";

interface MessageComposerProps {
	/** Resolves to an error code, or null once sent. */
	onSend: (body: string) => Promise<string | null>;
}

/** Enter sends, Shift+Enter adds a line. */
export function MessageComposer({ onSend }: MessageComposerProps) {
	const t = useTranslations("Messages.composer");
	const errorMessage = useErrorMessage();
	const form = useForm<ComposerValues>({
		resolver: zodResolver(composerSchema),
		defaultValues: { body: "" },
	});
	const { isSubmitting } = form.formState;

	async function onSubmit({ body }: ComposerValues) {
		const error = await onSend(body);
		if (error) return void toast.error(errorMessage(error));
		form.reset({ body: "" });
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex items-end gap-2 border-t border-border p-3"
			>
				<FormField
					control={form.control}
					name="body"
					render={({ field }) => (
						<FormItem className="flex-1 space-y-1">
							<FormControl>
								<Textarea
									rows={1}
									maxLength={MESSAGE_MAX_LENGTH}
									placeholder={t("placeholder")}
									aria-label={t("placeholder")}
									className="max-h-32 min-h-9 resize-none text-sm [field-sizing:content]"
									onKeyDown={(event) => {
										if (event.key !== "Enter" || event.shiftKey) return;
										if (event.nativeEvent.isComposing) return;
										event.preventDefault();
										form.handleSubmit(onSubmit)();
									}}
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
					aria-label={t("send")}
				>
					{isSubmitting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<SendHorizontal className="h-4 w-4" />
					)}
				</Button>
			</form>
		</Form>
	);
}
