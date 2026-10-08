import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Green when paid, red otherwise. */
export function PaymentBadge({ paid }: { paid: boolean }) {
	const t = useTranslations("Projects.payment");

	return (
		<Badge
			variant="outline"
			className={cn(
				"h-5 px-1.5 text-[10px] font-medium",
				paid
					? "border-success/40 bg-success/10 text-success"
					: "border-destructive/40 bg-destructive/10 text-destructive",
			)}
		>
			{paid ? t("paid") : t("unpaid")}
		</Badge>
	);
}
