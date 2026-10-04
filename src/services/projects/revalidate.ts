import "server-only";

import { revalidatePath } from "next/cache";

/** Client work shows up in both the dashboard and the client portal. */
export function revalidateClientWork() {
	revalidatePath("/dashboard", "layout");
	revalidatePath("/portal", "layout");
}
