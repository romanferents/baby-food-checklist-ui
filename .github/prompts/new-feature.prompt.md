---
description: "Scaffold a complete new feature: component, store slice, translations, screen, and test. Use when adding new functionality end-to-end."
agent: "agent"
tools: ["read", "edit", "search", "execute"]
---

# Scaffold New Feature

Generate all the files needed for a new feature in this Expo project.

## Input

Feature name: {{input}}

## Files to Generate

### 1. Types — `src/features/{{feature}}/types.ts`
Define TypeScript interfaces and types for the feature domain.

### 2. Store — `src/features/{{feature}}/{{feature}}.store.ts`
Zustand store with AsyncStorage persistence, following `products.store.ts` patterns.

### 3. Selectors — `src/features/{{feature}}/{{feature}}.selectors.ts`
Derived state selectors as pure functions.

### 4. Hooks — `src/features/{{feature}}/{{feature}}.hooks.ts`
Custom hooks wrapping store access and actions.

### 5. Component — `src/components/{{Feature}}Card.tsx`
React Native Paper component with MD3 theming.

### 6. Screen — `app/{{feature}}.tsx`
Expo Router screen using the component.

### 7. Translations
Add keys to both `src/i18n/locales/uk.json` and `en.json`.

### 8. Test — `__tests__/features/{{feature}}.store.test.ts`
Jest tests for the store and selectors.

## Conventions

- Follow existing patterns in `src/features/products/`
- Use `@/*` path alias
- No `any` types
- All strings through `t()`
