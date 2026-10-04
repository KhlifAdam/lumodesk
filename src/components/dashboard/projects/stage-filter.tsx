"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PROJECT_STAGES, type ProjectStage } from "@/services/projects/stages";

const ALL = "all";

/** Stage filter kept in `?stage=`; changing it resets to page 1. */
export function StageFilter({ active }: { active?: ProjectStage }) {
	const t = useTranslations("Projects");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const onChange = (value: string) => {
		const params = new URLSearchParams(searchParams);
		params.delete("page");
		if (value === ALL) params.delete("stage");
		else params.set("stage", value);
		router.replace(`${pathname}?${params}`, { scroll: false });
	};

	return (
		<Select value={active ?? ALL} onValueChange={onChange}>
			<SelectTrigger className="h-8 w-44 text-xs">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL} className="text-xs">
					{t("list.allStages")}
				</SelectItem>
				{PROJECT_STAGES.map((stage) => (
					<SelectItem key={stage} value={stage} className="text-xs">
						{t(`stages.${stage}`)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
