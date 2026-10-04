"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface FormSaveBarProps {
	visible: boolean;
	isSubmitting: boolean;
	onReset: () => void;
}

/** Sticky bar shown while a long form has unsaved changes. */
export function FormSaveBar({
	visible,
	isSubmitting,
	onReset,
}: FormSaveBarProps) {
	const t = useTranslations("Common.saveBar");

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 16 }}
					transition={{ duration: 0.2 }}
					className="sticky bottom-4 z-20 mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-border bg-card/80 px-4 py-2 shadow-luminous backdrop-blur-md"
				>
					<span className="text-xs text-muted-foreground">{t("unsaved")}</span>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-7"
							onClick={onReset}
							disabled={isSubmitting}
						>
							{t("discard")}
						</Button>
						<Button
							type="submit"
							size="sm"
							className="h-7"
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							)}
							{t("save")}
						</Button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
