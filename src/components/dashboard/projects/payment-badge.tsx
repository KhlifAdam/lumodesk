import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/services/projects/options";

export const PAYMENT_TONE: Record<PaymentStatus, string> = {
	PAID: "border-success/40 bg-success/10 text-success",
	PARTIAL: "border-primary/40 bg-primary/10 text-primary",
	UNPAID: "border-destructive/40 bg-destructive/10 text-destructive",
};

/** Green when paid, gold when partly paid, red otherwise. */
export function PaymentBadge({ status }: { status: PaymentStatus }) {
	const t = useTranslations("Projects.payment.status");

	return (
		<Badge
			variant="outline"
			className={cn("h-5 px-1.5 text-[10px] font-medium", PAYMENT_TONE[status])}
		>
			{t(status)}
		</Badge>
	);
}
