"use client";

import { CalendarDays, Check, Loader2, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useErrorMessage } from "@/hooks/use-error-message";
import {
	acceptInvitation,
	declineInvitation,
} from "@/services/portal/invitation-actions";
import type { PortalProject } from "@/services/portal/types";
import { StudioHeading } from "./studio-heading";

/** A photographer's invitation, answered with Accept / Decline. */
export function InvitationCard({ invitation }: { invitation: PortalProject }) {
	const t = useTranslations("Portal.invitations");
	const format = useFormatter();
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [isPending, startTransition] = useTransition();

	const answer = (accept: boolean) =>
		startTransition(async () => {
			const action = accept ? acceptInvitation : declineInvitation;
			const result = await action(invitation.id);
			if (!result.ok) return void toast.error(errorMessage(result.error));
			toast.success(accept ? t("accepted") : t("declined"));
			router.refresh();
		});

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center">
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<StudioHeading
					studio={invitation.studio}
					fallbackName={invitation.photographerName}
				/>
				<p className="font-medium">{invitation.title}</p>
				<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
					{invitation.eventDate && (
						<span className="flex items-center gap-1">
							<CalendarDays className="h-3 w-3" />
							{format.dateTime(new Date(invitation.eventDate), {
								dateStyle: "medium",
								timeZone: "UTC",
							})}
						</span>
					)}
					{invitation.location && (
						<span className="flex items-center gap-1">
							<MapPin className="h-3 w-3" />
							{invitation.location}
						</span>
					)}
				</div>
			</div>
			<div className="flex gap-2">
				<Button
					size="sm"
					variant="outline"
					className="h-8 gap-1.5 text-xs"
					disabled={isPending}
					onClick={() => answer(false)}
				>
					<X className="h-3.5 w-3.5" />
					{t("decline")}
				</Button>
				<Button
					size="sm"
					className="h-8 gap-1.5 text-xs"
					disabled={isPending}
					onClick={() => answer(true)}
				>
					{isPending ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<Check className="h-3.5 w-3.5" />
					)}
					{t("accept")}
				</Button>
			</div>
		</div>
	);
}
