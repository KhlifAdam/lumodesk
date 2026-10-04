import type { MailMessage } from "../send-mail";
import { baseLayout, mailColors as c } from "./base-layout";

export interface NoticeCopy {
	languageName: string;
	subject: string;
	preheader: string;
	heading: string;
	intro: string;
	cta: string;
	text: string;
}

const LOCALES = ["en", "fr"] as const;

function escapeHtml(value: string) {
	return value.replace(
		/[&<>"']/g,
		(ch) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				ch
			] as string,
	);
}

function fill(template: string, vars: Record<string, string>, html: boolean) {
	return template.replace(/\{(\w+)\}/g, (match, name: string) => {
		const value = vars[name];
		if (value === undefined) return match;
		return html ? escapeHtml(value) : value;
	});
}

function section(copy: NoticeCopy, vars: Record<string, string>, url: string) {
	return `
		<p style="margin:0 0 6px;font-size:11px;line-height:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${c.accent};text-align:center;">${copy.languageName}</p>
		<h1 style="margin:0 0 12px;font-size:22px;line-height:30px;font-weight:600;color:${c.text};text-align:center;">${fill(copy.heading, vars, true)}</h1>
		<p style="margin:0 0 24px;font-size:15px;line-height:24px;color:${c.muted};text-align:center;">${fill(copy.intro, vars, true)}</p>
		<p style="margin:0;text-align:center;"><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:${c.accent};color:${c.accentText};font-size:14px;font-weight:600;text-decoration:none;">${copy.cta}</a></p>`;
}

/** Short notification with one call to action, in both languages. */
export function noticeEmail(
	copy: Record<(typeof LOCALES)[number], NoticeCopy>,
	vars: Record<string, string>,
	url: string,
): Pick<MailMessage, "subject" | "text" | "html"> {
	const withUrl = { ...vars, url };
	const divider = `<hr style="border:none;border-top:1px solid ${c.border};margin:28px 0;" />`;

	return {
		subject: `${fill(copy.en.subject, vars, false)} / ${fill(copy.fr.subject, vars, false)}`,
		text: LOCALES.map((l) => fill(copy[l].text, withUrl, false)).join("\n\n"),
		html: baseLayout({
			preheader: fill(copy.en.preheader, vars, true),
			content: LOCALES.map((l) => section(copy[l], vars, url)).join(divider),
		}),
	};
}
