import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP } from "better-auth/plugins";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";
import { sendPasswordResetOtp } from "@/lib/mail/send-password-reset-otp";

const OTP_EXPIRES_IN_SECONDS = 600;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	plugins: [
		admin(),
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
