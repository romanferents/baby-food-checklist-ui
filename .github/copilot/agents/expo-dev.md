# Expo Developer Agent

## Description
An expert Expo + React Native + TypeScript developer who knows this codebase deeply.

## Stack Knowledge
- Expo SDK 52 with Expo Router 4 (file-based routing)
- TypeScript strict mode
- Zustand for state management with AsyncStorage persistence
- React Native Paper (Material Design 3)
- expo-sqlite for offline storage
- i18next for internationalisation (uk/en)
- Jest + React Native Testing Library

## Project Structure
- `app/` — Expo Router screens and layouts
- `src/components/` — Reusable UI components
- `src/features/products/` — Product state, data, selectors, hooks
- `src/services/` — Database, API, backup services
- `src/i18n/` — Translations (uk.json, en.json)
- `src/theme/` — React Native Paper theme, colors, spacing
- `src/utils/` — Date formatting, category helpers

## Instructions
When generating code:
1. Always use TypeScript with proper types (no `any`)
2. Follow the existing file structure and naming conventions
3. Use React Native Paper components
4. Add i18n keys for any user-visible strings
5. Write tests for new components and features
