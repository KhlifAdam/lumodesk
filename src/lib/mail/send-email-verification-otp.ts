import { mailCopy, resolveMailLocale } from "./mail-copy";
import { getRequestLocale } from "./request-locale";
import { sendMail } from "./send-mail";
import { otpEmail } from "./templates/otp-email";

/** Sent to whoever is at the browser, so it follows that browser's language. */
export async function sendEmailVerificationOtp(props: {
	to: string;
	otp: string;
	expiresInMinutes: number;
}) {
	const locale = resolveMailLocale(await getRequestLocale());
	await sendMail({
		to: props.to,
		...otpEmail(
			mailCopy(locale).emailVerification,
			locale,
			props.otp,
			props.expiresInMinutes,
		),
	});
}
