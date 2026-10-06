import type { Locale } from "@/i18n/config";
import { mailCopy } from "../mail-copy";
import { otpEmail } from "./otp-email";

export function passwordResetOtpTemplate({
	locale,
	otp,
	expiresInMinutes,
}: {
	locale: Locale;
	otp: string;
	expiresInMinutes: number;
}) {
	return otpEmail(
		mailCopy(locale).passwordReset,
		locale,
		otp,
		expiresInMinutes,
	);
}
