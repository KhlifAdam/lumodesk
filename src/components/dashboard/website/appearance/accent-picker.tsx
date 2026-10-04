"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { ACCENT_PRESETS } from "@/lib/public-site/design";
import { cn } from "@/lib/utils";

interface AccentPickerProps {
	value: string;
	onChange: (value: string) => void;
}

/** Preset swatches plus a free hex input and native color picker. */
export function AccentPicker({ value, onChange }: AccentPickerProps) {
	const t = useTranslations("Site.appearance.accent");
	const normalized = value.toLowerCase();

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap gap-1.5">
				{ACCENT_PRESETS.map((color) => (
					<button
						key={color}
						type="button"
						aria-pressed={normalized === color}
						aria-label={color}
						onClick={() => onChange(color)}
						className={cn(
							"flex h-7 w-7 items-center justify-center rounded-full border border-border transition-transform duration-200 hover:scale-110",
							normalized === color &&
								"ring-2 ring-ring ring-offset-2 ring-offset-background",
						)}
						style={{ background: color }}
					>
						{normalized === color && (
							<Check className="h-3.5 w-3.5 text-white mix-blend-difference" />
						)}
					</button>
				))}
			</div>
			<div className="flex items-center gap-2">
				<label
					className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border"
					style={{ background: value }}
				>
					<span className="sr-only">{t("custom")}</span>
					<input
						type="color"
						value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
						onChange={(event) => onChange(event.target.value)}
						className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					/>
				</label>
				<Input
					value={value}
					onChange={(event) => onChange(event.target.value)}
					maxLength={7}
					className="h-8 w-28 font-mono text-xs uppercase"
					aria-label={t("hex")}
				/>
			</div>
		</div>
	);
}
