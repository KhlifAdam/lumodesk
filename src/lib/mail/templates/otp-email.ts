import type { MailMessage } from "../send-mail";
import { baseLayout, mailColors as c } from "./base-layout";

export interface OtpCopy {
	languageName: string;
	subject: string;
	preheader: string;
	heading: string;
	intro: string;
	expires: string;
	ignore: string;
	text: string;
}

const LOCALES = ["en", "fr"] as const;

function section(copy: OtpCopy, otp: string, expiresInMinutes: number) {
	return `
		<p style="margin:0 0 6px;font-size:11px;line-height:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${c.accent};text-align:center;">${copy.languageName}</p>
		<h1 style="margin:0 0 12px;font-size:24px;line-height:30px;font-weight:600;color:${c.text};text-align:center;">${copy.heading}</h1>
		<p style="margin:0 0 28px;font-size:15px;line-height:24px;color:${c.muted};text-align:center;">${copy.intro}</p>
		<div style="margin:0 auto 28px;padding:16px 0;text-align:center;font-family:'SF Mono',Consolas,'Courier New',monospace;font-size:34px;line-height:40px;font-weight:700;letter-spacing:10px;text-indent:10px;color:${c.accent};background:${c.page};border:1px solid ${c.border};border-radius:12px;">${otp}</div>
		<p style="margin:0 0 20px;font-size:14px;line-height:22px;color:${c.text};text-align:center;">${copy.expires.replace("{minutes}", `<strong style="color:${c.accent};">${expiresInMinutes}</strong>`)}</p>
		<p style="margin:0;font-size:13px;line-height:20px;color:${c.muted};text-align:center;">${copy.ignore}</p>`;
}

/** A one-time code email in both languages. */
export function otpEmail(
	copy: Record<(typeof LOCALES)[number], OtpCopy>,
	otp: string,
	expiresInMinutes: number,
): Pick<MailMessage, "subject" | "text" | "html"> {
	const divider = `<hr style="border:none;border-top:1px solid ${c.border};margin:28px 0;" />`;
	const content = LOCALES.map((locale) =>
		section(copy[locale], otp, expiresInMinutes),
	).join(divider);

	return {
		subject: `${copy.en.subject} / ${copy.fr.subject}`,
		text: LOCALES.map((locale) =>
			copy[locale].text
				.replace("{otp}", otp)
				.replace("{minutes}", String(expiresInMinutes)),
		).join("\n\n"),
		html: baseLayout({
			preheader: copy.en.preheader.replace("{otp}", otp),
			content,
		}),
	};
}
