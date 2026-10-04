"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { AuthHeading } from "./auth-heading";
import { PasswordInput } from "./password-input";
import { type RegisterValues, registerSchema } from "./schemas";
import { SocialLogin } from "./social-login";
import { useAuthError } from "./use-auth-error";

export function RegisterForm() {
	const t = useTranslations("Auth");
	const router = useRouter();
	const authError = useAuthError();
	const [showPasswords, setShowPasswords] = useState(false);
	const form = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: { email: "", password: "", confirmPassword: "" },
	});
	const { isSubmitting } = form.formState;

	async function onSubmit({ email, password }: RegisterValues) {
		try {
			const { error } = await authClient.signUp.email({
				email,
				password,
				// The studio name is asked later; start from the address's local part.
				name: email.split("@")[0] || email,
			});
			if (error) return void toast.error(authError.message(error));
			toast.success(t("register.success"));
			router.push("/dashboard");
			router.refresh();
		} catch {
			toast.error(authError.network);
		}
	}

	return (
		<div className="flex flex-col space-y-6">
			<AuthHeading
				title={t("register.title")}
				description={t("register.description")}
			/>

			<div className="grid gap-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("register.email")}</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder={t("shared.emailPlaceholder")}
											autoCapitalize="none"
											autoComplete="email"
											autoCorrect="off"
											readOnly={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("register.password")}</FormLabel>
									<FormControl>
										<PasswordInput
											visible={showPasswords}
											onToggleVisible={() => setShowPasswords((v) => !v)}
											placeholder="••••••••"
											autoComplete="new-password"
											readOnly={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("register.confirmPassword")}</FormLabel>
									<FormControl>
										<PasswordInput
											visible={showPasswords}
											placeholder="••••••••"
											autoComplete="new-password"
											readOnly={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={isSubmitting} className="mt-2">
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("register.submit")}
						</Button>
					</form>
				</Form>

				<SocialLogin disabled={isSubmitting} />
			</div>

			<p className="px-8 text-center text-sm text-muted-foreground">
				{t("register.haveAccount")}{" "}
				<Link
					href="/login"
					className="underline underline-offset-4 hover:text-primary"
				>
					{t("register.signIn")}
				</Link>
			</p>
		</div>
	);
}
