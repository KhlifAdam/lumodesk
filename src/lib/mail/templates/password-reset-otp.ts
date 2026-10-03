import type { MailMessage } from "../send-mail";
import { baseLayout, mailColors as c } from "./base-layout";

type PasswordResetOtpProps = {
	otp: string;
	expiresInMinutes: number;
};

export function passwordResetOtpTemplate({
	otp,
	expiresInMinutes,
}: PasswordResetOtpProps): Pick<MailMessage, "subject" | "text" | "html"> {
	const content = `
		<h1 style="margin:0 0 12px;font-size:24px;line-height:30px;font-weight:600;color:${c.text};text-align:center;">Reset your password</h1>
		<p style="margin:0 0 28px;font-size:15px;line-height:24px;color:${c.muted};text-align:center;">
			Use the verification code below to choose a new password for your Lumodesk account.
		</p>
		<div style="margin:0 auto 28px;padding:16px 0;text-align:center;font-family:'SF Mono',Consolas,'Courier New',monospace;font-size:34px;line-height:40px;font-weight:700;letter-spacing:10px;text-indent:10px;color:${c.accent};background:${c.page};border:1px solid ${c.border};border-radius:12px;">${otp}</div>
		<p style="margin:0 0 20px;font-size:14px;line-height:22px;color:${c.text};text-align:center;">
			This code expires in <strong style="color:${c.accent};">${expiresInMinutes} minutes</strong>.
		</p>
		<hr style="border:none;border-top:1px solid ${c.border};margin:0 0 20px;" />
		<p style="margin:0;font-size:13px;line-height:20px;color:${c.muted};text-align:center;">
			Didn't ask for this? You can safely ignore this email &mdash; your password won't change.
		</p>`;

	return {
		subject: "Your Lumodesk password reset code",
		text: `Your Lumodesk password reset code is ${otp}. It expires in ${expiresInMinutes} minutes. If you didn't request this, you can ignore this email.`,
		html: baseLayout({
			preheader: `Your password reset code is ${otp}`,
			content,
		}),
	};
}
