// Import theme configuration
// Note: Using require for CommonJS compatibility with Tailwind
const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary brand color (warm yellow to orange gradient)
        primary: {
          50: "#fffbeb", // Lightest yellow
          100: "#fef3c7", // Very light yellow
          200: "#fde68a", // Light yellow
          300: "#fcd34d", // Medium yellow
          400: "#fbbf24", // Yellow
          500: "#f59e0b", // Main primary color - warm yellow/orange
          600: "#d97706", // Darker orange
          700: "#b45309", // Deep orange
          800: "#92400e", // Dark orange
          900: "#78350f", // Darkest orange
        },
        // Secondary/neutral colors (warm beige/cream tones)
        secondary: {
          50: "#fefbf5", // Softest beige (background)
          100: "#faf7f0", // Very light beige
          200: "#f5f1e8", // Light beige
          300: "#e8e3d5", // Medium beige
          400: "#d4cdb8", // Warm gray-beige
          500: "#a8a08a", // Medium warm gray
          600: "#7d7562", // Darker warm gray
          700: "#5a5344", // Dark warm gray
          800: "#3d372d", // Very dark warm gray
          900: "#2a251f", // Darkest warm gray
        },
        // Success/positive actions
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
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
      // Card utility classes for global transparent shadow look
      boxShadow: {
        card: "0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "card-hover":
          "0 8px 16px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
      },
      backdropBlur: {
        card: "8px",
        "card-strong": "12px",
      },
    },
  },
  plugins: [
    // Plugin to add card utility classes
    function ({ addUtilities }) {
      const newUtilities = {
        ".card": {
          "background-color": "rgba(255, 255, 255, 0.4)",
          "backdrop-filter": "blur(12px)",
          "border-radius": "0.75rem",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          "box-shadow":
            "0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          transition: "all 0.2s ease-in-out",
        },
        ".card-transparent": {
          "background-color": "rgba(255, 255, 255, 0.3)",
          "backdrop-filter": "blur(16px)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
        },
        ".card-elevated": {
          "background-color": "rgba(255, 255, 255, 0.6)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          "box-shadow":
            "0 4px 12px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        },
        ".dark .card": {
          "background-color": "rgba(45, 55, 72, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".dark .card-transparent": {
          "background-color": "rgba(45, 55, 72, 0.3)",
        },
        ".dark .card-elevated": {
          "background-color": "rgba(45, 55, 72, 0.6)",
        },
        ".card-hover": {
          "&:hover": {
            "box-shadow":
              "0 8px 16px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
            "background-color": "rgba(255, 255, 255, 0.6)",
          },
        },
        ".dark .card-hover": {
          "&:hover": {
            "background-color": "rgba(45, 55, 72, 0.6)",
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
