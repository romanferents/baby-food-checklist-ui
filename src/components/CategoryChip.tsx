import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ProductCategory } from '../features/products/types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/categories';
import { spacing } from '../theme/spacing';

interface CategoryChipProps {
  category: ProductCategory;
  selected: boolean;
  onPress: (category: ProductCategory | null) => void;
}

export function CategoryChip({ category, selected, onPress }: CategoryChipProps): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();
  const color = CATEGORY_COLORS[category];
  const icon = CATEGORY_ICONS[category];

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color : theme.colors.surfaceVariant,
          borderColor: color,
        },
      ]}
      onPress={() => onPress(selected ? null : category)}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={16}
        color={selected ? '#fff' : color}
      />
      <Text
        variant="labelMedium"
        style={{ color: selected ? '#fff' : theme.colors.onSurfaceVariant, marginLeft: spacing.xs }}
      >
        {t(`categories.${category}`)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
});
