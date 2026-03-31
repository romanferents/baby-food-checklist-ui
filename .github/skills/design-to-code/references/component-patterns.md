# Component Patterns Reference

Reusable patterns for building React Native components in this project.

## Screen Template

```tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/theme/spacing';

export default function FeatureScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
        {t('feature.title')}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
});
```

## Card Component Template

```tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { spacing } from '@/theme/spacing';

interface FeatureCardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

export function FeatureCard({ title, subtitle, onPress }: FeatureCardProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Surface
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      elevation={1}
    >
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {subtitle}
        </Text>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
});
```

## List Item Template

```tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { spacing } from '@/theme/spacing';

interface ListItemProps {
  title: string;
  description?: string;
  onPress: () => void;
  accessibilityLabel: string;
}

export function ListItem({
  title,
  description,
  onPress,
  accessibilityLabel,
}: ListItemProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={styles.touchable}
    >
      <View style={styles.row}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {title}
        </Text>
        {description && (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {description}
          </Text>
        )}
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  touchable: { minHeight: 44 },
  row: { padding: spacing.md },
});
```

## Chip / Filter Row Pattern

```tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import { spacing } from '@/theme/spacing';

interface FilterOption {
  key: string;
  label: string;
}

interface FilterRowProps {
  options: FilterOption[];
  selected: string | null;
  onSelect: (key: string) => void;
}

export function FilterRow({ options, selected, onSelect }: FilterRowProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((opt) => (
        <Chip
          key={opt.key}
          selected={selected === opt.key}
          onPress={() => onSelect(opt.key)}
          style={styles.chip}
          accessibilityRole="button"
        >
          {opt.label}
        </Chip>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.md, gap: spacing.sm },
  chip: { marginRight: spacing.xs },
});
```
