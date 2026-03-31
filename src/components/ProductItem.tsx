import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Checkbox, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Product } from '../features/products/types';
import { CATEGORY_COLORS } from '../utils/categories';
import { formatShortDate } from '../utils/date';
import { spacing } from '../theme/spacing';

interface ProductItemProps {
  product: Product;
  onPress: (product: Product) => void;
  onToggleTried: (product: Product) => void;
}

const RATING_EMOJI: Record<string, string> = {
  liked: '😍',
  neutral: '😐',
  disliked: '😞',
};

export function ProductItem({
  product,
  onPress,
  onToggleTried,
}: ProductItemProps): React.JSX.Element {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const name = lang === 'uk' ? product.nameUk : product.nameEn;
  const categoryColor = CATEGORY_COLORS[product.category];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <Checkbox
        status={product.tried ? 'checked' : 'unchecked'}
        onPress={() => onToggleTried(product)}
        color={theme.colors.primary}
      />

      <View style={styles.content}>
        <Text
          variant="bodyLarge"
          style={[styles.name, product.tried && { color: theme.colors.onSurfaceVariant }]}
          numberOfLines={1}
        >
          {name}
        </Text>

        <View style={styles.meta}>
          <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
          {product.tried && product.firstTriedDate && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {formatShortDate(product.firstTriedDate, lang)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.icons}>
        {product.rating && <Text style={styles.emoji}>{RATING_EMOJI[product.rating]}</Text>}
        {product.favorite && (
          <MaterialCommunityIcons name="heart" size={18} color={theme.colors.primary} />
        )}
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={theme.colors.onSurfaceVariant}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
    marginHorizontal: spacing.sm,
    marginVertical: 2,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  name: {
    fontWeight: '500',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emoji: {
    fontSize: 16,
  },
});
