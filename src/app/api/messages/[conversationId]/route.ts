import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api-session";
import { db } from "@/lib/db";
import { listMessages } from "@/services/messages/queries";

/** Polling read: the latest messages, or an older page with `?before=<id>`. */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ conversationId: string }> },
) {
	const user = await getApiUser();
	if (!user)
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const { conversationId } = await params;
	const member = await db.conversation.findFirst({
		where: {
			id: conversationId,
			OR: [{ photographerId: user.id }, { clientId: user.id }],
		},
		select: { id: true },
	});
	if (!member) return NextResponse.json({ error: "notFound" }, { status: 404 });

	const before = new URL(request.url).searchParams.get("before") ?? undefined;
	return NextResponse.json(await listMessages(conversationId, before), {
		headers: { "Cache-Control": "no-store" },
	});
}
