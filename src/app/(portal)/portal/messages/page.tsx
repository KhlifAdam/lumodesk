import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MessagesView } from "@/components/messages/messages-view";
import { requireClient } from "@/lib/auth/require-client";
import { getRequestTimeZone } from "@/lib/request-time-zone";
import { messagesParamsSchema } from "@/services/messages/schemas";

const BASE_PATH = "/portal/messages";

interface PortalMessagesPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PortalMessagesPage({
	searchParams,
}: PortalMessagesPageProps) {
	const t = await getTranslations("Messages");
	const params = messagesParamsSchema.parse(await searchParams);
	const { clientId } = await requireClient();
	const timeZone = await getRequestTimeZone();

	return (
		<>
			<div className="flex flex-col gap-1">
				<Link
					href="/portal"
					className="flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					{t("backToProjects")}
				</Link>
				<h1 className="font-display text-2xl font-bold tracking-tight">
					{t("title")}
				</h1>
			</div>
			<MessagesView
				viewer={{ id: clientId, role: "client" }}
				params={params}
				basePath={BASE_PATH}
				timeZone={timeZone}
				className="h-[calc(100dvh-14rem)] min-h-96"
			/>
		</>
	);
}
