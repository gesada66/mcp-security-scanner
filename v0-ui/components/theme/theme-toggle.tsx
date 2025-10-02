"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeButton } from "./theme-button";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<ThemeButton variant="secondary" size="sm" className="w-10 h-10 p-0">
				<Sun className="h-4 w-4" />
			</ThemeButton>
		);
	}

	return (
		<ThemeButton
			variant="secondary"
			size="sm"
			className="w-10 h-10 p-0"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			aria-label="Toggle theme"
		>
			{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
		</ThemeButton>
	);
}
