---
description: "Use when creating or editing React Native components in .tsx files. Covers MD3 theming, i18n, accessibility, and Paper component patterns."
applyTo: "src/components/**/*.tsx"
---

# React Native Component Standards

## Theme

- Access colors via `const theme = useTheme()` — never hardcode hex values
- Use `theme.colors.primary`, `theme.colors.onSurface`, etc.
- Reference spacing from `import { spacing } from '@/theme/spacing'`

## Internationalization

- Wrap every user-visible string with `t()` from `useTranslation()`
- Translation keys use dot notation: `t('section.subsection.key')`

## Accessibility

- Every `TouchableRipple` / `IconButton` must have `accessibilityLabel`
- Use `accessibilityRole` on interactive elements
- Minimum touch target: 44x44 logical pixels

## Component Pattern

```tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/theme/spacing';

interface Props {
  // explicit typed props — no `any`
}

export function MyComponent({ }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  // ...
}
```
