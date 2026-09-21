import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
			<div className="mx-auto flex max-w-md flex-col items-center space-y-6 text-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
					<span className="text-3xl font-semibold text-primary">
						{session.user.name.charAt(0).toUpperCase()}
					</span>
				</div>
				<h1 className="text-4xl font-bold tracking-tight">
					Welcome to the Dashboard
				</h1>
				<p className="text-lg text-muted-foreground">
					Hello, {session.user.name}! You are logged in with the role{" "}
					<span className="font-semibold text-foreground">
						{session.user.role || "user"}
					</span>
					.
				</p>
			</div>
		</div>
	);
}
