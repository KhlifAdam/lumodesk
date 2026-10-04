import en from "../../../../messages/en.json";
import fr from "../../../../messages/fr.json";
import { otpEmail } from "./otp-email";

/** One email in both languages, so it doesn't depend on the visitor's locale. */
export function passwordResetOtpTemplate({
	otp,
	expiresInMinutes,
}: {
	otp: string;
	expiresInMinutes: number;
}) {
	return otpEmail(
		{ en: en.Mail.passwordReset, fr: fr.Mail.passwordReset },
		otp,
		expiresInMinutes,
	);
}
