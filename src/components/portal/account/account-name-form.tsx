"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { requiredText } from "@/services/shared/schemas";

const schema = z.object({ name: requiredText(80) });
type NameValues = z.infer<typeof schema>;

export function AccountNameForm({ name }: { name: string }) {
	const t = useTranslations("Portal.account");
	const router = useRouter();
	const authError = useAuthError();
	const form = useForm<NameValues>({
		resolver: zodResolver(schema),
		defaultValues: { name },
	});
	const { isSubmitting, isDirty } = form.formState;

	async function onSubmit(values: NameValues) {
		const { error } = await authClient.updateUser(values);
		if (error) return void toast.error(authError.message(error));
		toast.success(t("saved"));
		form.reset(values);
		router.refresh();
	}

	return (
		<section className="rounded-xl border border-border bg-card p-4">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-wrap items-end gap-2"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="space-y-1">
								<FormLabel className="text-xs text-muted-foreground">
									{t("name")}
								</FormLabel>
								<FormControl>
									<Input
										autoComplete="name"
										className="h-8 w-64 text-sm"
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
						disabled={isSubmitting || !isDirty}
					>
						{isSubmitting && (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						)}
						{t("save")}
					</Button>
				</form>
			</Form>
		</section>
	);
}
