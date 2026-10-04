import {
	Camera,
	Globe,
	type LucideIcon,
	Music2,
	Play,
	Users,
	Video,
} from "lucide-react";
import type { SocialKey } from "@/services/studio/schemas";

// lucide v1 has no brand icons; use neutral stand-ins.
export const SOCIAL_ICONS: Record<SocialKey, LucideIcon> = {
	instagram: Camera,
	facebook: Users,
	youtube: Play,
	vimeo: Video,
	tiktok: Music2,
	website: Globe,
};
