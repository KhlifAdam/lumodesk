"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthError } from "@/components/auth/use-auth-error";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { requiredText } from "@/services/shared/schemas";

const schema = z.object({ name: requiredText(80) });
type NameValues = z.infer<typeof schema>;

/** A client who signed up by phone starts with their number as a name. */
export function NameCard() {
	const t = useTranslations("Portal.name");
	const router = useRouter();
	const authError = useAuthError();
	const form = useForm<NameValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: "" },
	});
	const { isSubmitting } = form.formState;

	async function onSubmit({ name }: NameValues) {
		const { error } = await authClient.updateUser({ name });
		if (error) return void toast.error(authError.message(error));
		toast.success(t("saved"));
		router.refresh();
	}

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
			<div className="flex items-start gap-3">
				<UserRound className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
				<div>
					<p className="text-sm font-medium">{t("title")}</p>
					<p className="text-xs text-muted-foreground">{t("description")}</p>
				</div>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="flex-1 space-y-1">
								<FormControl>
									<Input
										autoComplete="name"
										placeholder={t("placeholder")}
										aria-label={t("placeholder")}
										className="h-8 max-w-xs text-sm"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						size="sm"
						className="h-8 text-xs"
						disabled={isSubmitting}
					>
						{isSubmitting && (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						)}
						{t("save")}
					</Button>
				</form>
			</Form>
		</div>
	);
}
