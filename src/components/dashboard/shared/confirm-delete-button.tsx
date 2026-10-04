"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteButtonProps {
	title: string;
	description: string;
	/** Runs the deletion; the dialog stays open (with a spinner) until it settles. */
	onConfirm: () => Promise<void>;
	label?: string;
}

/** Destructive button guarded by a confirmation dialog. */
export function ConfirmDeleteButton({
	title,
	description,
	onConfirm,
	label,
}: ConfirmDeleteButtonProps) {
	const t = useTranslations("Common.delete");
	const [isPending, startTransition] = useTransition();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="h-7 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
				>
					<Trash2 className="h-3.5 w-3.5" />
					{label ?? t("action")}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>
						{t("cancel")}
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={isPending}
						onClick={(event) => {
							event.preventDefault();
							startTransition(onConfirm);
						}}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{t("confirm")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
