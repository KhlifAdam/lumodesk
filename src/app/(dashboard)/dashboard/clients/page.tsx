import { Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ClientTable } from "@/components/dashboard/clients/client-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { ListSkeleton } from "@/components/dashboard/shared/list-skeleton";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { UrlPagination } from "@/components/dashboard/shared/url-pagination";
import { UrlSearch } from "@/components/dashboard/shared/url-search";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { listClients } from "@/services/clients/queries";
import {
	type ListClientsParams,
	listClientsSchema,
} from "@/services/clients/schemas";

interface ClientsPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
	const t = await getTranslations("Clients");
	const params = listClientsSchema.parse(await searchParams);

	return (
		<PageShell>
			<PageHeader title={t("title")} description={t("description")} />
			<UrlSearch placeholder={t("list.search")} />
			<Suspense key={`${params.q}-${params.page}`} fallback={<ListSkeleton />}>
				<ClientList params={params} />
			</Suspense>
		</PageShell>
	);
}

async function ClientList({ params }: { params: ListClientsParams }) {
	const t = await getTranslations("Clients.empty");
	const { photographerId } = await requirePhotographer();
	const { items, page, pageCount } = await listClients(photographerId, params);

	if (items.length === 0) {
		return (
			<EmptyState
				icon={Users}
				title={params.q ? t("noMatch") : t("title")}
				description={params.q ? undefined : t("description")}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<ClientTable clients={items} />
			<UrlPagination page={page} pageCount={pageCount} />
		</div>
	);
}
