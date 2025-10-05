import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	// Filter out conflicting props for motion.div
	const { onDrag, onDragEnd, onDragStart, ...safeProps } = props as any;
	
	return (
		<motion.div
			className={cn(
				"rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-200 hover:shadow-hover",
				className
			)}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			whileHover={{ 
				y: -4,
				transition: { duration: 0.2, ease: "easeOut" }
			}}
			{...safeProps}
		/>
	);
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return <h3 className={cn("text-sm font-medium", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("p-5 pt-0", className)} {...props} />;
}


