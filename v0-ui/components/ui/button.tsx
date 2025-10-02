import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-100/90",
				secondary:
					"bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-100",
				outline:
					"border border-neutral-200 bg-transparent hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800",
				ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
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
		const Comp = asChild ? Slot : "button";
        // Filter out problematic props for Slot component without using any
        type HtmlButtonPropsWithoutPopover = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "popover">;
        const { popover: _popover, ...safeProps } = (props as HtmlButtonPropsWithoutPopover & {
            popover?: unknown;
        });
		return (
			<Comp 
				className={cn(buttonVariants({ variant, size, className }))} 
				ref={ref} 
				{...safeProps}
			/>
		);
	}
);
Button.displayName = "Button";


