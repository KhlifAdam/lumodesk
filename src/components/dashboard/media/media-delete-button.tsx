"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ConfirmDeleteButton } from "@/components/dashboard/shared/confirm-delete-button";
import { useErrorMessage } from "@/hooks/use-error-message";
import { deleteMedia } from "@/services/media/actions";

export function MediaDeleteButton({
	mediaId,
	onDeleted,
}: {
	mediaId: string;
	onDeleted: () => void;
}) {
	const t = useTranslations("Media.delete");
	const router = useRouter();
	const errorMessage = useErrorMessage();

	return (
		<ConfirmDeleteButton
			title={t("title")}
			description={t("description")}
			onConfirm={async () => {
				const result = await deleteMedia([mediaId]);
				if (!result.ok) return void toast.error(errorMessage(result.error));
				toast.success(t("done"));
				onDeleted();
				router.refresh();
			}}
		/>
	);
}
