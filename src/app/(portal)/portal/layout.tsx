import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { PortalHeader } from "@/components/portal/portal-header";
import { requireClient } from "@/lib/auth/require-client";
import { ROLES } from "@/lib/auth/roles";
import { BRAND_NAME } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Portal.header");
	return { title: `${t("title")} | ${BRAND_NAME}` };
}

export default async function PortalLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { session } = await requireClient();

	return (
		<div className="min-h-screen bg-background">
			<PortalHeader
				user={session.user}
				isPhotographer={session.user.role === ROLES.photographer}
			/>
			<main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
				{children}
			</main>
		</div>
	);
}
