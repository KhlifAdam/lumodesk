"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/** Light/dark switch for the marketing pages (the app's own theme). */
export function ThemeToggle() {
	const t = useTranslations("Landing.header");
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const dark = mounted ? resolvedTheme === "dark" : true;

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(dark ? "light" : "dark")}
			aria-label={t("toggleTheme")}
		>
			{dark ? <Sun /> : <Moon />}
		</Button>
	);
}
