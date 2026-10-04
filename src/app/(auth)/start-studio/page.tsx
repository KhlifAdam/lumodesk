import { redirect } from "next/navigation";
import { StartStudioCard } from "@/components/auth/start-studio-card";
import { requireUser } from "@/lib/auth/require-user";
import { ROLES } from "@/lib/auth/roles";

export default async function StartStudioPage() {
	const session = await requireUser();
	if (session.user.role === ROLES.photographer) redirect("/dashboard");

	return <StartStudioCard email={session.user.email} />;
}
