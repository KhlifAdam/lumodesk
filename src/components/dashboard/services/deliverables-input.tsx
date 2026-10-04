"use client";

import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type KeyboardEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_DELIVERABLES } from "@/services/packages/schemas";

interface DeliverablesInputProps {
	value: string[];
	onChange: (value: string[]) => void;
}

/** Editable list of short deliverable lines (Enter to add). */
export function DeliverablesInput({ value, onChange }: DeliverablesInputProps) {
	const t = useTranslations("Services.form");
	const [draft, setDraft] = useState("");
	const isFull = value.length >= MAX_DELIVERABLES;

	const add = () => {
		const item = draft.trim().slice(0, 120);
		if (!item || isFull) return;
		onChange([...value, item]);
		setDraft("");
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== "Enter") return;
		event.preventDefault();
		add();
	};

	return (
		<div className="flex flex-col gap-1.5">
			{value.length > 0 && (
				<ul className="flex flex-col gap-1">
					{value.map((item, index) => (
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: lines may repeat; position is the identity
							key={index}
							className="flex items-center justify-between gap-2 rounded-md bg-muted/60 px-2 py-1 text-xs"
						>
							<span className="truncate">{item}</span>
							<button
								type="button"
								onClick={() => onChange(value.filter((_, i) => i !== index))}
								className="text-muted-foreground transition-colors hover:text-destructive"
								aria-label={t("removeDeliverable")}
							>
								<X className="h-3 w-3" />
							</button>
						</li>
					))}
				</ul>
			)}
			<div className="flex gap-1.5">
				<Input
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={t("deliverablePlaceholder")}
					disabled={isFull}
					className="h-8 text-sm"
				/>
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="h-8 w-8 shrink-0"
					onClick={add}
					disabled={isFull || !draft.trim()}
					aria-label={t("addDeliverable")}
				>
					<Plus className="h-3.5 w-3.5" />
				</Button>
			</div>
		</div>
	);
}
