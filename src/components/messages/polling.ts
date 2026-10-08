"use client";

import { useState } from "react";

/** The server answered 401: there is no session any more. */
export class SignedOutError extends Error {}

export async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url);
	if (response.status === 401) throw new SignedOutError();
	if (!response.ok) throw new Error(`Request failed: ${response.status}`);
	return response.json();
}

/**
 * SWR options for a live poll that gives up for good once the session is gone
 * (a tab left open after signing out), instead of hitting the server forever.
 * Pass `signedOut` to the key: a null key stops every request.
 */
export function usePolling(intervalMs: number) {
	const [signedOut, setSignedOut] = useState(false);

	return {
		signedOut,
		options: {
			refreshInterval: signedOut ? 0 : intervalMs,
			// Polling already retries on its own schedule.
			shouldRetryOnError: false,
			onError: (error: unknown) => {
				if (error instanceof SignedOutError) setSignedOut(true);
			},
		},
	};
}
