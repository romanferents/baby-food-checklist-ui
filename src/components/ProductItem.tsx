import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Product } from '../features/products/types';
import { CATEGORY_META } from '../utils/categories';
import { formatShortDate } from '../utils/date';
import { spacing } from '../theme/spacing';
import Svg, { Path } from 'react-native-svg';

interface ProductItemProps {
  product: Product;
  onPress: (product: Product) => void;
  onToggleTried: (product: Product) => void;
}

const RATING_EMOJI: Record<string, string> = {
  liked: '😍',
  neutral: '😐',
  disliked: '😣',
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
  const meta = CATEGORY_META[product.category];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: product.tried ? `${meta.bgColor}` : 'transparent',
        },
      ]}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      {/* Circular Checkbox */}
      <TouchableOpacity
        onPress={() => onToggleTried(product)}
        style={[
          styles.checkbox,
          {
            backgroundColor: product.tried ? meta.color : 'transparent',
            borderColor: product.tried ? meta.color : '#d1d5db',
          },
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {product.tried && (
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <Path
              d="M2.5 7L5.5 10L11.5 4"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </TouchableOpacity>

      {/* Name & info */}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.name, { color: product.tried ? '#374151' : '#1f2937' }]}
            numberOfLines={1}
          >
            {name}
          </Text>
          {product.reactionNotes ? <Text style={styles.warningBadge}>⚠️</Text> : null}
        </View>

        <View style={styles.meta}>
          {product.tried && product.firstTriedDate && (
            <Text style={styles.date}>📅 {formatShortDate(product.firstTriedDate, lang)}</Text>
          )}
          {product.tried && product.rating && (
            <Text style={styles.ratingEmoji}>{RATING_EMOJI[product.rating]}</Text>
          )}
          {product.isCustom && (
            <View style={styles.customBadge}>
              <Text style={styles.customBadgeText}>✨</Text>
            </View>
          )}
        </View>
      </View>

      {/* Favorite & chevron */}
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={() => {
            onPress({ ...product, favorite: !product.favorite });
          }}
          style={[styles.heartButton, product.favorite && styles.heartButtonActive]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons
            name={product.favorite ? 'heart' : 'heart-outline'}
            size={15}
            color={product.favorite ? '#e74c3c' : '#d1d5db'}
          />
        </TouchableOpacity>
        <MaterialCommunityIcons name="chevron-right" size={14} color="#d1d5db" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 2,
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    flexShrink: 1,
  },
  warningBadge: {
    fontSize: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    color: '#9ca3af',
  },
  ratingEmoji: {
    fontSize: 12,
  },
  customBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: '#e0e7ff',
  },
  customBadgeText: {
    fontSize: 10,
    color: '#4338ca',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartButton: {
    padding: 6,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartButtonActive: {
    backgroundColor: '#fde8e8',
  },
});
