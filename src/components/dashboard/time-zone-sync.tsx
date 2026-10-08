"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TIME_ZONE_COOKIE } from "@/lib/time-zone";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Stores the browser's time zone in a cookie so the server renders dates
 * (e.g. the calendar) in the photographer's local time. Refreshes once when
 * the zone is new or has changed.
 */
export function TimeZoneSync({ serverTimeZone }: { serverTimeZone: string }) {
	const router = useRouter();

	useEffect(() => {
		const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (!zone || zone === serverTimeZone) return;
		// biome-ignore lint/suspicious/noDocumentCookie: plain preference cookie, no Cookie Store API fallback needed
		document.cookie = `${TIME_ZONE_COOKIE}=${encodeURIComponent(zone)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
		router.refresh();
	}, [serverTimeZone, router]);

	return null;
}
