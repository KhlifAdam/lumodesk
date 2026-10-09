import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api-session";
import { db } from "@/lib/db";
import { getPrivateDownloadUrl } from "@/lib/storage/r2-private";
import { getItemAccess } from "@/services/galleries/access";

/**
 * One original, under its own name: redirects to a short signed link, so the
 * bytes come straight from the bucket. Same access rule as the gallery.
 */
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ itemId: string }> },
) {
	const user = await getApiUser();
	if (!user)
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const { itemId } = await params;
	const access = await getItemAccess(itemId, user.id);
	if (!access) return NextResponse.json({ error: "notFound" }, { status: 404 });
	// Choosing happens on previews; the originals wait for delivery and payment.
	if (!access.originals)
		return NextResponse.json({ error: "notDelivered" }, { status: 403 });

	const item = await db.galleryItem.findUnique({
		where: { id: itemId },
		select: { key: true, filename: true },
	});
	if (!item) return NextResponse.json({ error: "notFound" }, { status: 404 });

	const url = await getPrivateDownloadUrl(item.key, item.filename);
	return NextResponse.redirect(url, { status: 302 });
}
