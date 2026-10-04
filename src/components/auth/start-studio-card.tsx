"use client";

import { Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useErrorMessage } from "@/hooks/use-error-message";
import { AUTH_PATHS } from "@/lib/auth/client-intent";
import { upgradeToPhotographer } from "@/services/auth/account-actions";
import { AuthHeading } from "./auth-heading";

/** Offered to client accounts that open the photographer space. */
export function StartStudioCard({ email }: { email: string }) {
	const t = useTranslations("Auth.startStudio");
	const errorMessage = useErrorMessage();
	const [isPending, startTransition] = useTransition();

	const start = () =>
		startTransition(async () => {
			const result = await upgradeToPhotographer();
			if (!result.ok) return void toast.error(errorMessage(result.error));
			// Full navigation so the new role is read from a fresh session.
			window.location.assign("/dashboard/site");
		});

	return (
		<div className="flex flex-col space-y-6">
			<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
				<Camera className="h-6 w-6" />
			</div>
			<AuthHeading
				title={t("title")}
				description={t("description", { email })}
			/>
			<Button onClick={start} disabled={isPending}>
				{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				{t("submit")}
			</Button>
			<Link
				href={AUTH_PATHS.client.home}
				className="text-center text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
			>
				{t("back")}
			</Link>
		</div>
	);
}
