import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar/sidebar";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { getStudioSummary } from "@/services/studio/queries";

export default async function DashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { session, photographerId } = await requirePhotographer();
	const studio = await getStudioSummary(photographerId);

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			<Sidebar studioName={studio?.name ?? "Lumodesk"} user={session.user} />
			{/*
			  `relative` is load-bearing: Radix form controls (checkbox, switch,
			  select, radio) render a hidden `position: absolute` native input.
			  Without a positioned ancestor it escapes this scroll container and
			  stretches the whole document, adding a second, outer scrollbar.
			*/}
			<main className="relative flex flex-1 flex-col overflow-y-auto">
				{children}
			</main>
		</div>
	);
}
