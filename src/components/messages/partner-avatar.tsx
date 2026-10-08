import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsOf } from "@/lib/initials";
import type { Partner } from "@/services/messages/types";

export function PartnerAvatar({ partner }: { partner: Partner }) {
	return (
		<Avatar className="h-8 w-8 shrink-0 border border-border">
			<AvatarImage src={partner.image ?? undefined} alt="" />
			<AvatarFallback className="bg-primary/10 text-[11px] text-primary">
				{initialsOf(partner.studioName ?? partner.name)}
			</AvatarFallback>
		</Avatar>
	);
}
