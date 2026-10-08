import type { PageMeta } from "@/services/shared/pagination";

/** A person who accepted at least one of this photographer's projects. */
export interface ClientSummary {
	/** The client's user id. */
	id: string;
	name: string;
	/** Empty for a client who signed up with a phone number only. */
	email: string;
	/** E.164; empty when the client has none. */
	phone: string;
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
