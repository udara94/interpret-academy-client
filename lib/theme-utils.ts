import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { theme } from "./theme";

/**
 * Utility function to merge Tailwind classes
 * Use this instead of directly concatenating class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get theme color value
 * Example: getThemeColor('primary', 500) returns '#0ea5e9'
 */
export function getThemeColor(
  colorName: keyof typeof theme.colors,
  shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
): string {
  return theme.colors[colorName][shade];
}

/**
 * Get CSS variable for theme color
 * Useful for inline styles or CSS-in-JS
 */
export function getThemeColorVar(
  colorName: keyof typeof theme.colors,
  shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
): string {
  return `var(--color-${colorName}-${shade})`;
}

/**
 * Common color combinations for components
 */
export const componentColors = {
  button: {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary: "bg-secondary-600 hover:bg-secondary-700 text-white",
    success: "bg-success-600 hover:bg-success-700 text-white",
    warning: "bg-warning-600 hover:bg-warning-700 text-white",
    error: "bg-error-600 hover:bg-error-700 text-white",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
  },
  text: {
    primary: "text-primary-600",
    secondary: "text-secondary-600",
    muted: "text-secondary-500",
    error: "text-error-600",
    success: "text-success-600",
  },
  background: {
    primary: "bg-primary-50",
    secondary: "bg-secondary-50",
    white: "bg-white",
    dark: "bg-secondary-900",
  },
} as const;

