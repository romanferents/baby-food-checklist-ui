import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Searchbar, FAB, Chip, useTheme, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
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
import { spacing } from '../../src/theme/spacing';
import { FilterType } from '../../src/features/products/types';

const FILTER_KEYS: FilterType[] = ['all', 'tried', 'notTried', 'favorites'];

export default function ProductsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const rawSearchQuery = useProductsStore((s) => s.searchQuery);
  const filter = useProductsStore((s) => s.filter);
  const selectedCategory = useProductsStore((s) => s.selectedCategory);
  const allProducts = useProductsStore((s) => s.products);

  const { setSearchQuery, setFilter, setSelectedCategory, updateProduct } = useProductActions();
  const debouncedSearch = useDebounce(rawSearchQuery, 300);

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
      router.push(`/product/${product.id}`);
    },
    [router],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ProgressHeader tried={stats.triedProducts} total={stats.totalProducts} />

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={t('products.search')}
          onChangeText={setSearchQuery}
          value={rawSearchQuery}
          style={{ backgroundColor: theme.colors.surfaceVariant }}
          inputStyle={{ color: theme.colors.onSurface }}
        />
      </View>

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
            onPress={setSelectedCategory}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTER_KEYS.map((f) => (
          <Chip
            key={f}
            selected={filter === f}
            onPress={() => setFilter(f)}
            style={styles.filterChip}
            mode={filter === f ? 'flat' : 'outlined'}
          >
            {t(`products.filters.${f}`)}
          </Chip>
        ))}
      </ScrollView>

      <FlatList
        data={CATEGORY_ORDER.filter((cat) => (productsByCategory[cat]?.length ?? 0) > 0)}
        keyExtractor={(cat) => cat}
        style={styles.list}
        renderItem={({ item: category }) => {
          const products = productsByCategory[category] ?? [];
          const catAllProducts = allProducts.filter((p) => p.category === category);
          const triedCount = catAllProducts.filter((p) => p.tried).length;

          return (
            <CategorySection
              category={category}
              tried={triedCount}
              total={catAllProducts.length}
            >
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
        ListEmptyComponent={
          <EmptyState
            icon="food-off"
            title={t('products.noProducts')}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => router.push('/add-product')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexGrow: 0,
    marginBottom: spacing.xs,
  },
  chipsContent: {
    paddingHorizontal: spacing.md,
  },
  filtersRow: {
    flexGrow: 0,
    marginBottom: spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  filterChip: {
    marginRight: spacing.xs,
  },
  list: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.lg,
  },
});
