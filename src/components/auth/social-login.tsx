"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { GithubIcon, GoogleIcon } from "./brand-icons";

const PROVIDERS = [
	{ id: "github", icon: GithubIcon },
	{ id: "google", icon: GoogleIcon },
] as const;

/** "Or continue with" divider + provider buttons. */
export function SocialLogin({ disabled }: { disabled?: boolean }) {
	const t = useTranslations("Auth.shared");
	const [pending, setPending] = useState(false);

	async function signIn(provider: (typeof PROVIDERS)[number]["id"]) {
		setPending(true);
		await authClient.signIn.social({ provider, callbackURL: "/dashboard" });
	}

	return (
		<>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						{t("divider")}
					</span>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				{PROVIDERS.map(({ id, icon: Icon }) => (
					<Button
						key={id}
						variant="outline"
						type="button"
						disabled={disabled || pending}
						onClick={() => signIn(id)}
					>
						<Icon className="mr-2 h-4 w-4" />
						{t(id)}
					</Button>
				))}
			</div>
		</>
	);
}
