# Skill: Add Translation

## Description
Adds a new translation key to both Ukrainian and English locale files.

## Usage
Ask: "Add translation key [key.path] with Ukrainian text '[uk text]' and English text '[en text]'"

## Files to Update
- `src/i18n/locales/uk.json`
- `src/i18n/locales/en.json`

## Steps
1. Open both JSON files
2. Navigate to the correct nesting level
3. Add the key with the appropriate translated value
4. Ensure the same key path exists in both files
5. Use the translation with `t('key.path')` in the component

## Example
```json
// uk.json
{
  "mySection": {
    "newKey": "Новий текст"
  }
}

// en.json
{
  "mySection": {
    "newKey": "New Text"
  }
}
```

## Usage in component
```typescript
const { t } = useTranslation();
// ...
<Text>{t('mySection.newKey')}</Text>
```
