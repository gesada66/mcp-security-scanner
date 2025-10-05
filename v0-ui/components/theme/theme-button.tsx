"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ThemeButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "accent";
    size?: "sm" | "default" | "lg";
    className?: string;
}

export function ThemeButton({ 
    children, 
    variant = "primary", 
    size = "default", 
    className,
    ...rest
}: ThemeButtonProps) {
	const variants = {
		primary: "bg-primary text-primary-foreground hover:bg-primary/90",
		secondary: "border-2 border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
		accent: "bg-accent text-accent-foreground hover:bg-accent/80",
	};

	const sizes = {
		sm: "px-4 py-2 text-sm",
		default: "px-6 py-3 text-base",
		lg: "px-8 py-4 text-lg",
	};

    return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			transition={{ duration: 0.2 }}
            {...rest}
			className={cn(
				"font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 inline-flex items-center justify-center",
				variants[variant],
				sizes[size],
				className
			)}
		>
			{children}
		</motion.button>
	);
}
