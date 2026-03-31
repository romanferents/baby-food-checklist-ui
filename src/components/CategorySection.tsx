import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProductCategory } from '../features/products/types';
import { CATEGORY_META } from '../utils/categories';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const { t } = useTranslation();
  const meta = CATEGORY_META[category];
  const [isOpen, setIsOpen] = useState(true);
  const progress = total > 0 ? tried / total : 0;
  const pct = Math.round(progress * 100);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: meta.bgColor, borderColor: meta.borderColor }]}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.emoji}>{meta.emoji}</Text>
          <View>
            <Text style={[styles.title, { color: meta.color }]}>{t(`categories.${category}`)}</Text>
            <Text style={styles.subtitle}>
              {tried}/{total} ({pct}%)
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {/* Mini progress bar */}
          <View style={[styles.miniBarTrack, { backgroundColor: meta.borderColor }]}>
            <View style={[styles.miniBarFill, { width: `${pct}%`, backgroundColor: meta.color }]} />
          </View>
          <MaterialCommunityIcons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={meta.color}
          />
        </View>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniBarTrack: {
    width: 50,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    paddingTop: 4,
    paddingHorizontal: 4,
  },
});
