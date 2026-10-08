import { z } from "zod";
import { toE164 } from "@/lib/phone";

// Messages are `Validation.*` i18n keys; <FormMessage /> translates them.

export const OTP_LENGTH = 6;
const MIN_PASSWORD_LENGTH = 8;

const email = z.email("invalidEmail");
const newPassword = z.string().min(MIN_PASSWORD_LENGTH, "passwordTooShort");

/** Two password fields must match; the error is shown on the second one. */
function withMatchingPasswords<T extends z.ZodObject>(schema: T) {
	return schema.refine((value) => value.password === value.confirmPassword, {
		path: ["confirmPassword"],
		message: "passwordsDontMatch",
	});
}

export const loginSchema = z.object({
	email,
	password: z.string().min(1, "required"),
});

const registerFields = {
	email,
	password: newPassword,
	confirmPassword: z.string(),
};

export const registerSchema = withMatchingPasswords(
	z.object({ ...registerFields, name: z.string().trim().max(80, "tooLong") }),
);

/** Clients sign up from a studio site and must give their name. */
export const clientRegisterSchema = withMatchingPasswords(
	z.object({
		...registerFields,
		name: z.string().trim().min(1, "required").max(80, "tooLong"),
	}),
);

export const phoneSchema = z.object({
	phone: z
		.string()
		.trim()
		.min(1, "required")
		.refine((value) => toE164(value) !== null, "invalidPhone"),
});

export const codeSchema = z.object({
	code: z.string().length(OTP_LENGTH, "otpLength"),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = withMatchingPasswords(
	z.object({
		otp: z.string().length(OTP_LENGTH, "otpLength"),
		password: newPassword,
		confirmPassword: z.string(),
	}),
);

export type PhoneValues = z.infer<typeof phoneSchema>;
export type CodeValues = z.infer<typeof codeSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
