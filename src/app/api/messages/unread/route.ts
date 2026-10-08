import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser } from "@/lib/auth/api-session";
import { countUnread } from "@/services/messages/queries";
import { MESSAGE_ROLES } from "@/services/messages/viewer";

/** Polling read: unread messages for one side (`?as=photographer|client`). */
export async function GET(request: Request) {
	const user = await getApiUser();
	if (!user)
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const role = z
		.enum(MESSAGE_ROLES)
		.safeParse(new URL(request.url).searchParams.get("as"));
	if (!role.success)
		return NextResponse.json({ error: "invalidInput" }, { status: 400 });

	const count = await countUnread({ id: user.id, role: role.data });
	return NextResponse.json(
		{ count },
		{ headers: { "Cache-Control": "no-store" } },
	);
}
