"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	BOOKING_STATUSES,
	type BookingStatus,
} from "@/services/bookings/options";

const ALL = "all";

/** Status filter kept in `?status=`; changing it resets to page 1. */
export function BookingStatusFilter({ active }: { active?: BookingStatus }) {
	const t = useTranslations("Bookings");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const onChange = (value: string) => {
		const params = new URLSearchParams(searchParams);
		params.delete("page");
		if (value === ALL) params.delete("status");
		else params.set("status", value);
		router.replace(`${pathname}?${params}`, { scroll: false });
	};

	return (
		<Select value={active ?? ALL} onValueChange={onChange}>
			<SelectTrigger className="h-8 w-48 text-xs" aria-label={t("list.filter")}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL} className="text-xs">
					{t("list.allBookings")}
				</SelectItem>
				{BOOKING_STATUSES.map((status) => (
					<SelectItem key={status} value={status} className="text-xs">
						{t(`status.${status}`)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
