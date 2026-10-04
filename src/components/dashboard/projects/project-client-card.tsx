"use client";

import { Loader2, Mail, RotateCcw, Send, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useErrorMessage } from "@/hooks/use-error-message";
import type { ActionResult } from "@/lib/action-result";
import { cancelInvite, inviteClient } from "@/services/projects/invite-actions";
import type { ProjectClient } from "@/services/projects/types";
import { InviteStatusBadge } from "./invite-status-badge";

/** Who the project is for, and the invitation controls until they accept. */
export function ProjectClientCard({
	projectId,
	client,
}: {
	projectId: string;
	client: ProjectClient;
}) {
	const t = useTranslations("Projects.invite");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [isPending, startTransition] = useTransition();
	const [editing, setEditing] = useState(false);
	const [email, setEmail] = useState(client.email ?? "");

	const run = (action: () => Promise<ActionResult>, success: string) =>
		startTransition(async () => {
			const result = await action();
			if (!result.ok) return void toast.error(errorMessage(result.error));
			toast.success(success);
			setEditing(false);
			router.refresh();
		});
	const invite = (to: string) =>
		run(() => inviteClient({ projectId, email: to }), t("sent"));

	if (client.status === "ACCEPTED" && client.id) {
		return (
			<Card>
				<UserRound className="h-4 w-4 text-primary" />
				<Link
					href={`/dashboard/clients/${client.id}`}
					className="min-w-0 flex-1 truncate text-sm font-medium hover:text-primary"
				>
					{client.name}
					<span className="ml-2 text-xs font-normal text-muted-foreground">
						{client.email}
					</span>
				</Link>
			</Card>
		);
	}

	if (client.status && client.email && !editing) {
		return (
			<Card>
				<Mail className="h-4 w-4 text-muted-foreground" />
				<p className="flex min-w-0 flex-1 items-center gap-2 truncate text-sm">
					{client.email}
					<InviteStatusBadge status={client.status} />
				</p>
				<Button
					size="sm"
					variant="ghost"
					className="h-7 gap-1.5 text-xs"
					disabled={isPending}
					onClick={() => invite(client.email ?? "")}
				>
					<RotateCcw className="h-3.5 w-3.5" />
					{client.status === "DECLINED" ? t("inviteAgain") : t("resend")}
				</Button>
				<Button
					size="sm"
					variant="ghost"
					className="h-7 text-xs"
					disabled={isPending}
					onClick={() => setEditing(true)}
				>
					{t("change")}
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7"
					aria-label={t("cancel")}
					disabled={isPending}
					onClick={() => run(() => cancelInvite(projectId), t("cancelled"))}
				>
					<X className="h-3.5 w-3.5" />
				</Button>
			</Card>
		);
	}

	return (
		<Card>
			<form
				className="flex flex-1 flex-wrap items-center gap-2"
				onSubmit={(event) => {
					event.preventDefault();
					if (email.trim()) invite(email);
				}}
			>
				<p className="text-xs text-muted-foreground">{t("prompt")}</p>
				<Input
					type="email"
					required
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					placeholder="client@example.com"
					className="h-8 max-w-xs flex-1 text-sm"
				/>
				<Button
					type="submit"
					size="sm"
					className="h-8 gap-1.5 text-xs"
					disabled={isPending}
				>
					{isPending ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<Send className="h-3.5 w-3.5" />
					)}
					{t("send")}
				</Button>
				{editing && (
					<Button
						type="button"
						size="sm"
						variant="ghost"
						className="h-8 text-xs"
						onClick={() => setEditing(false)}
					>
						{t("keep")}
					</Button>
				)}
			</form>
		</Card>
	);
}

function Card({ children }: { children: ReactNode }) {
	return (
		<section className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
			{children}
		</section>
	);
}
