import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
	{
		variants: {
			variant: {
				default:
					"bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-100/90 hover:shadow-lg hover:shadow-neutral-900/25 dark:hover:shadow-neutral-100/25",
				secondary:
					"bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-100 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-800/50",
				outline:
					"border border-neutral-200 bg-transparent hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-800/50",
				ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:shadow-md hover:shadow-neutral-200/30 dark:hover:shadow-neutral-800/30",
				link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3",
				lg: "h-10 rounded-md px-6",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : motion.button;
        // Filter out problematic props for motion.button
        const { onAnimationStart, onAnimationEnd, onDrag, onDragEnd, onDragStart, ...safeProps } = props as any;
        
        const motionProps = asChild ? {} : {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            transition: { duration: 0.1, ease: "easeOut" }
        };
        
		return (
			<Comp 
				className={cn(buttonVariants({ variant, size, className }))} 
				ref={ref} 
				{...motionProps}
				{...safeProps}
			/>
		);
	}
);
Button.displayName = "Button";


