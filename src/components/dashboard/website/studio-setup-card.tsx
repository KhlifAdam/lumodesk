"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSlugAvailability } from "@/components/dashboard/website/use-slug-availability";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useErrorMessage } from "@/hooks/use-error-message";
import { slugify } from "@/lib/slugify";
import { createStudio } from "@/services/studio/actions";
import {
	type CreateStudioValues,
	createStudioSchema,
} from "@/services/studio/schemas";
import { SlugInput } from "./slug-input";

/** First-run card: name the studio and claim its public URL. */
export function StudioSetupCard({ defaultName }: { defaultName: string }) {
	const t = useTranslations("Site.setup");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const form = useForm<CreateStudioValues>({
		resolver: zodResolver(createStudioSchema),
		defaultValues: { name: defaultName, slug: slugify(defaultName) },
	});
	const { isSubmitting, dirtyFields } = form.formState;
	const slugStatus = useSlugAvailability(form.watch("slug"));

	async function onSubmit(values: CreateStudioValues) {
		const result = await createStudio(values);
		if (!result.ok) return toast.error(errorMessage(result.error));
		toast.success(t("created"));
		router.refresh();
	}

	return (
		<div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-luminous">
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Sparkles className="h-4 w-4" />
				</div>
				<div className="flex flex-col">
					<h2 className="text-sm font-semibold">{t("title")}</h2>
					<p className="text-xs text-muted-foreground">{t("description")}</p>
				</div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-3"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("name")}</FormLabel>
								<FormControl>
									<Input
										className="h-8"
										{...field}
										onChange={(event) => {
											field.onChange(event);
											if (!dirtyFields.slug)
												form.setValue("slug", slugify(event.target.value));
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("url")}</FormLabel>
								<FormControl>
									<SlugInput status={slugStatus} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						size="sm"
						disabled={isSubmitting || slugStatus === "taken"}
					>
						{isSubmitting && (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						)}
						{t("submit")}
					</Button>
				</form>
			</Form>
		</div>
	);
}
