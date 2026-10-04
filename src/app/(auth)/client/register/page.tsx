import { z } from "zod";
import { RegisterForm } from "@/components/auth/register-form";

const emailParam = z.email().catch("");

export default async function ClientRegisterPage({
	searchParams,
}: {
	searchParams: Promise<{ email?: string }>;
}) {
	const email = emailParam.parse((await searchParams).email ?? "");
	return <RegisterForm audience="client" defaultEmail={email} />;
}
