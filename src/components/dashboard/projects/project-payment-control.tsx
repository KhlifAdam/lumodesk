"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useErrorMessage } from "@/hooks/use-error-message";
import { cn } from "@/lib/utils";
import { updateProjectPayment } from "@/services/projects/actions";
import {
	PAYMENT_STATUSES,
	type PaymentStatus,
} from "@/services/projects/options";
import { PAYMENT_TONE } from "./payment-badge";

/** Quick way to change the payment status; the badge colour follows it. */
export function ProjectPaymentControl({
	projectId,
	status,
}: {
	projectId: string;
	status: PaymentStatus;
}) {
	const t = useTranslations("Projects.payment");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [optimistic, setOptimistic] = useOptimistic(status);
	const [isPending, startTransition] = useTransition();

	const change = (next: PaymentStatus) =>
		startTransition(async () => {
			setOptimistic(next);
			const result = await updateProjectPayment({
				id: projectId,
				paymentStatus: next,
			});
			if (!result.ok) return void toast.error(errorMessage(result.error));
			toast.success(t("updated"));
			router.refresh();
		});

	return (
		<Select
			value={optimistic}
			onValueChange={(value) => change(value as PaymentStatus)}
			disabled={isPending}
		>
			<SelectTrigger
				aria-label={t("change")}
				className={cn("h-7 w-40 text-xs", PAYMENT_TONE[optimistic])}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{PAYMENT_STATUSES.map((value) => (
					<SelectItem key={value} value={value} className="text-xs">
						{t(`status.${value}`)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
