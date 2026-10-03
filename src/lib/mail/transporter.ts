import nodemailer, { type Transporter } from "nodemailer";
import { z } from "zod";

const smtpEnv = z.object({
	SMTP_HOST: z.string().min(1),
	SMTP_PORT: z.coerce.number().int().positive(),
	SMTP_USER: z.string().min(1),
	SMTP_PASSWORD: z.string().min(1),
	SMTP_FROM: z.string().min(1),
});

let transporter: Transporter | undefined;

export function getTransporter() {
	if (!transporter) {
		const env = smtpEnv.parse(process.env);
		transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			secure: env.SMTP_PORT === 465,
			auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
		});
	}
	return transporter;
}
