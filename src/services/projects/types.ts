import type { GallerySummary } from "@/services/galleries/types";
import type { PageMeta } from "@/services/shared/pagination";
import type { ProjectStage } from "./stages";

export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED";

/** Who the project is for: the accepted client, or the pending/declined invite. */
export interface ProjectClient {
	/** Set once the invitation is accepted. */
	id: string | null;
	name: string | null;
	email: string | null;
	status: InviteStatus | null;
}

export interface ProjectSummary {
	id: string;
	title: string;
	stage: ProjectStage;
	eventDate: string | null;
	location: string;
	client: ProjectClient;
	galleryCount: number;
	updatedAt: string;
}

export interface ProjectDetail extends ProjectSummary {
	description: string;
	galleries: GallerySummary[];
}

export interface ProjectPage extends PageMeta {
	items: ProjectSummary[];
}
