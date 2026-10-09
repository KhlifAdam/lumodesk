import { Play } from "lucide-react";
import { formatDuration } from "@/lib/format";

/** "▶ 2:41" overlay on a video tile. */
export function VideoBadge({ durationSec }: { durationSec: number | null }) {
	return (
		<span className="pointer-events-none absolute bottom-1.5 left-1.5 flex h-6 items-center gap-1 rounded-full bg-black/60 px-2 text-[11px] font-medium text-white backdrop-blur">
			<Play className="h-3 w-3 fill-current" />
			{durationSec ? formatDuration(durationSec) : null}
		</span>
	);
}
