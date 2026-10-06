import type { Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import { mailCopy } from "./mail-copy";
import { sendMail } from "./send-mail";
import { noticeEmail } from "./templates/notice-email";

const appUrl = (path: string) =>
	`${env.BETTER_AUTH_URL.replace(/\/$/, "")}${path}`;

/** dd/mm/yyyy reads the same in both languages of the email. */
function shortDate(date: Date) {
	return date.toLocaleDateString("en-GB", { timeZone: "UTC" });
}

/** To the invited client; new addresses are sent to the client sign-up. */
export async function sendProjectInvitationEmail(props: {
	to: string;
	locale: Locale;
	studio: string;
	project: string;
	eventDate: Date | null;
	hasAccount: boolean;
}) {
	const { to, locale, studio, project, eventDate, hasAccount } = props;
	const label = eventDate ? `${project} (${shortDate(eventDate)})` : project;
	const url = appUrl(
		hasAccount ? "/portal" : `/client/register?email=${encodeURIComponent(to)}`,
	);
	await sendMail({
		to,
		...noticeEmail(
			mailCopy(locale).projectInvitation,
			locale,
			{ studio, project: label },
			url,
		),
	});
}

/** To the client, when a gallery becomes visible to them. */
export async function sendGallerySharedEmail(props: {
	to: string;
	locale: Locale;
	studio: string;
	gallery: string;
	project: string;
	galleryId: string;
}) {
	const { to, locale, galleryId, ...vars } = props;
	const url = appUrl(`/portal/galleries/${galleryId}`);
	await sendMail({
		to,
		...noticeEmail(mailCopy(locale).galleryShared, locale, vars, url),
	});
}

/** To the photographer, when the client submits their picks. */
export async function sendSelectionSubmittedEmail(props: {
	to: string;
	locale: Locale;
	client: string;
	gallery: string;
	project: string;
	count: number;
	projectId: string;
	galleryId: string;
}) {
	const { to, locale, projectId, galleryId, count, ...vars } = props;
	const url = appUrl(
		`/dashboard/projects/${projectId}/galleries/${galleryId}?filter=selected`,
	);
	await sendMail({
		to,
		...noticeEmail(
			mailCopy(locale).selectionSubmitted,
			locale,
			{ ...vars, count: String(count) },
			url,
		),
	});
}
