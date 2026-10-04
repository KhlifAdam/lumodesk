import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PortalGallery } from "@/components/portal/portal-gallery";
import { requireClient } from "@/lib/auth/require-client";
import { getClientGallery } from "@/services/galleries/queries";
import { galleryViewSchema } from "@/services/galleries/schemas";

interface PortalGalleryPageProps {
	params: Promise<{ galleryId: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PortalGalleryPage({
	params,
	searchParams,
}: PortalGalleryPageProps) {
	const t = await getTranslations("Portal.gallery");
	const { galleryId } = await params;
	const view = galleryViewSchema.parse(await searchParams);
	const { clientId } = await requireClient();
	const gallery = await getClientGallery(clientId, galleryId, view);
	if (!gallery) notFound();

	const limit = gallery.selectionLimit;
	const hint = !gallery.selectionEnabled
		? null
		: gallery.submitted
			? t("hintSubmitted")
			: limit
				? t("hintLimit", { limit })
				: t("hint");

	return (
		<>
			<Link
				href={`/portal/projects/${gallery.projectId}`}
				className="flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				{gallery.projectTitle}
			</Link>
			<div className="flex flex-col gap-1">
				<h1 className="font-display text-2xl font-bold tracking-tight">
					{gallery.title}
				</h1>
				{gallery.description && (
					<p className="max-w-3xl whitespace-pre-wrap text-sm text-muted-foreground">
						{gallery.description}
					</p>
				)}
				{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
			</div>
			<PortalGallery
				key={`${gallery.filter}-${gallery.page}`}
				gallery={gallery}
			/>
		</>
	);
}
