# Theme Quick Reference

## 🎨 Change Brand Colors in One Place

**File to edit:** `tailwind.config.js`

### Primary Color (Main Brand Color)

Find this section and change the color values:

```javascript
primary: {
  500: "#0ea5e9", // ← Change this main color
  // Update all shades (50-900) for consistency
}
```

### How to Generate Color Shades

1. Pick your main brand color (e.g., `#8b5cf6` for purple)
2. Use a tool like [uicolors.app](https://uicolors.app/create) or [coolors.co](https://coolors.co/)
3. Generate shades from 50 (lightest) to 900 (darkest)
4. Replace all values in the `primary` object

### Example: Change to Purple

```javascript
primary: {
  50: "#faf5ff",
  100: "#f3e8ff",
  200: "#e9d5ff",
  300: "#d8b4fe",
  400: "#c084fc",
  500: "#8b5cf6", // Your brand color
  600: "#7c3aed",
  700: "#6d28d9",
  800: "#5b21b6",
  900: "#4c1d95",
}
```

## 📍 Where Colors Are Used

All components automatically use theme colors via Tailwind classes:

- `bg-primary-600` - Primary background
- `text-primary-600` - Primary text
- `border-primary-600` - Primary border
- `hover:bg-primary-700` - Hover state

## ✅ After Changing Colors

1. Save `tailwind.config.js`
2. Restart dev server: `npm run dev`
3. All components update automatically!

## 🎯 Color Usage Guide

| Color | Usage |
|-------|-------|
| `primary-*` | Buttons, links, brand elements |
| `secondary-*` | Text, backgrounds, borders |
| `success-*` | Success messages, positive actions |
| `warning-*` | Warnings, cautions |
| `error-*` | Errors, destructive actions |
| `info-*` | Informational messages |

## 💡 Pro Tips

- Keep shades consistent (use a color generator)
- Test in both light and dark mode
- Ensure sufficient contrast for accessibility
- Use `primary-500` for main brand color
- Use `primary-600` for hover states
- Use `primary-400` for light backgrounds



