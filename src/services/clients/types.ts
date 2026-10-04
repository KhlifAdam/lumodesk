import type { PageMeta } from "@/services/shared/pagination";

/** A person who accepted at least one of this photographer's projects. */
export interface ClientSummary {
	/** The client's user id. */
	id: string;
	name: string;
	email: string;
	image: string | null;
	projectCount: number;
}

export interface ClientDetail extends ClientSummary {
	/** From the photographer's private client profile. */
	notes: string;
}

export interface ClientPage extends PageMeta {
	items: ClientSummary[];
}
