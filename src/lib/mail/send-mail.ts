import { isPhoneEmail } from "@/lib/phone";
import { getTransporter } from "./transporter";

export type MailMessage = {
	to: string;
	subject: string;
	text: string;
	html: string;
};

export async function sendMail(message: MailMessage) {
	// Phone-only accounts have a placeholder address that can't receive mail.
	if (isPhoneEmail(message.to)) return;
	await getTransporter().sendMail({ from: process.env.SMTP_FROM, ...message });
}
