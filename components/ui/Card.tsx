import { cn } from "@/lib/theme-utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "transparent" | "elevated";
  hover?: boolean;
}

/**
 * Global Card Component
 * 
 * Provides consistent card styling across the app with transparent shadow look.
 * Usage: <Card>Your content</Card>
 */
export default function Card({
  children,
  className,
  variant = "default",
  hover = false,
}: CardProps) {
  const baseClasses = "rounded-xl transition-all duration-200";
  
  const variantClasses = {
    default: "bg-white/40 dark:bg-secondary-800/40 backdrop-blur-[12px] shadow-md border border-secondary-200/80 dark:border-secondary-700/80",
    transparent: "bg-white/30 dark:bg-secondary-800/30 backdrop-blur-[16px] shadow-lg border border-secondary-200/60 dark:border-secondary-700/60",
    elevated: "bg-white/60 dark:bg-secondary-800/60 backdrop-blur-[10px] shadow-xl border border-secondary-200/100 dark:border-secondary-700/100",
  };

  const hoverClasses = hover
    ? "hover:shadow-xl hover:bg-white/60 dark:hover:bg-secondary-800/60"
    : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
    >
      {children}
    </div>
  );
}

