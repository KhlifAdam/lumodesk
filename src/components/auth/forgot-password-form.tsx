"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { authClient } from "@/lib/auth-client";

const schema = z.object({ email: z.email("Enter a valid email address.") });
type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
	const router = useRouter();
	const form = useForm<Values>({
		resolver: zodResolver(schema),
		defaultValues: { email: "" },
	});
	const { isSubmitting } = form.formState;

	async function onSubmit({ email }: Values) {
		const { error } = await authClient.emailOtp.requestPasswordReset({
			email,
		});
		if (error) {
			toast.error(error.message || "Something went wrong.");
			return;
		}
		toast.success("If that email is registered, a code is on its way.");
		router.push(`/reset-password?email=${encodeURIComponent(email)}`);
	}

	return (
		<div className="flex flex-col space-y-6">
			<div className="flex flex-col space-y-2 text-center">
				<h1 className="text-3xl font-semibold tracking-tight text-foreground">
					Forgot password?
				</h1>
				<p className="text-sm text-muted-foreground">
					Enter your email and we&apos;ll send you a 6-digit code to reset it
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="name@example.com"
										autoComplete="email"
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
						Send code
					</Button>
				</form>
			</Form>

			<Link
				href="/login"
				className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to sign in
			</Link>
		</div>
	);
}
