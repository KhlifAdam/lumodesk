import { getTranslations } from "next-intl/server";
import { requireClient } from "@/lib/auth/require-client";
import {
	countPendingInvitations,
	listPendingInvitations,
} from "@/services/portal/queries";
import { InvitationCard } from "./invitation-card";
import { VerifyEmailCard } from "./verify-email-card";

/** Invitations for the signed-in address; details need a verified email. */
export async function PendingInvitations() {
	const t = await getTranslations("Portal.invitations");
	const { session } = await requireClient();
	const { email, emailVerified } = session.user;

	if (!emailVerified) {
		const count = await countPendingInvitations(email);
		return count > 0 ? <VerifyEmailCard email={email} count={count} /> : null;
	}

	const invitations = await listPendingInvitations(email);
	if (invitations.length === 0) return null;

	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-sm font-semibold">
				{t("title", { count: invitations.length })}
			</h2>
			{invitations.map((invitation) => (
				<InvitationCard key={invitation.id} invitation={invitation} />
			))}
		</section>
	);
}
