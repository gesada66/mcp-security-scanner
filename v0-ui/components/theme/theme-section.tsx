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
        hero: "bg-background text-foreground min-h-screen",
        light: "bg-background text-foreground",
        dark: "bg-background text-foreground",
        accent: "bg-primary text-primary-foreground",
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
