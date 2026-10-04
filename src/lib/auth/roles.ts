/** Roles from the PRD, as stored in `users.role` by the better-auth admin plugin. */
export const ROLES = {
	admin: "admin",
	photographer: "photographer",
	client: "client",
	team: "team",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
