import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { MessagesView } from "@/components/messages/messages-view";
import { NewConversationDialog } from "@/components/messages/new-conversation-dialog";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { getRequestTimeZone } from "@/lib/request-time-zone";
import { messagesParamsSchema } from "@/services/messages/schemas";

const BASE_PATH = "/dashboard/messages";

interface MessagesPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MessagesPage({
	searchParams,
}: MessagesPageProps) {
	const t = await getTranslations("Messages");
	const params = messagesParamsSchema.parse(await searchParams);
	const { photographerId } = await requirePhotographer();
	const timeZone = await getRequestTimeZone();

	return (
		<PageShell className="min-h-0 flex-1">
			<PageHeader
				title={t("title")}
				description={t("description")}
				actions={<NewConversationDialog basePath={BASE_PATH} />}
			/>
			<MessagesView
				viewer={{ id: photographerId, role: "photographer" }}
				params={params}
				basePath={BASE_PATH}
				timeZone={timeZone}
				className="flex-1"
			/>
		</PageShell>
	);
}
