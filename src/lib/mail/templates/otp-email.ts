import type { Locale } from "@/i18n/config";
import type { MailMessage } from "../send-mail";
import { baseLayout, mailColors as c } from "./base-layout";

export interface OtpCopy {
	subject: string;
	preheader: string;
	heading: string;
	intro: string;
	expires: string;
	ignore: string;
	text: string;
}

/** A one-time code email in the recipient's language. */
export function otpEmail(
	copy: OtpCopy,
	locale: Locale,
	otp: string,
	expiresInMinutes: number,
): Pick<MailMessage, "subject" | "text" | "html"> {
	return {
		subject: copy.subject,
		text: copy.text
			.replace("{otp}", otp)
			.replace("{minutes}", String(expiresInMinutes)),
		html: baseLayout({
			locale,
			preheader: copy.preheader.replace("{otp}", otp),
			content: `
			<h1 style="margin:0 0 12px;font-size:24px;line-height:30px;font-weight:600;color:${c.text};text-align:center;">${copy.heading}</h1>
			<p style="margin:0 0 28px;font-size:15px;line-height:24px;color:${c.muted};text-align:center;">${copy.intro}</p>
			<div style="margin:0 auto 28px;padding:16px 0;text-align:center;font-family:'SF Mono',Consolas,'Courier New',monospace;font-size:34px;line-height:40px;font-weight:700;letter-spacing:10px;text-indent:10px;color:${c.accent};background:${c.page};border:1px solid ${c.border};border-radius:12px;">${otp}</div>
			<p style="margin:0 0 20px;font-size:14px;line-height:22px;color:${c.text};text-align:center;">${copy.expires.replace("{minutes}", `<strong style="color:${c.accent};">${expiresInMinutes}</strong>`)}</p>
			<p style="margin:0;font-size:13px;line-height:20px;color:${c.muted};text-align:center;">${copy.ignore}</p>`,
		}),
	};
}
