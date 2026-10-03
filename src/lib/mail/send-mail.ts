import { getTransporter } from "./transporter";

export type MailMessage = {
	to: string;
	subject: string;
	text: string;
	html: string;
};

export async function sendMail(message: MailMessage) {
	await getTransporter().sendMail({ from: process.env.SMTP_FROM, ...message });
}
