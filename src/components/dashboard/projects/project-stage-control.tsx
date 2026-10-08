"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { StageTimeline } from "@/components/client-work/stage-timeline";
import { useErrorMessage } from "@/hooks/use-error-message";
import { updateProjectStage } from "@/services/projects/actions";
import type { ProjectStage } from "@/services/projects/stages";
import { PAYMENT_GATED_STAGE } from "@/services/projects/visibility";

/** Clickable workflow; the new stage shows at once and rolls back on error. */
export function ProjectStageControl({
	projectId,
	stage,
	paid,
}: {
	projectId: string;
	stage: ProjectStage;
	paid: boolean;
}) {
	const t = useTranslations("Projects.detail");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [optimistic, setOptimistic] = useOptimistic(stage);
	const [isPending, startTransition] = useTransition();

	const select = (next: ProjectStage) =>
		startTransition(async () => {
			setOptimistic(next);
			const result = await updateProjectStage({ id: projectId, stage: next });
			if (!result.ok) return void toast.error(errorMessage(result.error));
			toast.success(t("stageUpdated"));
			router.refresh();
		});

	return (
		<section className="rounded-xl border border-border bg-card p-3">
			<h2 className="mb-2 text-xs font-medium text-muted-foreground">
				{t("workflow")}
			</h2>
			<StageTimeline
				stage={optimistic}
				onSelect={select}
				disabled={isPending}
				locked={
					paid
						? undefined
						: { stage: PAYMENT_GATED_STAGE, reason: t("unpaidLocked") }
				}
			/>
			{!paid && (
				<p className="mt-2 text-xs text-destructive">{t("unpaidHint")}</p>
			)}
		</section>
	);
}
