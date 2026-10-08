"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useErrorMessage } from "@/hooks/use-error-message";
import { updateProjectPaid } from "@/services/projects/actions";
import { PaymentBadge } from "./payment-badge";

/** Payment status with a button to flip it. */
export function ProjectPaymentControl({
	projectId,
	paid,
}: {
	projectId: string;
	paid: boolean;
}) {
	const t = useTranslations("Projects.payment");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [isPending, startTransition] = useTransition();

	const toggle = () =>
		startTransition(async () => {
			const result = await updateProjectPaid({ id: projectId, paid: !paid });
			if (!result.ok) return void toast.error(errorMessage(result.error));
			toast.success(paid ? t("markedUnpaid") : t("markedPaid"));
			router.refresh();
		});

	return (
		<div className="flex items-center gap-2">
			<PaymentBadge paid={paid} />
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="h-7 gap-1.5 text-xs"
				disabled={isPending}
				onClick={toggle}
			>
				{isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
				{paid ? t("markUnpaid") : t("markPaid")}
			</Button>
		</div>
	);
}
