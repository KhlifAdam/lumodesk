import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewHeaderProps {
	userName: string;
}

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

function getFormattedDate(): string {
	return new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});
}

export function OverviewHeader({ userName }: OverviewHeaderProps) {
	const firstName = userName.split(" ")[0] ?? userName;

	return (
		<div className="flex items-start justify-between">
			<div className="flex flex-col gap-1">
				<p className="text-sm text-muted-foreground">{getFormattedDate()}</p>
				<h1 className="text-3xl font-bold tracking-tight text-foreground">
					{getGreeting()}, {firstName}.
				</h1>
			</div>
			<Button className="gap-2 rounded-xl shadow-luminous">
				<Plus className="h-4 w-4" />
				New project
			</Button>
		</div>
	);
}
