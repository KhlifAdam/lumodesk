"use client";

import { type ReactNode, useEffect, useState } from "react";

/**
 * Header wrapper that exposes `data-scrolled` once the page scrolls, so each
 * template can style the scrolled state with `data-[scrolled=true]:…`.
 */
export function StickyHeader({
	className,
	children,
}: {
	className: string;
	children: ReactNode;
}) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header data-scrolled={scrolled} className={className}>
			{children}
		</header>
	);
}
