"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const DEBOUNCE_MS = 300;

/** Search box kept in `?q=`; typing resets to page 1. */
export function UrlSearch({ placeholder }: { placeholder: string }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const current = searchParams.get("q") ?? "";
	const [value, setValue] = useState(current);

	useEffect(() => setValue(current), [current]);

	useEffect(() => {
		if (value.trim() === current) return;
		const timer = setTimeout(() => {
			const params = new URLSearchParams(searchParams);
			params.delete("page");
			if (value.trim()) params.set("q", value.trim());
			else params.delete("q");
			router.replace(`${pathname}?${params}`, { scroll: false });
		}, DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [value, current, pathname, router, searchParams]);

	return (
		<div className="relative w-full max-w-xs">
			<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="search"
				value={value}
				onChange={(event) => setValue(event.target.value)}
				placeholder={placeholder}
				className="h-8 pl-8 text-sm"
			/>
		</div>
	);
}
