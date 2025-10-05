"use client";

import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  className?: string;
}

export const AnimatedInput = forwardRef<HTMLSelectElement, AnimatedInputProps>(
  ({ label, error, className, children, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    return (
      <div className="relative">
        <motion.label
          htmlFor={props.id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`}
          className={cn(
            "absolute left-3 transition-all duration-300 pointer-events-none",
            isFocused || props.value
              ? "top-1 text-xs text-primary font-medium"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          )}
          animate={{
            y: isFocused || props.value ? -8 : 0,
            scale: isFocused || props.value ? 0.85 : 1,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.2,
            ease: "easeOut",
          }}
        >
          {label}
        </motion.label>

        <motion.select
          ref={ref}
          id={props.id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`}
          aria-label={props['aria-label'] || label}
          className={cn(
            "w-full px-3 pt-6 pb-2 bg-background border border-input rounded-md",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-200",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={{
            borderColor: isFocused ? "hsl(var(--ring))" : "hsl(var(--border))",
            boxShadow: isFocused 
              ? "0 0 0 2px hsl(var(--ring) / 0.2)" 
              : "0 0 0 0px transparent",
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.2,
            ease: "easeOut",
          }}
          {...props}
        >
          {children}
        </motion.select>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";
