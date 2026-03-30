import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ProductRating } from '../features/products/types';
import { spacing } from '../theme/spacing';

interface RatingSelectorProps {
  value?: ProductRating;
  onChange: (rating: ProductRating | undefined) => void;
}

const RATINGS: { value: ProductRating; emoji: string; labelKey: string }[] = [
  { value: 'liked', emoji: '😍', labelKey: 'product.rating.liked' },
  { value: 'neutral', emoji: '😐', labelKey: 'product.rating.neutral' },
  { value: 'disliked', emoji: '😞', labelKey: 'product.rating.disliked' },
];

export function RatingSelector({ value, onChange }: RatingSelectorProps): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {RATINGS.map((r) => {
        const selected = value === r.value;
        return (
          <Button
            key={r.value}
            mode={selected ? 'contained' : 'outlined'}
            onPress={() => onChange(selected ? undefined : r.value)}
            style={[styles.button, selected && { backgroundColor: theme.colors.primary }]}
            labelStyle={{ fontSize: 12 }}
            compact
          >
            {r.emoji} {t(r.labelKey as Parameters<typeof t>[0]).split(' ')[1] ?? ''}
          </Button>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    minWidth: 90,
  },
});
