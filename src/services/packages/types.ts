import type { MediaItem } from "@/services/media/types";
import type { PageMeta } from "@/services/shared/pagination";
import type { PackageValues } from "./schemas";

export type PackageItem = PackageValues & {
	id: string;
	cover: MediaItem | null;
};

export interface PackagePage extends PageMeta {
	items: PackageItem[];
}
