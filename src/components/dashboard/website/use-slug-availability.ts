"use client";

import { useEffect, useState } from "react";
import { checkSlug } from "@/services/studio/actions";

export type SlugStatus = "idle" | "checking" | "available" | "taken";

const DEBOUNCE_MS = 400;

/** Debounced server check that a studio slug is free (or already ours). */
export function useSlugAvailability(slug: string, enabled = true) {
	const [status, setStatus] = useState<SlugStatus>("idle");

	useEffect(() => {
		if (!enabled || slug.length < 3) {
			setStatus("idle");
			return;
		}
		setStatus("checking");
		let cancelled = false;
		const timer = setTimeout(async () => {
			const result = await checkSlug(slug);
			if (cancelled) return;
			setStatus(!result.ok ? "idle" : result.data ? "available" : "taken");
		}, DEBOUNCE_MS);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [slug, enabled]);

	return status;
}
