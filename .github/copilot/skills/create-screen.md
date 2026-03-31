# Skill: Create Screen

## Description
Creates a new Expo Router screen with proper structure and types.

## Usage
Ask: "Create a new screen at [path] that shows [description]"

## Template
```typescript
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { spacing } from '../src/theme/spacing';

export default function [ScreenName]Screen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
        {t('[translation.key]')}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
});
```

## Steps
1. Create the file in the correct `app/` subdirectory
2. Add navigation entry in `app/(tabs)/_layout.tsx` if it's a tab
3. Add translation keys to both `uk.json` and `en.json`
4. Add a test in `__tests__/`
