"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
	children: ReactNode;
	title?: string;
	variant?: "default" | "dark";
	className?: string;
}

export function ThemeCard({ children, title, variant = "default", className }: ThemeCardProps) {
	const variants = {
		default: "bg-card border-border text-card-foreground",
		dark: "bg-card border-border text-card-foreground",
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			className={cn(
				"rounded-xl border p-6 shadow-lg transition-shadow hover:shadow-xl",
				variants[variant],
				className
			)}
		>
			{title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
			{children}
		</motion.div>
	);
}
