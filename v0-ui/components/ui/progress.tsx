import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
	return (
		<div className={cn("h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800", className)}>
			<div
				className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
				style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
			/>
		</div>
	);
}


