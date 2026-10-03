import { Eye, EyeOff } from "lucide-react";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<ComponentProps<"input">, "type"> & {
	visible: boolean;
	/** When provided, renders the show/hide button. */
	onToggleVisible?: () => void;
};

export function PasswordInput({
	visible,
	onToggleVisible,
	...props
}: PasswordInputProps) {
	const Icon = visible ? EyeOff : Eye;

	return (
		<div className="relative">
			<Input {...props} type={visible ? "text" : "password"} />
			{onToggleVisible && (
				<button
					type="button"
					onClick={onToggleVisible}
					aria-label={visible ? "Hide passwords" : "Show passwords"}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				>
					<Icon className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
