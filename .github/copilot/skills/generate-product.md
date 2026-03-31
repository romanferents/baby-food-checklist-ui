# Skill: Generate Product

## Description
Generates a new product entry for `src/features/products/products.data.ts`.

## Usage
Ask: "Add [Product Ukrainian Name] / [Product English Name] to [category]"

## Template
```typescript
makeProduct('p###', '[Ukrainian Name]', '[English Name]', '[category]'),
```

## Categories
- `vegetables` — Овочі та зелень
- `fruits` — Фрукти
- `dairy` — Молочні продукти
- `meat` — М'ясо та тваринні продукти
- `grains` — Крупи та бобові
- `nutsSeeds` — Горіхи та насіння
- `fish` — Риба та морепродукти

## Steps
1. Find the last product ID in products.data.ts
2. Increment the ID number (e.g., p126 → p127)
3. Add the new `makeProduct(...)` call in the correct category section
4. Add translations to `src/i18n/locales/uk.json` and `en.json` if needed
