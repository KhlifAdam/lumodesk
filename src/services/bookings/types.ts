import type { MediaType, ServiceType } from "@/services/projects/options";
import type { PageMeta } from "@/services/shared/pagination";
import type { BookingSource, BookingStatus } from "./options";

export interface BookingSummary {
	id: string;
	title: string;
	status: BookingStatus;
	clientName: string;
	serviceType: ServiceType;
	desiredDate: string | null;
	proposedPrice: number | null;
	createdAt: string;
}

export interface BookingActivityItem {
	id: string;
	kind: "CREATED" | "STATUS" | "NOTE";
	fromStatus: BookingStatus | null;
	toStatus: BookingStatus | null;
	body: string;
	createdAt: string;
}

export interface BookingDetail extends BookingSummary {
	source: BookingSource;
	clientId: string | null;
	clientEmail: string;
	clientPhone: string;
	mediaType: MediaType;
	description: string;
	startTime: string;
	durationMinutes: number | null;
	location: string;
	clientBudget: number | null;
	plannedAdvance: number | null;
	responseDeadline: string | null;
	internalNotes: string;
	statusReason: string;
	confirmedAt: string | null;
	project: { id: string; title: string } | null;
	activities: BookingActivityItem[];
}

export interface BookingPage extends PageMeta {
	items: BookingSummary[];
}

export type BookingStats = Record<
	"total" | "pending" | "confirmed" | "closed",
	number
>;
