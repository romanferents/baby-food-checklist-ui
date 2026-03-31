import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, ProgressBar, useTheme, Surface } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAppStats } from '../../src/features/products/products.hooks';
import { StatCard } from '../../src/components/StatCard';
import { ProductItem } from '../../src/components/ProductItem';
import { CATEGORY_COLORS, CATEGORY_ORDER } from '../../src/utils/categories';
import { spacing } from '../../src/theme/spacing';
import { useProductsStore } from '../../src/features/products/products.store';
import { useProductActions } from '../../src/features/products/products.hooks';
import { useRouter } from 'expo-router';
import { Product } from '../../src/features/products/types';

export default function StatisticsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const stats = useAppStats();
  const router = useRouter();
  const { updateProduct } = useProductActions();
  const progressPct = stats.totalProducts > 0 ? stats.triedProducts / stats.totalProducts : 0;

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleToggleTried = (product: Product) => {
    updateProduct(product.id, {
      tried: !product.tried,
      firstTriedDate: !product.tried ? new Date().toISOString() : undefined,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineMedium" style={[styles.heading, { color: theme.colors.onBackground }]}>
        {t('statistics.title')}
      </Text>

      {/* Overall progress */}
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}
        elevation={0}
      >
        <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>
          {t('statistics.overallProgress')}
        </Text>
        <View style={styles.progressRow}>
          <ProgressBar
            progress={progressPct}
            color={theme.colors.primary}
            style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}
          />
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.primary, fontWeight: 'bold', marginLeft: spacing.sm }}
          >
            {Math.round(progressPct * 100)}%
          </Text>
        </View>
        <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
          {stats.triedProducts} / {stats.totalProducts}
        </Text>
      </Surface>

      {/* Stat cards */}
      <View style={styles.statGrid}>
        <StatCard
          label={t('statistics.totalTried')}
          value={stats.triedProducts}
          icon="check-circle"
        />
        <StatCard
          label={t('statistics.favorites')}
          value={stats.favorites}
          icon="heart"
          color="#E91E8C"
        />
        <StatCard
          label={t('statistics.customProducts')}
          value={stats.customProducts}
          icon="plus-circle"
          color="#9C27B0"
        />
      </View>

      {/* Rating breakdown */}
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
      >
        {t('statistics.ratingBreakdown')}
      </Text>
      <View style={styles.statGrid}>
        <StatCard
          label={t('product.rating.liked')}
          value={stats.liked}
          icon="emoticon-happy"
          color="#4CAF50"
        />
        <StatCard
          label={t('product.rating.neutral')}
          value={stats.neutral}
          icon="emoticon-neutral"
          color="#FF9800"
        />
        <StatCard
          label={t('product.rating.disliked')}
          value={stats.disliked}
          icon="emoticon-sad"
          color="#F44336"
        />
      </View>

      {/* Category breakdown */}
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
      >
        {t('statistics.categoryBreakdown')}
      </Text>
      {stats.categoryStats
        .filter((cs) => cs.total > 0)
        .map((cs) => {
          const progress = cs.total > 0 ? cs.tried / cs.total : 0;
          const color = CATEGORY_COLORS[cs.category];
          return (
            <View key={cs.category} style={styles.categoryRow}>
              <Text
                variant="bodyMedium"
                style={[styles.categoryLabel, { color: theme.colors.onSurface }]}
              >
                {t(`categories.${cs.category}`)}
              </Text>
              <View style={styles.categoryProgress}>
                <ProgressBar
                  progress={progress}
                  color={color}
                  style={[styles.catProgressBar, { backgroundColor: theme.colors.surfaceVariant }]}
                />
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant, minWidth: 36, textAlign: 'right' }}
                >
                  {cs.tried}/{cs.total}
                </Text>
              </View>
            </View>
          );
        })}

      {/* Recently tried */}
      {stats.recentlyTried.length > 0 && (
        <>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
          >
            {t('statistics.recentlyTried')}
          </Text>
          {stats.recentlyTried.map((p) => (
            <ProductItem
              key={p.id}
              product={p}
              onPress={handleProductPress}
              onToggleTried={handleToggleTried}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
  },
  statGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  categoryRow: {
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    marginBottom: spacing.xs,
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  catProgressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
});
