import type { MediaItem } from "@/services/media/types";
import type { AppearanceValues, StudioProfileValues } from "./schemas";

export type StudioData = StudioProfileValues &
	AppearanceValues & {
		id: string;
		logo: MediaItem | null;
		cover: MediaItem | null;
		publicUrl: string;
	};
