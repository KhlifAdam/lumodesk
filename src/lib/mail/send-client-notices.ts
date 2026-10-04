import { env } from "@/lib/env";
import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";
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
	studio: string;
	project: string;
	eventDate: Date | null;
	hasAccount: boolean;
}) {
	const { to, studio, project, eventDate, hasAccount } = props;
	const copy = { en: en.Mail.projectInvitation, fr: fr.Mail.projectInvitation };
	const label = eventDate ? `${project} (${shortDate(eventDate)})` : project;
	const url = appUrl(
		hasAccount ? "/portal" : `/client/register?email=${encodeURIComponent(to)}`,
	);
	await sendMail({
		to,
		...noticeEmail(copy, { studio, project: label }, url),
	});
}

/** To the client, when a gallery becomes visible to them. */
export async function sendGallerySharedEmail(props: {
	to: string;
	studio: string;
	gallery: string;
	project: string;
	galleryId: string;
}) {
	const { to, galleryId, ...vars } = props;
	const copy = { en: en.Mail.galleryShared, fr: fr.Mail.galleryShared };
	const url = appUrl(`/portal/galleries/${galleryId}`);
	await sendMail({ to, ...noticeEmail(copy, vars, url) });
}

/** To the photographer, when the client submits their picks. */
export async function sendSelectionSubmittedEmail(props: {
	to: string;
	client: string;
	gallery: string;
	project: string;
	count: number;
	projectId: string;
	galleryId: string;
}) {
	const { to, projectId, galleryId, count, ...vars } = props;
	const copy = {
		en: en.Mail.selectionSubmitted,
		fr: fr.Mail.selectionSubmitted,
	};
	const url = appUrl(
		`/dashboard/projects/${projectId}/galleries/${galleryId}?filter=selected`,
	);
	await sendMail({
		to,
		...noticeEmail(copy, { ...vars, count: String(count) }, url),
	});
}
