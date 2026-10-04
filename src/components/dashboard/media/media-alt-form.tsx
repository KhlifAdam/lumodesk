"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useErrorMessage } from "@/hooks/use-error-message";
import { updateMedia } from "@/services/media/actions";
import type { MediaItem } from "@/services/media/types";

const schema = z.object({ alt: z.string().trim().max(300, "tooLong") });
type Values = z.infer<typeof schema>;

export function MediaAltForm({ media }: { media: MediaItem }) {
	const t = useTranslations("Media.detail");
	const errorMessage = useErrorMessage();

	const form = useForm<Values>({
		resolver: zodResolver(schema),
		values: { alt: media.alt ?? "" },
	});
	const { isSubmitting, isDirty } = form.formState;

	async function onSubmit({ alt }: Values) {
		const result = await updateMedia({ id: media.id, alt });
		if (!result.ok) return toast.error(errorMessage(result.error));
		toast.success(t("saved"));
		form.reset({ alt });
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-3"
			>
				<FormField
					control={form.control}
					name="alt"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("altLabel")}</FormLabel>
							<FormControl>
								<Textarea
									rows={3}
									placeholder={t("altPlaceholder")}
									{...field}
								/>
							</FormControl>
							<FormDescription>{t("altHint")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					size="sm"
					className="self-end"
					disabled={!isDirty || isSubmitting}
				>
					{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{t("save")}
				</Button>
			</form>
		</Form>
	);
}
