"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ThemeSectionProps {
	children: ReactNode;
	variant?: "hero" | "light" | "dark" | "accent";
	className?: string;
}

export function ThemeSection({ children, variant = "light", className }: ThemeSectionProps) {
    const variants = {
        hero: "bg-black text-white min-h-screen",
        light: "bg-gray-50 text-gray-900 dark:bg-black dark:text-white",
        dark: "bg-black text-white",
        accent: "bg-yellow-400 text-black",
    };

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className={cn(variants[variant], className)}
		>
			{children}
		</motion.section>
	);
}
