import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api-session";
import { attachmentHeader } from "@/lib/content-disposition";
import { getGalleryAccess } from "@/services/galleries/access";
import { galleryZip } from "@/services/galleries/download";

/**
 * The whole gallery as a ZIP (`?selected=1`: only the client's picks). Open to
 * its photographer, and to the client once the project is delivered and paid.
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ galleryId: string }> },
) {
	const user = await getApiUser();
	if (!user)
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const { galleryId } = await params;
	const access = await getGalleryAccess(galleryId, user.id);
	if (!access) return NextResponse.json({ error: "notFound" }, { status: 404 });
	// Choosing happens on previews; the originals wait for delivery and payment.
	if (!access.originals)
		return NextResponse.json({ error: "notDelivered" }, { status: 403 });

	const selectedOnly =
		new URL(request.url).searchParams.get("selected") === "1";
	const zip = await galleryZip(galleryId, selectedOnly);
	if (!zip) return NextResponse.json({ error: "notFound" }, { status: 404 });

	const headers = new Headers(zip.response.headers);
	headers.set("Content-Disposition", attachmentHeader(zip.filename));
	headers.set("Cache-Control", "private, no-store");
	return new Response(zip.response.body, { headers });
}
