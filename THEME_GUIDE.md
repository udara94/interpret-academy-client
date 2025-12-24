# Theme Configuration Guide

## Overview

All branding colors and theme properties are centralized in a single file: `lib/theme.ts`. Change colors in this file to update the entire app instantly.

## Quick Start

### Changing Brand Colors

1. Open `lib/theme.ts`
2. Modify the color values in the `theme.colors` object
3. Save the file - changes apply automatically

### Example: Change Primary Color

```typescript
// In lib/theme.ts
primary: {
  500: "#0ea5e9", // Change this to your brand color
  // ... other shades
}
```

All components using `primary-500`, `primary-600`, etc. will automatically update.

## Theme Structure

### Colors

The theme includes these color palettes:

- **Primary** - Main brand color (buttons, links, accents)
- **Secondary** - Neutral colors (text, backgrounds)
- **Success** - Positive actions, success messages
- **Warning** - Warnings, attention needed
- **Error** - Errors, destructive actions
- **Info** - Informational messages

Each color has shades from 50 (lightest) to 900 (darkest).

### Using Theme Colors

#### In Tailwind Classes

```tsx
// Use theme colors directly in className
<div className="bg-primary-600 text-white">
  Primary button
</div>

<div className="text-secondary-700 bg-secondary-100">
  Secondary content
</div>
```

#### In Code (TypeScript)

```typescript
import { getThemeColor } from '@/lib/theme-utils';

const primaryColor = getThemeColor('primary', 500);
// Returns: "#0ea5e9"
```

## Color Palette Guidelines

### Primary Color
- Used for: Main CTAs, links, brand elements
- Recommended: A vibrant, memorable color that represents your brand
- Example shades: 500 for main, 600 for hover, 400 for light backgrounds

### Secondary Color
- Used for: Text, borders, neutral backgrounds
- Recommended: Gray scale that complements primary
- Example shades: 700-900 for text, 50-200 for backgrounds

### Semantic Colors
- **Success**: Green tones for positive feedback
- **Warning**: Yellow/amber for cautions
- **Error**: Red for errors and destructive actions
- **Info**: Blue for informational content

## Updating the Theme

### Step 1: Choose Your Colors

Decide on your brand colors. You'll need:
- Primary color (main brand color)
- Secondary/neutral colors
- Optional: Success, warning, error, info colors

### Step 2: Generate Color Shades

Use a tool like [Tailwind Color Generator](https://uicolors.app/create) or [Coolors](https://coolors.co/) to generate a full palette (50-900 shades) from your base color.

### Step 3: Update theme.ts

Replace the color values in `lib/theme.ts`:

```typescript
export const theme = {
  colors: {
    primary: {
      50: "#your-lightest-shade",
      100: "#...",
      // ... continue for all shades
      900: "#your-darkest-shade",
    },
    // ... update other colors
  },
};
```

### Step 4: Test

1. Save the file
2. Check your app - all colors should update automatically
3. Verify in both light and dark modes

## Best Practices

1. **Consistency**: Use the same color palette throughout
2. **Contrast**: Ensure text is readable on colored backgrounds
3. **Accessibility**: Test color combinations for WCAG compliance
4. **Dark Mode**: Consider how colors look in dark mode
5. **Semantic Colors**: Use success/error/warning appropriately

## Component Color Usage

### Buttons
- Primary actions: `bg-primary-600 hover:bg-primary-700`
- Secondary actions: `bg-secondary-600 hover:bg-secondary-700`
- Destructive: `bg-error-600 hover:bg-error-700`

### Text
- Headings: `text-secondary-900` (light) or `text-white` (dark)
- Body: `text-secondary-700` (light) or `text-secondary-300` (dark)
- Links: `text-primary-600 hover:text-primary-700`

### Backgrounds
- Page background: `bg-secondary-50` (light) or `bg-secondary-900` (dark)
- Cards: `bg-white` (light) or `bg-secondary-800` (dark)

## Utility Functions

Import from `lib/theme-utils.ts`:

```typescript
import { cn, getThemeColor, componentColors } from '@/lib/theme-utils';

// Merge Tailwind classes
const className = cn("base-class", condition && "conditional-class");

// Get color value
const color = getThemeColor('primary', 500);

// Use predefined component colors
<button className={componentColors.button.primary}>
  Click me
</button>
```

## Migration Notes

If you're updating from hardcoded colors:

1. Find all instances of hardcoded colors
2. Replace with theme color classes
3. Example: `bg-blue-600` → `bg-primary-600`

## Troubleshooting

### Colors not updating?
- Clear `.next` cache: `rm -rf .next`
- Restart dev server
- Check Tailwind config is importing theme correctly

### Need custom colors?
Add new color palettes to `theme.colors` and they'll be available throughout the app.

## Examples

### Complete Theme Change

To change from blue to purple:

```typescript
// lib/theme.ts
primary: {
  500: "#8b5cf6", // Purple instead of blue
  600: "#7c3aed",
  // ... update all shades
}
```

All `primary-*` classes automatically use the new purple color.



