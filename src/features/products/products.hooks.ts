import { useTranslation } from 'react-i18next';
import { useProductsStore } from './products.store';
import {
  getFilteredProducts,
  getAppStats,
} from './products.selectors';
import { Product, ProductUpdate, AppStats, FilterType } from './types';

export function useProducts(): Product[] {
  const { i18n } = useTranslation();
  const products = useProductsStore((s) => s.products);
  const filter = useProductsStore((s) => s.filter);
  const searchQuery = useProductsStore((s) => s.searchQuery);
  const selectedCategory = useProductsStore((s) => s.selectedCategory);

  return getFilteredProducts(products, filter, searchQuery, selectedCategory, i18n.language);
}

export function useProductById(id: string): Product | undefined {
  return useProductsStore((s) => s.products.find((p) => p.id === id));
}

export function useAppStats(): AppStats {
  const products = useProductsStore((s) => s.products);
  return getAppStats(products);
}

export function useProductActions(): {
  initializeProducts: () => void;
  updateProduct: (id: string, update: ProductUpdate) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Product['category'] | null) => void;
  resetAllProgress: () => void;
  importProducts: (products: Product[]) => void;
} {
  const initializeProducts = useProductsStore((s) => s.initializeProducts);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const addProduct = useProductsStore((s) => s.addProduct);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);
  const setFilter = useProductsStore((s) => s.setFilter);
  const setSearchQuery = useProductsStore((s) => s.setSearchQuery);
  const setSelectedCategory = useProductsStore((s) => s.setSelectedCategory);
  const resetAllProgress = useProductsStore((s) => s.resetAllProgress);
  const importProducts = useProductsStore((s) => s.importProducts);

  return {
    initializeProducts,
    updateProduct,
    addProduct,
    deleteProduct,
    setFilter,
    setSearchQuery,
    setSelectedCategory,
    resetAllProgress,
    importProducts,
  };
}
