# Global Card Styling Guide

This guide explains how to use the global card styling system for consistent transparent shadow cards across the app.

## Overview

The card styling system provides a unified look with:
- **Transparent backgrounds** with backdrop blur
- **Subtle shadows** for depth
- **Smooth transitions** for hover effects
- **Dark mode support** built-in

## Usage Methods

### Method 1: Tailwind Utility Classes (Recommended)

Use the global `.card` utility classes directly in your JSX:

```tsx
// Basic card
<div className="card p-6">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>

// Card with hover effect
<div className="card card-hover p-6">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>

// Transparent variant (more transparent)
<div className="card card-transparent p-6">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>

// Elevated variant (less transparent, more solid)
<div className="card card-elevated p-6">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>
```

### Method 2: Card Component

Use the reusable `Card` component:

```tsx
import Card from "@/components/ui/Card";

// Basic card
<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

// Card with hover effect
<Card hover>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

// Transparent variant
<Card variant="transparent">
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

// Elevated variant
<Card variant="elevated" hover>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

// With custom classes
<Card className="p-8" hover>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

## Available Variants

### Default Card (`.card`)
- Background: `rgba(255, 255, 255, 0.8)` (80% opacity)
- Backdrop blur: `8px`
- Shadow: Subtle multi-layer shadow
- Border: Subtle border with 5% opacity

### Transparent Card (`.card-transparent`)
- Background: `rgba(255, 255, 255, 0.6)` (60% opacity)
- Backdrop blur: `12px` (stronger blur)
- More transparent, lighter feel

### Elevated Card (`.card-elevated`)
- Background: `rgba(255, 255, 255, 0.9)` (90% opacity)
- Backdrop blur: `8px`
- Stronger shadow for more prominence
- Less transparent, more solid

## Hover Effects

Add `.card-hover` class for automatic hover effects:
- Increases shadow intensity
- Slightly increases background opacity
- Smooth transition animation

## Dark Mode

All card variants automatically adapt to dark mode:
- Light mode: White/beige transparent backgrounds
- Dark mode: Dark gray transparent backgrounds
- Borders and shadows adjust automatically

## Examples

### Dashboard Cards
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="card card-hover p-6">
    <h2 className="text-xl font-semibold mb-2">Feature 1</h2>
    <p>Description</p>
  </div>
</div>
```

### Landing Page Feature Cards
```tsx
<div className="card card-hover p-8 rounded-xl">
  <div className="text-5xl mb-4">📚</div>
  <h3 className="text-2xl font-semibold mb-3">Feature Title</h3>
  <p>Feature description</p>
</div>
```

### Form Cards
```tsx
<div className="card card-elevated p-8 max-w-md mx-auto">
  <h2 className="text-2xl font-bold mb-4">Login</h2>
  {/* Form content */}
</div>
```

## Migration Guide

To update existing cards:

**Before:**
```tsx
<div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow">
```

**After:**
```tsx
<div className="card p-6">
```

The new card classes automatically handle:
- Background colors (light/dark)
- Shadows
- Borders
- Transitions
- Backdrop blur

## Customization

To customize card styles globally, edit:
- `tailwind.config.js` - Card utility classes
- `lib/theme.ts` - Card theme configuration
- `components/ui/Card.tsx` - Card component variants

## Best Practices

1. **Use `.card` class** for most cases (default variant)
2. **Add `.card-hover`** for interactive cards
3. **Use `Card` component** when you need more control or props
4. **Keep padding consistent** - Use `p-6` or `p-8` for standard cards
5. **Use `rounded-xl`** for rounded corners (already included in `.card`)

## Theme Integration

Card styles are integrated with the global theme:
- Uses theme colors for borders
- Respects dark mode settings
- Matches overall design system

For theme changes, update `lib/theme.ts` and the card styles will automatically reflect the changes.

