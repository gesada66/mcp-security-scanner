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
		primary: "bg-yellow-400 text-black hover:bg-yellow-300",
		secondary: "border-2 border-white text-white hover:bg-white hover:text-black",
		accent: "bg-black text-white hover:bg-slate-800",
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
