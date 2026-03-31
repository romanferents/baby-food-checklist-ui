---
description: "Use when editing Zustand stores, selectors, or hooks in the features directory. Covers persistence, immutability, and selector patterns."
applyTo: "src/features/**/*.ts"
---

# Zustand Store Conventions

## Store Shape

- Keep flat, normalized state — avoid deep nesting
- Use `immer` middleware only if mutating complex nested updates
- Persist with `AsyncStorage` via `persist` middleware

## Selectors

- Define selectors in a separate `*.selectors.ts` file
- Selectors must be pure functions: `(state: StoreState) => DerivedValue`
- Use shallow comparison for array/object selectors to prevent re-renders

## Actions

- Expose actions via a `useProductActions()` hook, not raw `set()`
- Group related mutations: `markAsTried()`, `updateRating()`, `resetProduct()`
- Never call `set()` directly in components

## Persistence Keys

- Use constants from `src/constants/index.ts` → `STORAGE_KEYS.PRODUCTS`
- Never hardcode storage key strings

## Example

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProductStore = create(
  persist(
    (set, get) => ({
      // state + actions
    }),
    {
      name: STORAGE_KEYS.PRODUCTS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```
