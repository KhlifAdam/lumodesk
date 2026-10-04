import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";
import { sendMail } from "./send-mail";
import { otpEmail } from "./templates/otp-email";

export async function sendEmailVerificationOtp(props: {
	to: string;
	otp: string;
	expiresInMinutes: number;
}) {
	const copy = { en: en.Mail.emailVerification, fr: fr.Mail.emailVerification };
	await sendMail({
		to: props.to,
		...otpEmail(copy, props.otp, props.expiresInMinutes),
	});
}
