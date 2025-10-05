"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedOptionButtonProps {
  value: string;
  label: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
  multiple?: boolean;
  className?: string;
}

export function AnimatedOptionButton({
  value,
  label,
  description,
  isSelected,
  onClick,
  multiple = false,
  className,
}: AnimatedOptionButtonProps) {
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "w-full text-left rounded-lg border p-4 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isSelected
          ? "border-primary bg-primary/10 shadow-lg"
          : "border-border bg-card hover:bg-accent hover:border-accent-foreground/20",
        className
      )}
      animate={{
        scale: isFocused ? 1.02 : 1,
        borderColor: isSelected 
          ? "hsl(var(--primary))" 
          : isFocused 
            ? "hsl(var(--ring))" 
            : "hsl(var(--border))",
        boxShadow: isFocused 
          ? "0 0 0 2px hsl(var(--ring) / 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)" 
          : isSelected
            ? "0 4px 12px rgba(0, 0, 0, 0.1)"
            : "0 0 0 0px transparent",
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: "easeOut",
      }}
      whileHover={{
        scale: prefersReducedMotion ? 1 : 1.01,
        transition: { duration: 0.1 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      aria-pressed={isSelected}
    >
      <motion.div
        className="flex items-center justify-between"
        animate={{
          x: isSelected ? 4 : 0,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.2,
          ease: "easeOut",
        }}
      >
        <div className="flex-1">
          <motion.div
            className="font-medium text-foreground"
            animate={{
              color: isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground))",
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
            }}
          >
            {label}
          </motion.div>
          {description && (
            <motion.div
              className="text-sm text-muted-foreground mt-1"
              animate={{
                opacity: isSelected ? 0.8 : 0.7,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.2,
              }}
            >
              {description}
            </motion.div>
          )}
        </div>

        {/* Selection indicator */}
        <motion.div
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
            isSelected
              ? "border-primary bg-primary"
              : "border-border"
          )}
          animate={{
            scale: isSelected ? 1 : 0.8,
            opacity: isSelected ? 1 : 0.5,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.2,
            ease: "easeOut",
          }}
        >
          {isSelected && (
            <motion.svg
              className="w-3 h-3 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.2,
                ease: "easeOut",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
