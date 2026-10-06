import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP } from "better-auth/plugins";
import { clientIntentHooks } from "@/lib/auth/client-intent-hooks";
import { ROLES } from "@/lib/auth/roles";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { sendEmailVerificationOtp } from "@/lib/mail/send-email-verification-otp";
import { sendPasswordResetOtp } from "@/lib/mail/send-password-reset-otp";

const OTP_EXPIRES_IN_SECONDS = 600;

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	databaseHooks: clientIntentHooks,
	user: {
		additionalFields: {
			locale: { type: "string", required: false, input: false },
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID as string,
			clientSecret: env.GITHUB_CLIENT_SECRET as string,
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID as string,
			clientSecret: env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	plugins: [
		admin({
			defaultRole: ROLES.photographer,
			adminRoles: [ROLES.admin],
		}),
		emailOTP({
			otpLength: 6,
			expiresIn: OTP_EXPIRES_IN_SECONDS,
			allowedAttempts: 3,
			storeOTP: "hashed",
			async sendVerificationOTP({ email, otp, type }) {
				const props = {
					to: email,
					otp,
					expiresInMinutes: OTP_EXPIRES_IN_SECONDS / 60,
				};
				// Not awaited, to avoid leaking whether the account exists via timing.
				const sending =
					type === "forget-password"
						? sendPasswordResetOtp(props)
						: type === "email-verification"
							? sendEmailVerificationOtp(props)
							: null;
				sending?.catch((error) =>
					console.error(`Failed to send ${type} OTP email:`, error),
				);
			},
		}),
	],
});
