"use client";

import { UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";
import { type DragEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ACCEPTED_MIME_TYPES } from "@/services/media/constants";

interface MediaDropzoneProps {
	onFiles: (files: File[]) => void;
	accept?: readonly string[];
	className?: string;
}

export function MediaDropzone({
	onFiles,
	accept = ACCEPTED_MIME_TYPES,
	className,
}: MediaDropzoneProps) {
	const t = useTranslations("Media.dropzone");
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(false);
		if (event.dataTransfer.files.length)
			onFiles(Array.from(event.dataTransfer.files));
	};

	return (
		<button
			type="button"
			onClick={() => inputRef.current?.click()}
			onDragOver={(event) => {
				event.preventDefault();
				setIsDragging(true);
			}}
			onDragLeave={() => setIsDragging(false)}
			onDrop={handleDrop}
			className={cn(
				"group flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-4 py-4 text-left transition-all duration-300 hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				isDragging && "border-primary bg-primary/10",
				className,
			)}
		>
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-0.5">
				<UploadCloud className="h-4 w-4" />
			</div>
			<div className="flex flex-col gap-0.5">
				<p className="text-sm font-medium text-foreground">
					{isDragging ? t("drop") : t("title")}
				</p>
				<p className="text-xs text-muted-foreground">{t("hint")}</p>
			</div>
			<input
				ref={inputRef}
				type="file"
				multiple
				hidden
				accept={accept.join(",")}
				onChange={(event) => {
					if (event.target.files?.length)
						onFiles(Array.from(event.target.files));
					event.target.value = "";
				}}
			/>
		</button>
	);
}
