import "server-only";

import { env } from "@/lib/env";
import { sendSms } from "./send-sms";
import { smsText } from "./sms-copy";

const appUrl = (path: string) =>
	`${env.BETTER_AUTH_URL.replace(/\/$/, "")}${path}`;

type Locale = string | null | undefined;

/** One-time code for signing in with a phone number. */
export function sendOtpSms(props: {
	to: string;
	locale: Locale;
	code: string;
	expiresInMinutes: number;
}) {
	const { to, locale, code, expiresInMinutes } = props;
	return sendSms({
		to,
		body: smsText(locale, "otp", {
			code,
			minutes: String(expiresInMinutes),
		}),
	});
}

/** Project invitation for someone reachable only by phone. */
export function sendProjectInvitationSms(props: {
	to: string;
	locale: Locale;
	studio: string;
	project: string;
}) {
	const { to, locale, studio, project } = props;
	return sendSms({
		to,
		body: smsText(locale, "projectInvitation", {
			studio,
			project,
			url: appUrl(`/client/phone?phone=${encodeURIComponent(to)}`),
		}),
	});
}

/** A gallery became visible to a phone-only client. */
export function sendGallerySharedSms(props: {
	to: string;
	locale: Locale;
	studio: string;
	gallery: string;
	galleryId: string;
}) {
	const { to, locale, galleryId, ...vars } = props;
	return sendSms({
		to,
		body: smsText(locale, "galleryShared", {
			...vars,
			url: appUrl(`/portal/galleries/${galleryId}`),
		}),
	});
}

/** A new message for a phone-only user. */
export function sendNewMessageSms(props: {
	to: string;
	locale: Locale;
	sender: string;
	path: string;
}) {
	const { to, locale, sender, path } = props;
	return sendSms({
		to,
		body: smsText(locale, "newMessage", { sender, url: appUrl(path) }),
	});
}
