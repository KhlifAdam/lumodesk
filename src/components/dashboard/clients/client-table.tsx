import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsOf } from "@/lib/initials";
import { formatPhone } from "@/lib/phone";
import type { ClientSummary } from "@/services/clients/types";

export async function ClientTable({ clients }: { clients: ClientSummary[] }) {
	const t = await getTranslations("Clients");

	return (
		<ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
			{clients.map((client) => (
				<li key={client.id}>
					<Link
						href={`/dashboard/clients/${client.id}`}
						className="flex items-center gap-4 px-3 py-2 transition-colors hover:bg-muted/50"
					>
						<div className="flex min-w-0 flex-1 items-center gap-2.5">
							<Avatar className="h-7 w-7 border border-border">
								<AvatarImage src={client.image ?? undefined} alt="" />
								<AvatarFallback className="bg-primary/10 text-[10px] text-primary">
									{initialsOf(client.name)}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0">
								<p className="truncate text-sm font-medium">{client.name}</p>
								<p className="truncate text-xs text-muted-foreground">
									{client.email || formatPhone(client.phone)}
								</p>
							</div>
						</div>
						<span className="text-xs text-muted-foreground">
							{t("list.projectCount", { count: client.projectCount })}
						</span>
						<ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
					</Link>
				</li>
			))}
		</ul>
	);
}
