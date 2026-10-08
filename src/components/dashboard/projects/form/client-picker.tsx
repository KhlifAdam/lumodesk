"use client";

import { Loader2, Search, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { formatPhone } from "@/lib/phone";
import { findMyClients } from "@/services/clients/search-action";

export type PickedClient = {
	id: string;
	name: string;
	email: string;
	phone: string;
};

const DEBOUNCE_MS = 250;

/** Fills the client email from one of the photographer's existing clients. */
export function ClientPicker({
	onPick,
}: {
	onPick: (client: PickedClient) => void;
}) {
	const t = useTranslations("Projects.form.client");
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [hits, setHits] = useState<PickedClient[] | null>(null);

	useEffect(() => {
		if (!open) return;
		let stale = false;
		const timer = setTimeout(async () => {
			const result = await findMyClients(query);
			if (!stale) setHits(result.ok ? result.data : []);
		}, DEBOUNCE_MS);
		return () => {
			stale = true;
			clearTimeout(timer);
		};
	}, [open, query]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-8 gap-1.5 text-xs"
				>
					<UserRound className="h-3.5 w-3.5" />
					{t("pick")}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-72 p-2">
				<div className="relative mb-2">
					<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						autoFocus
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={t("search")}
						className="h-8 pl-8 text-sm"
					/>
				</div>
				<ul className="flex max-h-56 flex-col gap-0.5 overflow-y-auto">
					{hits === null && (
						<li className="flex justify-center py-4">
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						</li>
					)}
					{hits?.length === 0 && (
						<li className="py-4 text-center text-xs text-muted-foreground">
							{t("none")}
						</li>
					)}
					{hits?.map((hit) => (
						<li key={hit.id}>
							<button
								type="button"
								onClick={() => {
									onPick(hit);
									setOpen(false);
								}}
								className="flex w-full flex-col rounded-md px-2 py-1.5 text-left transition-colors duration-200 hover:bg-muted"
							>
								<span className="truncate text-sm font-medium">{hit.name}</span>
								<span className="truncate text-xs text-muted-foreground">
									{hit.email || formatPhone(hit.phone)}
								</span>
							</button>
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
