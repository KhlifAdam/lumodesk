"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { Textarea } from "@/components/ui/textarea";

interface DeclineDialogProps {
	title: string;
	description: string;
	trigger: string;
	reason: string;
	onReason: (value: string) => void;
	disabled: boolean;
	onConfirm: () => void;
}

/** Asks for an optional reason before closing a booking. */
export function DeclineDialog({
	title,
	description,
	trigger,
	reason,
	onReason,
	disabled,
	onConfirm,
}: DeclineDialogProps) {
	const t = useTranslations("Bookings.actions");

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
					disabled={disabled}
				>
					<X className="h-3.5 w-3.5" />
					{trigger}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<Textarea
					value={reason}
					onChange={(event) => onReason(event.target.value)}
					maxLength={500}
					rows={3}
					placeholder={t("reasonPlaceholder")}
					aria-label={t("reason")}
					className="text-sm"
				/>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("back")}</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{trigger}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
