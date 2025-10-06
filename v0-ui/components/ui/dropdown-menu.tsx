"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

export function DropdownMenu(props: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open, setOpen }), [open]);
  return (
    <DropdownMenuContext.Provider value={value}>
      <div className="relative inline-block" data-state={open ? "open" : "closed"}>{props.children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger(props: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(DropdownMenuContext)!;
  const child = React.Children.only(props.children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  return React.cloneElement(child, {
    ...child.props,
    role: "button",
    "aria-haspopup": "menu",
    "aria-expanded": ctx.open,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      (child.props.onClick as unknown as ((e: React.MouseEvent<HTMLElement>) => void) | undefined)?.(e);
      ctx.setOpen(true);
    },
  });
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }>(
  ({ className, align = "start", ...props }, ref) => {
    const ctx = React.useContext(DropdownMenuContext)!;
    if (!ctx.open) return null;
    return (
      <div
        ref={ref}
        role="menu"
        className={cn(
          "absolute z-50 mt-2 min-w-48 rounded-md border bg-background p-1 shadow-md",
          align === "end" ? "right-0" : "left-0",
          className
        )}
        {...props}
      />
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const ctx = React.useContext(DropdownMenuContext)!;
    return (
      <button
        ref={ref}
        role="menuitem"
        className={cn("w-full rounded px-3 py-2 text-left text-sm hover:bg-accent", className)}
        onClick={(e) => {
          props.onClick?.(e);
          ctx.setOpen(false);
        }}
        {...props}
      />
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";


