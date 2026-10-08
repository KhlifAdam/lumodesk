import type { StudioBrand } from "@/services/clients/branding";
import type { GallerySummary } from "@/services/galleries/types";
import type { ProjectStage } from "@/services/projects/stages";
import type { PageMeta } from "@/services/shared/pagination";

export interface PortalProject {
	id: string;
	title: string;
	photographerId: string;
	stage: ProjectStage;
	eventDate: string | null;
	location: string;
	studio: StudioBrand | null;
	photographerName: string;
	sharedGalleryCount: number;
}

export interface PortalProjectDetail extends PortalProject {
	description: string;
	galleries: GallerySummary[];
}

export interface PortalProjectPage extends PageMeta {
	items: PortalProject[];
}
