import { realEmail } from "@/lib/phone";

/** The addresses a signed-in client has proven they own. */
export interface VerifiedContact {
	email: string | null;
	phone: string | null;
}

/** What a session's user has verified: a real email and/or a phone number. */
export function verifiedContact(user: {
	email: string;
	emailVerified: boolean;
	phoneNumber?: string | null;
	phoneNumberVerified?: boolean | null;
}): VerifiedContact {
	return {
		email: user.emailVerified ? realEmail(user.email) : null,
		phone: user.phoneNumberVerified ? (user.phoneNumber ?? null) : null,
	};
}

/** Pending-invitation filter for the contacts a client has verified. */
export function pendingFor({ email, phone }: VerifiedContact) {
	const matches = [
		...(email ? [{ inviteEmail: email.toLowerCase() }] : []),
		...(phone ? [{ invitePhone: phone }] : []),
	];
	// No verified contact matches nothing, rather than everything.
	return {
		inviteStatus: "PENDING" as const,
		OR: matches.length > 0 ? matches : [{ id: "" }],
	};
}
