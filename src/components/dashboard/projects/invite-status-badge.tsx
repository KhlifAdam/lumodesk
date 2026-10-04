import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InviteStatus } from "@/services/projects/types";

/** Shown while the client hasn't accepted (pending or declined). */
export function InviteStatusBadge({ status }: { status: InviteStatus | null }) {
	const t = useTranslations("Projects.invite.status");
	if (status !== "PENDING" && status !== "DECLINED") return null;

	return (
		<Badge
			variant="outline"
			className={cn(
				"h-5 px-1.5 text-[10px] font-medium",
				status === "DECLINED" && "border-destructive/40 text-destructive",
			)}
		>
			{t(status)}
		</Badge>
	);
}
