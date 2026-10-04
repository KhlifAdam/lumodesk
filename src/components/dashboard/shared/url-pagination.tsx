"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

/** Page numbers to show: first, last, and a window around the current page. */
function pageWindow(page: number, pageCount: number): (number | "gap")[] {
	const pages = new Set([1, pageCount, page - 1, page, page + 1]);
	const sorted = [...pages]
		.filter((p) => p >= 1 && p <= pageCount)
		.sort((a, b) => a - b);
	return sorted.flatMap((p, i) =>
		i > 0 && p - sorted[i - 1] > 1 ? ["gap" as const, p] : [p],
	);
}

/** Pagination that keeps the current page in `?page=`, preserving other params. */
export function UrlPagination({
	page,
	pageCount,
}: {
	page: number;
	pageCount: number;
}) {
	const t = useTranslations("Common.pagination");
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (pageCount <= 1) return null;

	const hrefFor = (target: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", String(target));
		return `${pathname}?${params}`;
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href={hrefFor(Math.max(1, page - 1))}
						aria-disabled={page === 1}
						className={page === 1 ? "pointer-events-none opacity-50" : ""}
					>
						{t("previous")}
					</PaginationPrevious>
				</PaginationItem>
				{pageWindow(page, pageCount).map((p, i) =>
					p === "gap" ? (
						// biome-ignore lint/suspicious/noArrayIndexKey: gaps have no identity
						<PaginationItem key={`gap-${i}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={p}>
							<PaginationLink href={hrefFor(p)} isActive={p === page}>
								{p}
							</PaginationLink>
						</PaginationItem>
					),
				)}
				<PaginationItem>
					<PaginationNext
						href={hrefFor(Math.min(pageCount, page + 1))}
						aria-disabled={page === pageCount}
						className={
							page === pageCount ? "pointer-events-none opacity-50" : ""
						}
					>
						{t("next")}
					</PaginationNext>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
