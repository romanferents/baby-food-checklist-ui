---
description: "Use when adding or editing translation keys in locale JSON files. Covers key naming, completeness, and interpolation patterns."
applyTo: "src/i18n/locales/*.json"
---

# i18n Translation Rules

## Structure

- Ukrainian (`uk.json`) is the **primary** language — add keys there first
- English (`en.json`) is secondary — mirror every key from `uk.json`
- Both files must have **identical key structure** at all times

## Key Naming

- Use camelCase dot notation: `"products.categories.vegetables"`
- Group by feature: `products.*`, `settings.*`, `statistics.*`, `common.*`
- Action keys: `"common.save"`, `"common.cancel"`, `"common.delete"`
- Screen titles: `"screens.home"`, `"screens.settings"`

## Interpolation

```json
{
  "products": {
    "triedCount": "Спробовано {{count}} з {{total}}"
  }
}
```

Usage: `t('products.triedCount', { count: 5, total: 100 })`

## Plurals

```json
{
  "products": {
    "item_one": "{{count}} продукт",
    "item_few": "{{count}} продукти",
    "item_many": "{{count}} продуктів"
  }
}
```

## Checklist

- [ ] Key exists in both `uk.json` and `en.json`
- [ ] No hardcoded strings left in component
- [ ] Interpolation variables match between languages
