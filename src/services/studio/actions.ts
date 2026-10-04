"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, fail, failFromZod, ok } from "@/lib/action-result";
import { requirePhotographer } from "@/lib/auth/require-photographer";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/prisma-errors";
import { revalidatePublicSites } from "@/lib/public-site/cache";
import { ownsMedia } from "@/services/shared/assert-owned-media";
import { emptyToNull } from "@/services/shared/schemas";
import { isSlugAvailable } from "./queries";
import {
	type AppearanceValues,
	appearanceSchema,
	createStudioSchema,
	designSchema,
	studioProfileSchema,
	studioSlugSchema,
} from "./schemas";

function revalidateStudio() {
	revalidatePublicSites();
	// The sidebar shows the studio name, so refresh the whole dashboard.
	revalidatePath("/dashboard", "layout");
}

export async function checkSlug(slug: unknown): Promise<ActionResult<boolean>> {
	const { photographerId } = await requirePhotographer();
	const parsed = studioSlugSchema.safeParse(slug);
	if (!parsed.success) return failFromZod(parsed.error);
	return ok(await isSlugAvailable(parsed.data, photographerId));
}

export async function createStudio(input: unknown): Promise<ActionResult> {
	const { photographerId, session } = await requirePhotographer();
	const parsed = createStudioSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	if (!(await isSlugAvailable(parsed.data.slug, photographerId)))
		return fail("slugTaken");
	const existing = await db.studio.findUnique({ where: { photographerId } });
	if (existing) return fail("studioExists");

	try {
		await db.studio.create({
			data: { photographerId, ...parsed.data, email: session.user.email },
		});
	} catch (error) {
		if (isUniqueViolation(error)) return fail("slugTaken");
		throw error;
	}
	revalidateStudio();
	return ok();
}

export async function updateStudioProfile(
	input: unknown,
): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = studioProfileSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);

	const { slug, logoMediaId, coverMediaId, ...rest } = parsed.data;
	if (!(await isSlugAvailable(slug, photographerId))) return fail("slugTaken");
	if (!(await ownsMedia(photographerId, [logoMediaId, coverMediaId])))
		return fail("invalidInput");

	const { count } = await db.studio
		.updateMany({
			where: { photographerId },
			data: {
				slug,
				logoMediaId,
				coverMediaId,
				name: rest.name,
				tagline: emptyToNull(rest.tagline),
				bio: emptyToNull(rest.bio),
				email: emptyToNull(rest.email),
				phone: emptyToNull(rest.phone),
				city: emptyToNull(rest.city),
				country: emptyToNull(rest.country),
				socials: Object.fromEntries(
					Object.entries(rest.socials).filter(([, url]) => url),
				),
				published: rest.published,
				bookingEnabled: rest.bookingEnabled,
			},
		})
		.catch((error) => {
			if (isUniqueViolation(error)) return { count: -1 };
			throw error;
		});
	if (count === -1) return fail("slugTaken");
	if (count === 0) return fail("notFound");

	revalidateStudio();
	return ok();
}

async function saveStudioDesign(
	photographerId: string,
	data: Partial<AppearanceValues>,
): Promise<ActionResult> {
	const { count } = await db.studio.updateMany({
		where: { photographerId },
		data: { ...data, accentColor: data.accentColor?.toLowerCase() },
	});
	if (count === 0) return fail("notFound");

	revalidateStudio();
	return ok();
}

/** Appearance page: design + languages. */
export async function updateAppearance(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = appearanceSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	return saveStudioDesign(photographerId, parsed.data);
}

/** Preview toolbar: applies only the previewed design. */
export async function updateSiteDesign(input: unknown): Promise<ActionResult> {
	const { photographerId } = await requirePhotographer();
	const parsed = designSchema.safeParse(input);
	if (!parsed.success) return failFromZod(parsed.error);
	return saveStudioDesign(photographerId, parsed.data);
}
