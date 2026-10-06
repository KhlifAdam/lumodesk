import { resolveMailLocale } from "./mail-copy";
import { getRequestLocale } from "./request-locale";
import { sendMail } from "./send-mail";
import { passwordResetOtpTemplate } from "./templates/password-reset-otp";

/** Sent to whoever is at the browser, so it follows that browser's language. */
export async function sendPasswordResetOtp(props: {
	to: string;
	otp: string;
	expiresInMinutes: number;
}) {
	const { to, ...templateProps } = props;
	const locale = resolveMailLocale(await getRequestLocale());
	await sendMail({
		to,
		...passwordResetOtpTemplate({ locale, ...templateProps }),
	});
}
