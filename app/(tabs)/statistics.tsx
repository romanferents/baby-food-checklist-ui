import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStats } from '../../src/features/products/products.hooks';
import { ProductItem } from '../../src/components/ProductItem';
import { CATEGORY_META, CATEGORY_ORDER } from '../../src/utils/categories';
import { useProductsStore } from '../../src/features/products/products.store';
import { useProductActions } from '../../src/features/products/products.hooks';
import { useRouter } from 'expo-router';
import { Product } from '../../src/features/products/types';

export default function StatisticsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const stats = useAppStats();
  const router = useRouter();
  const allProducts = useProductsStore((s) => s.products);
  const { updateProduct } = useProductActions();
  const progressPct =
    stats.totalProducts > 0 ? Math.round((stats.triedProducts / stats.totalProducts) * 100) : 0;

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleToggleTried = (product: Product) => {
    updateProduct(product.id, {
      tried: !product.tried,
      firstTriedDate: !product.tried ? new Date().toISOString() : undefined,
    });
  };

  // Most liked products
  const mostLiked = allProducts.filter((p) => p.rating === 'liked' && p.tried).slice(0, 5);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Gradient header */}
      <LinearGradient
        colors={['#7ED8C8', '#5ba3d0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>📊 {t('statistics.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('statistics.overallProgress')}</Text>

        {/* Main Stats Row in header */}
        <View style={styles.headerStatGrid}>
          {[
            { icon: '✅', value: stats.triedProducts, label: t('statistics.totalTried') },
            {
              icon: '⏳',
              value: stats.totalProducts - stats.triedProducts,
              label: t('statistics.remaining') || 'Remaining',
            },
            { icon: '😍', value: stats.liked, label: t('product.rating.likedText') },
            { icon: '❤️', value: stats.favorites, label: t('statistics.favorites') },
          ].map((item, i) => (
            <View key={i} style={styles.headerStatCard}>
              <Text style={styles.headerStatIcon}>{item.icon}</Text>
              <Text style={styles.headerStatValue}>{item.value}</Text>
              <Text style={styles.headerStatLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Overall progress card */}
      <View style={styles.progressCard}>
        <View style={styles.progressCardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="trending-up" size={16} color="#ff8c69" />
            <Text style={styles.sectionTitle}>{t('statistics.overallProgress')}</Text>
          </View>
          <LinearGradient
            colors={['#ff8c69', '#ffb347']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressPctBadge}
          >
            <Text style={styles.progressPctText}>{progressPct}%</Text>
          </LinearGradient>
        </View>
        <View style={styles.progressBarTrack}>
          <LinearGradient
            colors={['#ff8c69', '#ffb347']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progressPct}%` }]}
          />
        </View>
        <Text style={styles.progressSubtext}>
          {stats.triedProducts} / {stats.totalProducts}
        </Text>
      </View>

      {/* Allergic reactions warning */}
      {stats.disliked > 0 && (
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            {stats.disliked} {t('product.rating.dislikedText').toLowerCase()}
          </Text>
        </View>
      )}

      {/* Category breakdown */}
      <Text style={[styles.sectionTitleFull, { marginTop: 16 }]}>
        📋 {t('statistics.categoryBreakdown')}
      </Text>
      {stats.categoryStats
        .filter((cs) => cs.total > 0)
        .map((cs) => {
          const meta = CATEGORY_META[cs.category];
          const progress = cs.total > 0 ? Math.round((cs.tried / cs.total) * 100) : 0;
          return (
            <View key={cs.category} style={styles.categoryRow}>
              <View style={styles.categoryLabel}>
                <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
                <Text style={[styles.categoryName, { color: meta.color }]}>
                  {t(`categories.${cs.category}`)}
                </Text>
              </View>
              <View style={styles.categoryProgressContainer}>
                <View style={[styles.catBarTrack, { backgroundColor: meta.bgColor }]}>
                  <View
                    style={[
                      styles.catBarFill,
                      { width: `${progress}%`, backgroundColor: meta.color },
                    ]}
                  />
                </View>
                <Text style={styles.catCount}>
                  {cs.tried}/{cs.total}
                </Text>
              </View>
            </View>
          );
        })}

      {/* Most liked */}
      {mostLiked.length > 0 && (
        <>
          <Text style={[styles.sectionTitleFull, { marginTop: 16 }]}>
            😍 {t('statistics.favorites')}
          </Text>
          {mostLiked.map((p) => (
            <ProductItem
              key={p.id}
              product={p}
              onPress={handleProductPress}
              onToggleTried={handleToggleTried}
            />
          ))}
        </>
      )}

      {/* Recently tried */}
      {stats.recentlyTried.length > 0 && (
        <>
          <Text style={[styles.sectionTitleFull, { marginTop: 16 }]}>
            🕐 {t('statistics.recentlyTried')}
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
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  headerStatGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  headerStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerStatIcon: {
    fontSize: 20,
  },
  headerStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    lineHeight: 26,
  },
  headerStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 2,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressPctBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  progressPctText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  sectionTitleFull: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff3cd',
  },
  warningIcon: {
    fontSize: 16,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
  },
  categoryRow: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  categoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  catBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  catCount: {
    fontSize: 12,
    color: '#9ca3af',
    minWidth: 36,
    textAlign: 'right',
    fontWeight: '600',
  },
});
