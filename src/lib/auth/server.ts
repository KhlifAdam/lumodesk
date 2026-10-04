import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP } from "better-auth/plugins";
import { ROLES } from "@/lib/auth/roles";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { sendPasswordResetOtp } from "@/lib/mail/send-password-reset-otp";

const OTP_EXPIRES_IN_SECONDS = 600;

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
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
				if (type !== "forget-password") return;
				// Not awaited, to avoid leaking whether the account exists via timing.
				sendPasswordResetOtp({
					to: email,
					otp,
					expiresInMinutes: OTP_EXPIRES_IN_SECONDS / 60,
				}).catch((error) =>
					console.error("Failed to send password reset OTP email:", error),
				);
			},
		}),
	],
});
