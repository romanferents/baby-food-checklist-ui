# Token Mapping Reference

Complete mapping between Figma design tokens and the Baby Food Checklist theme system.

## Colors

### Light Theme

| Figma Token / Usage | Project Token | Value |
|---------------------|--------------|-------|
| Primary / CTA fill | `theme.colors.primary` | `#ff8c69` |
| Primary container / Soft background | `theme.colors.primaryContainer` | `#fff0eb` |
| Secondary / Accent | `theme.colors.secondary` | `#ffb347` |
| Secondary container | `theme.colors.secondaryContainer` | `#fff3e0` |
| Tertiary / Success | `theme.colors.tertiary` | `#7ED8C8` |
| Page background | `theme.colors.background` | `#f8f9fa` |
| Card background | `theme.colors.surface` | `#FFFFFF` |
| Card variant background | `theme.colors.surfaceVariant` | `#f3f4f6` |
| Error / Danger | `theme.colors.error` | `#c0392b` |
| Text on primary | `theme.colors.onPrimary` | `#FFFFFF` |
| Heading text | `theme.colors.onBackground` | `#1f2937` |
| Body text | `theme.colors.onSurface` | `#374151` |
| Muted / Secondary text | `theme.colors.onSurfaceVariant` | `#6b7280` |
| Divider / Border | `theme.colors.outline` | `#d1d5db` |
| Subtle border | `theme.colors.outlineVariant` | `#e5e7eb` |

### Dark Theme

All colors automatically adapt when using `useTheme()`. The dark palette is defined in `src/theme/colors.ts` → `darkColors`.

## Spacing

| Figma Spacing | Project Token | Value |
|---------------|--------------|-------|
| 4px | `spacing.xs` | 4 |
| 8px | `spacing.sm` | 8 |
| 16px | `spacing.md` | 16 |
| 24px | `spacing.lg` | 24 |
| 32px | `spacing.xl` | 32 |
| 48px | `spacing.xxl` | 48 |

## Typography (React Native Paper variants)

| Figma Style | Paper Variant | Typical Usage |
|-------------|--------------|---------------|
| Display / Hero | `displaySmall` | Splash, onboarding |
| Page title | `headlineMedium` | Screen titles |
| Section title | `titleLarge` | Section headers |
| Card title | `titleMedium` | Card headings |
| Subtitle | `titleSmall` | Subsections |
| Body | `bodyLarge` | Primary content |
| Body secondary | `bodyMedium` | Secondary text |
| Caption | `bodySmall` | Metadata, timestamps |
| Label | `labelLarge` | Button text |
| Small label | `labelSmall` | Chips, badges |

## Category Colors

Products use category-specific colors:

| Category | Badge Color Approach |
|----------|---------------------|
| vegetables | `theme.colors.tertiary` (green) |
| fruits | `theme.colors.secondary` (orange) |
| dairy | `theme.colors.primary` (coral) |
| meat | `theme.colors.error` (red) |
| grains | `theme.colors.secondaryContainer` (cream) |
| fish | `theme.colors.primaryContainer` (soft coral) |
| nutsSeeds | `theme.colors.tertiaryContainer` (soft green) |
