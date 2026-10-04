import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { PROJECT_STAGES, type ProjectStage } from "@/services/projects/stages";

export function StageBadge({ stage }: { stage: ProjectStage }) {
	const t = useTranslations("Projects.stages");
	const done = stage === PROJECT_STAGES.at(-1);

	return (
		<Badge
			variant={done ? "default" : "secondary"}
			className="h-5 px-1.5 text-[10px] font-medium"
		>
			{t(stage)}
		</Badge>
	);
}
