import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ProductCategory } from '../features/products/types';
import { CATEGORY_META } from '../utils/categories';

interface CategoryChipProps {
  category: ProductCategory;
  selected: boolean;
  onPress: (category: ProductCategory | null) => void;
}

export function CategoryChip({
  category,
  selected,
  onPress,
}: CategoryChipProps): React.JSX.Element {
  const { t } = useTranslation();
  const meta = CATEGORY_META[category];

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: selected ? meta.color : meta.bgColor,
          borderColor: selected ? meta.color : meta.borderColor,
        },
      ]}
      onPress={() => onPress(selected ? null : category)}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{meta.emoji}</Text>
      <Text
        style={[
          styles.label,
          { color: selected ? '#fff' : meta.color },
        ]}
        numberOfLines={1}
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
