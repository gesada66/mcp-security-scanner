"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  AnimatedToast,
  ToastIcons,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <AnimatePresence mode="popLayout">
        {toasts.map(function ({ id, title, description, action, icon, ...props }) {
          return (
            <AnimatedToast
              key={id}
              title={typeof title === 'string' ? title : undefined}
              description={typeof description === 'string' ? description : undefined}
              icon={icon}
              action={action}
              {...props}
            />
          );
        })}
      </AnimatePresence>
      <ToastViewport />
    </ToastProvider>
  );
}

// Convenience functions for different toast types
// Hook-based helpers (valid usage of hooks inside a hook)
export function useCreateToast() {
  const { toast } = useToast();
  return {
    success: (title: string, description?: string) => toast({ title, description, variant: "success", icon: ToastIcons.success }),
    error: (title: string, description?: string) => toast({ title, description, variant: "destructive", icon: ToastIcons.error }),
    warning: (title: string, description?: string) => toast({ title, description, variant: "warning", icon: ToastIcons.warning }),
    info: (title: string, description?: string) => toast({ title, description, variant: "info", icon: ToastIcons.info }),
  };
}
