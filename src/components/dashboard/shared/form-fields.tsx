"use client";

import type { ReactNode } from "react";
import { type FieldValues, type Path, useFormContext } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BaseFieldProps<T extends FieldValues> {
	name: Path<T>;
	label: string;
	description?: string;
	className?: string;
}

interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
	placeholder?: string;
	type?: "text" | "email" | "tel" | "url" | "number" | "date" | "time";
	/** Renders a textarea with this many rows. */
	rows?: number;
	prefix?: ReactNode;
}

/** Compact text / textarea field bound to the surrounding react-hook-form. */
export function TextField<T extends FieldValues>({
	name,
	label,
	description,
	className,
	placeholder,
	type = "text",
	rows,
	prefix,
}: TextFieldProps<T>) {
	const { control } = useFormContext<T>();
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("space-y-1", className)}>
					<FormLabel className="text-xs">{label}</FormLabel>
					<FormControl>
						{rows ? (
							<Textarea
								rows={rows}
								placeholder={placeholder}
								className="min-h-0 text-sm"
								{...field}
							/>
						) : (
							<div className="relative flex items-center">
								{prefix && (
									<span className="pointer-events-none absolute left-2.5 text-muted-foreground">
										{prefix}
									</span>
								)}
								<Input
									type={type}
									placeholder={placeholder}
									className={cn("h-8 text-sm", prefix && "pl-8")}
									{...field}
									value={field.value ?? ""}
									onChange={(event) => {
										if (type !== "number")
											return field.onChange(event.target.value);
										const { value, valueAsNumber } = event.target;
										field.onChange(value === "" ? null : valueAsNumber);
									}}
								/>
							</div>
						)}
					</FormControl>
					{description && (
						<FormDescription className="text-xs">{description}</FormDescription>
					)}
					<FormMessage className="text-xs" />
				</FormItem>
			)}
		/>
	);
}

/** Inline switch with label + description, bound to a boolean field. */
export function SwitchField<T extends FieldValues>({
	name,
	label,
	description,
	className,
}: BaseFieldProps<T>) {
	const { control } = useFormContext<T>();
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem
					className={cn(
						"flex items-center justify-between gap-4 space-y-0 rounded-lg border border-border px-3 py-2",
						className,
					)}
				>
					<div className="flex flex-col gap-0.5">
						<FormLabel className="text-xs font-medium">{label}</FormLabel>
						{description && (
							<FormDescription className="text-xs">
								{description}
							</FormDescription>
						)}
					</div>
					<FormControl>
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
