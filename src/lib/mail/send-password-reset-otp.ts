import { sendMail } from "./send-mail";
import { passwordResetOtpTemplate } from "./templates/password-reset-otp";

export async function sendPasswordResetOtp(props: {
	to: string;
	otp: string;
	expiresInMinutes: number;
}) {
	const { to, ...templateProps } = props;
	await sendMail({ to, ...passwordResetOtpTemplate(templateProps) });
}
