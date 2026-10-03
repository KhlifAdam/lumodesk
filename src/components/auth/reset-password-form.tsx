"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";

const OTP_LENGTH = 6;

const schema = z
	.object({
		otp: z.string().length(OTP_LENGTH, "Enter the 6-digit code."),
		password: z.string().min(8, "Password must be at least 8 characters."),
		confirmPassword: z.string(),
	})
	.refine((v) => v.password === v.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match.",
	});
type Values = z.infer<typeof schema>;

export function ResetPasswordForm({ email }: { email: string }) {
	const router = useRouter();
	const [isResending, setIsResending] = useState(false);
	const [showPasswords, setShowPasswords] = useState(false);
	const form = useForm<Values>({
		resolver: zodResolver(schema),
		defaultValues: { otp: "", password: "", confirmPassword: "" },
	});
	const { isSubmitting } = form.formState;

	async function onSubmit({ otp, password }: Values) {
		const { error } = await authClient.emailOtp.resetPassword({
			email,
			otp,
			password,
		});
		if (error) {
			toast.error(error.message || "Invalid or expired code.");
			return;
		}
		toast.success("Password updated. You can now sign in.");
		router.push("/login");
	}

	async function resend() {
		setIsResending(true);
		const { error } = await authClient.emailOtp.requestPasswordReset({ email });
		setIsResending(false);
		if (error) {
			toast.error(error.message || "Could not resend the code.");
			return;
		}
		form.resetField("otp");
		toast.success("A new code has been sent.");
	}

	return (
		<div className="flex flex-col space-y-6">
			<div className="flex flex-col space-y-2 text-center">
				<h1 className="text-3xl font-semibold tracking-tight text-foreground">
					Reset your password
				</h1>
				<p className="text-sm text-muted-foreground">
					Enter the code sent to{" "}
					<span className="font-medium text-foreground">{email}</span> and
					choose a new password
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<FormField
						control={form.control}
						name="otp"
						render={({ field }) => (
							<FormItem className="flex flex-col items-center">
								<FormLabel>Verification code</FormLabel>
								<FormControl>
									<InputOTP
										maxLength={OTP_LENGTH}
										readOnly={isSubmitting}
										{...field}
									>
										<InputOTPGroup>
											{Array.from({ length: OTP_LENGTH }, (_, i) => (
												// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length slots
												<InputOTPSlot key={i} index={i} />
											))}
										</InputOTPGroup>
									</InputOTP>
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
								<FormLabel>New password</FormLabel>
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
								<FormLabel>Confirm password</FormLabel>
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
					<Button disabled={isSubmitting}>
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Reset password
					</Button>
				</form>
			</Form>

			<div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
				<button
					type="button"
					onClick={resend}
					disabled={isResending || isSubmitting}
					className="hover:text-primary disabled:opacity-50"
				>
					{isResending ? "Sending..." : "Didn't get a code? Resend"}
				</button>
				<Link
					href="/login"
					className="flex items-center gap-2 hover:text-primary"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to sign in
				</Link>
			</div>
		</div>
	);
}
