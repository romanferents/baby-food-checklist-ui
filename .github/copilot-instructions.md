# Baby Food Checklist — Project Guidelines

## Stack

- **Framework**: Expo SDK 52 + Expo Router 4 (file-based routing, typed routes)
- **Language**: TypeScript (strict mode, no `any`)
- **UI**: React Native Paper (Material Design 3), light/dark theme via `src/theme/`
- **State**: Zustand with AsyncStorage persistence (`src/features/products/`)
- **Database**: expo-sqlite for offline-first storage
- **i18n**: i18next with Ukrainian (`uk`) as primary, English (`en`) as secondary
- **Testing**: Jest + React Native Testing Library

## Architecture

```
app/              → Expo Router screens and layouts (file = route)
src/components/   → Reusable UI components (pure, stateless where possible)
src/features/     → Domain logic: store, selectors, hooks, types, data
src/services/     → Side effects: database, API, backup/export
src/theme/        → MD3 theme tokens, color palettes, spacing scale
src/i18n/         → Translation files and i18n config
src/utils/        → Pure utility functions
```

## Conventions

- Components use React Native Paper (`Surface`, `Text`, `Chip`, `IconButton`, etc.)
- All user-visible strings go through `t()` from react-i18next — never hardcoded
- Colors always come from `useTheme().colors` — never hardcoded hex values
- Spacing uses the scale from `src/theme/spacing.ts`
- Path alias `@/*` maps to `./src/*`
- Product IDs follow the pattern `p001`–`p999`
- Categories are typed as `ProductCategory` from `src/features/products/types.ts`

## Build & Test

```bash
npm start          # Start Expo dev server
npm test           # Run Jest tests (no watch)
npm run typecheck  # TypeScript type checking
npm run lint       # ESLint with auto-fix
```

## MCP Servers Available

- **figma** — Read designs from Figma, extract design tokens, screenshots
- **chrome-devtools** — Interact with running app in Chrome for visual QA, screenshots, performance
- **github** — Create issues, PRs, manage repository
