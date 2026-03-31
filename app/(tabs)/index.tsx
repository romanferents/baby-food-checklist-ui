import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts, useProductActions } from '../../src/features/products/products.hooks';
import { useProductsStore } from '../../src/features/products/products.store';
import { ProductItem } from '../../src/components/ProductItem';
import { ProgressHeader } from '../../src/components/ProgressHeader';
import { CategoryChip } from '../../src/components/CategoryChip';
import { CategorySection } from '../../src/components/CategorySection';
import { EmptyState } from '../../src/components/EmptyState';
import { useDebounce } from '../../src/hooks/useDebounce';
import { getProductsByCategory, getAppStats } from '../../src/features/products/products.selectors';
import { CATEGORY_ORDER } from '../../src/utils/categories';
import { Product } from '../../src/features/products/types';
import { FilterType } from '../../src/features/products/types';
import { DEBOUNCE_DELAY_MS } from '../../src/constants';

const FILTER_KEYS: FilterType[] = ['all', 'tried', 'notTried', 'favorites'];

const FILTER_EMOJIS: Record<FilterType, string> = {
  all: '📋',
  tried: '✅',
  notTried: '🆕',
  favorites: '❤️',
};

export default function ProductsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const rawSearchQuery = useProductsStore((s) => s.searchQuery);
  const filter = useProductsStore((s) => s.filter);
  const selectedCategory = useProductsStore((s) => s.selectedCategory);
  const allProducts = useProductsStore((s) => s.products);

  const { setSearchQuery, setFilter, setSelectedCategory, updateProduct } = useProductActions();
  const debouncedSearch = useDebounce(rawSearchQuery, DEBOUNCE_DELAY_MS);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const stats = getAppStats(allProducts);
  const filteredProducts = useProducts();
  const productsByCategory = getProductsByCategory(filteredProducts);

  const handleToggleTried = useCallback(
    (product: Product) => {
      if (!product.tried) {
        updateProduct(product.id, {
          tried: true,
          firstTriedDate: new Date().toISOString(),
        });
      } else {
        updateProduct(product.id, {
          tried: false,
          firstTriedDate: undefined,
          rating: undefined,
        });
      }
    },
    [updateProduct],
  );

  const handleProductPress = useCallback(
    (product: Product) => {
      if (product.favorite !== undefined && product.id) {
        // Check if this was a favorite toggle from ProductItem
        const existingProduct = allProducts.find((p) => p.id === product.id);
        if (existingProduct && existingProduct.favorite !== product.favorite) {
          updateProduct(product.id, { favorite: product.favorite });
          return;
        }
      }
      router.push(`/product/${product.id}`);
    },
    [router, allProducts, updateProduct],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ProgressHeader tried={stats.triedProducts} total={stats.totalProducts} />

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9ca3af" />
          <TextInput
            placeholder={t('products.search')}
            placeholderTextColor="#9ca3af"
            onChangeText={setSearchQuery}
            value={rawSearchQuery}
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
          />
          {rawSearchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTER_KEYS.map((f) => {
          const isActive = filter === f;
          return isActive ? (
            <LinearGradient
              key={f}
              colors={['#ff8c69', '#ffb347']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.filterPill}
            >
              <TouchableOpacity onPress={() => setFilter(f)} style={styles.filterPillInner}>
                <Text style={styles.filterEmoji}>{FILTER_EMOJIS[f]}</Text>
                <Text style={styles.filterLabelActive}>{t(`products.filters.${f}`)}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterPill, styles.filterPillInactive, { borderColor: '#e5e7eb' }]}
            >
              <Text style={styles.filterEmoji}>{FILTER_EMOJIS[f]}</Text>
              <Text style={[styles.filterLabel, { color: '#6b7280' }]}>
                {t(`products.filters.${f}`)}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Category filter toggle */}
        <TouchableOpacity
          onPress={() => setShowCategoryFilter(!showCategoryFilter)}
          style={[
            styles.filterPill,
            styles.filterPillInactive,
            {
              borderColor: selectedCategory ? '#4338ca' : '#e5e7eb',
              backgroundColor: selectedCategory ? '#e0e7ff' : 'transparent',
            },
          ]}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={14}
            color={selectedCategory ? '#4338ca' : '#6b7280'}
          />
          <Text
            style={[
              styles.filterLabel,
              {
                color: selectedCategory ? '#4338ca' : '#6b7280',
                fontWeight: selectedCategory ? '700' : '500',
              },
            ]}
          >
            {t('settings.allCategories')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Category chips - toggled by filter button */}
      {showCategoryFilter && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsRow}
          contentContainerStyle={styles.chipsContent}
        >
          {CATEGORY_ORDER.map((cat) => (
            <CategoryChip
              key={cat}
              category={cat}
              selected={selectedCategory === cat}
              onPress={(c) => {
                setSelectedCategory(c);
                if (c === null) setShowCategoryFilter(false);
              }}
            />
          ))}
        </ScrollView>
      )}

      {/* Product list */}
      <FlatList
        data={CATEGORY_ORDER.filter((cat) => (productsByCategory[cat]?.length ?? 0) > 0)}
        keyExtractor={(cat) => cat}
        style={styles.list}
        renderItem={({ item: category }) => {
          const products = productsByCategory[category] ?? [];
          const catAllProducts = allProducts.filter((p) => p.category === category);
          const triedCount = catAllProducts.filter((p) => p.tried).length;

          return (
            <CategorySection category={category} tried={triedCount} total={catAllProducts.length}>
              {products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onPress={handleProductPress}
                  onToggleTried={handleToggleTried}
                />
              ))}
            </CategorySection>
          );
        }}
        ListEmptyComponent={<EmptyState icon="food-off" title={t('products.noProducts')} />}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={() => router.push('/add-product')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#ff8c69', '#ffb347']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  filtersRow: {
    flexGrow: 0,
    marginBottom: 4,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterPillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  filterPillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    gap: 6,
  },
  filterEmoji: {
    fontSize: 14,
  },
  filterLabelActive: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipsRow: {
    flexGrow: 0,
    marginBottom: 8,
  },
  chipsContent: {
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    shadowColor: '#ff8c69',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
