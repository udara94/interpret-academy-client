/**
 * Centralized Theme Configuration
 * 
 * All branding colors and theme properties are defined here.
 * Change colors in this file to update the entire app.
 */

export const theme = {
  colors: {
    // Primary brand color (warm yellow to orange gradient)
    primary: {
      50: "#fffbeb",   // Lightest yellow
      100: "#fef3c7",  // Very light yellow
      200: "#fde68a",  // Light yellow
      300: "#fcd34d",  // Medium yellow
      400: "#fbbf24",  // Yellow
      500: "#f59e0b",  // Main primary color - warm yellow/orange
      600: "#d97706",  // Darker orange
      700: "#b45309",  // Deep orange
      800: "#92400e",  // Dark orange
      900: "#78350f",  // Darkest orange
    },
    
    // Secondary/neutral colors (warm beige/cream tones)
    secondary: {
      50: "#fefbf5",   // Softest beige (background)
      100: "#faf7f0",  // Very light beige
      200: "#f5f1e8",  // Light beige
      300: "#e8e3d5",  // Medium beige
      400: "#d4cdb8",  // Warm gray-beige
      500: "#a8a08a",  // Medium warm gray
      600: "#7d7562",  // Darker warm gray
      700: "#5a5344",  // Dark warm gray
      800: "#3d372d",  // Very dark warm gray
      900: "#2a251f",  // Darkest warm gray
    },
    
    // Success/positive actions (warm green)
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",  // Main success green
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    
    // Warning/attention
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    
    // Error/danger
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
    
    // Info
    info: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      serif: ["Georgia", "serif"],
      mono: ["Menlo", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
  },
  
  // Spacing scale
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4rem",
  },
  
  // Border radius
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    card: "0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    cardHover: "0 8px 16px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },
  
  // Card styles (for global card theming)
  card: {
    // Base card styling with transparent shadow look
    base: {
      background: "rgba(255, 255, 255, 0.8)", // white/80
      backgroundDark: "rgba(45, 55, 72, 0.8)", // secondary-800/80
      backdropBlur: "blur(8px)",
      borderRadius: "0.75rem", // rounded-xl
      border: "1px solid rgba(0, 0, 0, 0.05)", // subtle border
      borderDark: "1px solid rgba(255, 255, 255, 0.1)",
      shadow: "0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    // Transparent variant (more transparent)
    transparent: {
      background: "rgba(255, 255, 255, 0.6)",
      backgroundDark: "rgba(45, 55, 72, 0.6)",
      backdropBlur: "blur(12px)",
    },
    // Elevated variant (less transparent, more solid)
    elevated: {
      background: "rgba(255, 255, 255, 0.9)",
      backgroundDark: "rgba(45, 55, 72, 0.9)",
      backdropBlur: "blur(8px)",
    },
  },
  
  // Breakpoints (for responsive design)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Export individual color palettes for easy access
export const colors = theme.colors;
export const primary = theme.colors.primary;
export const secondary = theme.colors.secondary;
export const success = theme.colors.success;
export const warning = theme.colors.warning;
export const error = theme.colors.error;
export const info = theme.colors.info;

// Type exports
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;


