"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
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
import { AUTH_PATHS, type AuthAudience } from "@/lib/auth/client-intent";
import { ROLES } from "@/lib/auth/roles";
import { AudienceBadge } from "./audience-badge";
import { AudienceSwitch } from "./audience-switch";
import { AuthHeading } from "./auth-heading";
import { ClientBackLink } from "./client-back-link";
import { PasswordInput } from "./password-input";
import { type LoginValues, loginSchema } from "./schemas";
import { SocialLogin } from "./social-login";
import { useAuthError } from "./use-auth-error";

/**
 * Roles allowed to sign in on each side's page. A photographer can also be a
 * client of another studio, so the client page takes both.
 */
const AUDIENCE_ROLES: Record<AuthAudience, string[]> = {
	photographer: [ROLES.photographer, ROLES.admin],
	client: [ROLES.client, ROLES.photographer],
};

export function LoginForm({ audience }: { audience: AuthAudience }) {
	const t = useTranslations("Auth");
	const isClient = audience === "client";
	const paths = AUTH_PATHS[audience];
	const authError = useAuthError();
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});
	const { isSubmitting } = form.formState;

	async function onSubmit(values: LoginValues) {
		try {
			const { data, error } = await authClient.signIn.email(values);
			if (error) return void toast.error(authError.message(error));
			// Each side only takes its own accounts: sign back out and point the
			// person to the right page.
			if (!AUDIENCE_ROLES[audience].includes(data?.user.role ?? "")) {
				await authClient.signOut();
				return void toast.error(t(`login.wrongAudience.${audience}`));
			}
			toast.success(t("login.success"));
			window.location.assign(paths.home);
		} catch {
			toast.error(authError.network);
		}
	}

	return (
		<div className="flex flex-col space-y-6">
			{isClient && <ClientBackLink />}
			<AuthHeading
				title={t(isClient ? "client.login.title" : "login.title")}
				description={t(
					isClient ? "client.login.description" : "login.description",
				)}
				badge={<AudienceBadge audience={audience} />}
				highlights={t(`highlights.${audience}`)}
			/>

			<div className="grid gap-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("login.email")}</FormLabel>
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
									<div className="flex items-center justify-between">
										<FormLabel>{t("login.password")}</FormLabel>
										<Link
											href="/forgot-password"
											className="text-sm font-medium text-primary hover:underline"
										>
											{t("login.forgot")}
										</Link>
									</div>
									<FormControl>
										<PasswordInput
											visible={showPassword}
											onToggleVisible={() => setShowPassword((v) => !v)}
											placeholder="••••••••"
											autoComplete="current-password"
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
							{t("login.submit")}
						</Button>
					</form>
				</Form>

				<SocialLogin disabled={isSubmitting} audience={audience} />
			</div>

			<p className="px-8 text-center text-sm text-muted-foreground">
				{t("login.noAccount")}{" "}
				<Link
					href={paths.register}
					className="underline underline-offset-4 hover:text-primary"
				>
					{t("login.signUp")}
				</Link>
			</p>
			<AudienceSwitch audience={audience} screen="login" />
		</div>
	);
}
