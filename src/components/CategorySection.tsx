import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ProductCategory } from '../features/products/types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/categories';
import { spacing } from '../theme/spacing';

interface CategorySectionProps {
  category: ProductCategory;
  tried: number;
  total: number;
  children?: React.ReactNode;
}

export function CategorySection({
  category,
  tried,
  total,
  children,
}: CategorySectionProps): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();
  const color = CATEGORY_COLORS[category];
  const icon = CATEGORY_ICONS[category];
  const progress = total > 0 ? tried / total : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={20}
            color={color}
          />
          <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
            {t(`categories.${category}`)}
          </Text>
        </View>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {tried}/{total}
        </Text>
      </View>
      <ProgressBar
        progress={progress}
        color={color}
        style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontWeight: '600',
  },
  progressBar: {
    height: 3,
    borderRadius: 0,
  },
});
