import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BookingForm } from "@/components/dashboard/bookings/form/booking-form";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageShell } from "@/components/dashboard/shared/page-shell";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { emptyBookingValues } from "@/services/bookings/form-values";
import { getClient } from "@/services/clients/queries";

interface NewBookingPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function NewBookingPage({
	searchParams,
}: NewBookingPageProps) {
	const t = await getTranslations("Bookings.form");
	const { photographerId } = await requirePhotographer();
	const { client: clientId } = await searchParams;

	// Coming from a client's page: start with their details.
	const client =
		typeof clientId === "string"
			? await getClient(photographerId, clientId)
			: null;

	return (
		<PageShell>
			<Link
				href="/dashboard/bookings"
				className="flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				{t("back")}
			</Link>
			<PageHeader title={t("createTitle")} description={t("description")} />
			<BookingForm
				initial={emptyBookingValues(
					client
						? {
								clientId: client.id,
								clientName: client.name,
								clientEmail: client.email,
							}
						: {},
				)}
			/>
		</PageShell>
	);
}
