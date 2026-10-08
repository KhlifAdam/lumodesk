import { PhoneForm } from "@/components/auth/phone-form";

interface ClientPhonePageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Sign in or sign up with a phone number; invitation texts link here. */
export default async function ClientPhonePage({
	searchParams,
}: ClientPhonePageProps) {
	const { phone } = await searchParams;
	return <PhoneForm defaultPhone={typeof phone === "string" ? phone : ""} />;
}
