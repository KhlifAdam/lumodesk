/** What a booking must have before it can become a project. */
export type RequiredField = "desiredDate" | "proposedPrice";

/** Not blocking, but the project is harder to run without them. */
export type RecommendedField = "contact" | "location" | "startTime";

export interface Completeness {
	required: RequiredField[];
	recommended: RecommendedField[];
}

interface CompletenessInput {
	desiredDate: unknown;
	proposedPrice: unknown;
	clientEmail?: string | null;
	clientPhone?: string | null;
	location?: string | null;
	startTime?: string | null;
}

const isBlank = (value: unknown) =>
	value === null || value === undefined || value === "";

/**
 * The single rule for "is this booking ready to confirm": the server checks
 * it before creating the project, and the pages use it to show what is left.
 */
export function bookingCompleteness(input: CompletenessInput): Completeness {
	const required: RequiredField[] = [];
	if (isBlank(input.desiredDate)) required.push("desiredDate");
	if (isBlank(input.proposedPrice)) required.push("proposedPrice");

	const recommended: RecommendedField[] = [];
	// Without an email or a phone number the client can't be invited.
	if (isBlank(input.clientEmail) && isBlank(input.clientPhone))
		recommended.push("contact");
	if (isBlank(input.location)) recommended.push("location");
	if (isBlank(input.startTime)) recommended.push("startTime");

	return { required, recommended };
}
