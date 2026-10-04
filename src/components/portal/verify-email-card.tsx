"use client";

import { Loader2, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { OTP_LENGTH } from "@/components/auth/schemas";
import { useAuthError } from "@/components/auth/use-auth-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";

/** Invitations stay hidden until the address is proven with a 6-digit code. */
export function VerifyEmailCard({
	email,
	count,
}: {
	email: string;
	count: number;
}) {
	const t = useTranslations("Portal.verify");
	const router = useRouter();
	const authError = useAuthError();
	const [sent, setSent] = useState(false);
	const [otp, setOtp] = useState("");
	const [isPending, startTransition] = useTransition();

	const send = () =>
		startTransition(async () => {
			const { error } = await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "email-verification",
			});
			if (error) return void toast.error(authError.message(error));
			setSent(true);
			toast.success(t("sent"));
		});

	const verify = () =>
		startTransition(async () => {
			const { error } = await authClient.emailOtp.verifyEmail({ email, otp });
			if (error) return void toast.error(authError.message(error));
			toast.success(t("verified"));
			router.refresh();
		});

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
			<div className="flex items-start gap-3">
				<MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
				<div>
					<p className="text-sm font-medium">{t("title", { count })}</p>
					<p className="text-xs text-muted-foreground">
						{t("description", { email })}
					</p>
				</div>
			</div>
			{sent ? (
				<form
					className="flex flex-wrap gap-2"
					onSubmit={(event) => {
						event.preventDefault();
						verify();
					}}
				>
					<Input
						value={otp}
						onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
						inputMode="numeric"
						autoComplete="one-time-code"
						maxLength={OTP_LENGTH}
						placeholder={t("codePlaceholder")}
						className="h-8 w-36 text-sm tracking-widest"
					/>
					<Button
						type="submit"
						size="sm"
						className="h-8 text-xs"
						disabled={isPending || otp.length !== OTP_LENGTH}
					>
						{isPending && (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						)}
						{t("verify")}
					</Button>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						className="h-8 text-xs"
						disabled={isPending}
						onClick={send}
					>
						{t("resend")}
					</Button>
				</form>
			) : (
				<Button
					size="sm"
					className="h-8 w-fit text-xs"
					disabled={isPending}
					onClick={send}
				>
					{isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
					{t("send")}
				</Button>
			)}
		</div>
	);
}
