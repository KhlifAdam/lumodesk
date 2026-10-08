"use client";

import { Loader2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { initialsOf } from "@/lib/initials";
import { findClientsToMessage } from "@/services/messages/actions";

type ClientHit = {
	id: string;
	name: string;
	email: string;
	image: string | null;
};

const DEBOUNCE_MS = 250;

/** Photographer picks one of their clients to start a conversation with. */
export function NewConversationDialog({ basePath }: { basePath: string }) {
	const t = useTranslations("Messages.new");
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [hits, setHits] = useState<ClientHit[] | null>(null);

	useEffect(() => {
		if (!open) return;
		let stale = false;
		const timer = setTimeout(async () => {
			const result = await findClientsToMessage(query);
			if (!stale) setHits(result.ok ? result.data : []);
		}, DEBOUNCE_MS);
		return () => {
			stale = true;
			clearTimeout(timer);
		};
	}, [open, query]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="h-8 gap-1.5 text-xs">
					<Plus className="h-3.5 w-3.5" />
					{t("action")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>
				<div className="relative">
					<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						autoFocus
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={t("search")}
						className="h-8 pl-8 text-sm"
					/>
				</div>
				<ul className="flex max-h-72 flex-col gap-0.5 overflow-y-auto">
					{hits === null && (
						<li className="flex justify-center py-6">
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						</li>
					)}
					{hits?.length === 0 && (
						<li className="py-6 text-center text-xs text-muted-foreground">
							{t("none")}
						</li>
					)}
					{hits?.map((client) => (
						<li key={client.id}>
							<Link
								href={`${basePath}?client=${client.id}`}
								onClick={() => setOpen(false)}
								className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-muted"
							>
								<Avatar className="h-7 w-7 border border-border">
									<AvatarImage src={client.image ?? undefined} alt="" />
									<AvatarFallback className="bg-primary/10 text-[10px] text-primary">
										{initialsOf(client.name)}
									</AvatarFallback>
								</Avatar>
								<span className="min-w-0">
									<span className="block truncate text-sm font-medium">
										{client.name}
									</span>
									<span className="block truncate text-xs text-muted-foreground">
										{client.email}
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</DialogContent>
		</Dialog>
	);
}
