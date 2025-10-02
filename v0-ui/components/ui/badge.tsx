import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				default: "border-transparent bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white",
				critical: "border-transparent bg-white text-black dark:bg-white dark:text-black",
				high: "border-transparent bg-white text-black dark:bg-white dark:text-black",
				medium: "border-transparent bg-white text-black dark:bg-white dark:text-black",
				low: "border-transparent bg-white text-black dark:bg-white dark:text-black",
				outline: "text-neutral-700 dark:text-neutral-300",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}


