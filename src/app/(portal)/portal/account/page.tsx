import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
	EmailContact,
	PhoneContact,
} from "@/components/portal/account/account-contacts";
import { AccountNameForm } from "@/components/portal/account/account-name-form";
import { requireClient } from "@/lib/auth/require-client";
import { realEmail } from "@/lib/phone";

/** Name, email and phone number of the signed-in account, in one place. */
export default async function AccountPage() {
	const t = await getTranslations("Portal.account");
	const { session } = await requireClient();
	const { user } = session;

	return (
		<>
			<div className="flex flex-col gap-1">
				<Link
					href="/portal"
					className="flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					{t("back")}
				</Link>
				<h1 className="font-display text-2xl font-bold tracking-tight">
					{t("title")}
				</h1>
				<p className="text-sm text-muted-foreground">{t("description")}</p>
			</div>
			<div className="flex max-w-2xl flex-col gap-3">
				<AccountNameForm name={user.name} />
				<EmailContact
					email={realEmail(user.email)}
					verified={user.emailVerified}
				/>
				<PhoneContact
					phone={user.phoneNumber ?? null}
					verified={Boolean(user.phoneNumberVerified)}
				/>
			</div>
		</>
	);
}
