import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ProductRating } from '../features/products/types';

interface RatingSelectorProps {
  value?: ProductRating;
  onChange: (rating: ProductRating | undefined) => void;
}

const RATINGS: {
  value: ProductRating;
  emoji: string;
  labelKey: string;
  color: string;
  bg: string;
}[] = [
  {
    value: 'liked',
    emoji: '😍',
    labelKey: 'product.rating.likedText',
    color: '#16a34a',
    bg: '#dcfce7',
  },
  {
    value: 'neutral',
    emoji: '😐',
    labelKey: 'product.rating.neutralText',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    value: 'disliked',
    emoji: '😣',
    labelKey: 'product.rating.dislikedText',
    color: '#dc2626',
    bg: '#fee2e2',
  },
];

export function RatingSelector({ value, onChange }: RatingSelectorProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {RATINGS.map((r) => {
        const selected = value === r.value;
        return (
          <TouchableOpacity
            key={r.value}
            style={[
              styles.pill,
              {
                backgroundColor: selected ? r.bg : '#f3f4f6',
                borderColor: selected ? r.color : '#e5e7eb',
              },
            ]}
            onPress={() => onChange(selected ? undefined : r.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{r.emoji}</Text>
            <Text style={[styles.label, { color: selected ? r.color : '#6b7280' }]}>
              {t(r.labelKey as Parameters<typeof t>[0])}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
