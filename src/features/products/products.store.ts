import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductUpdate, FilterType } from './types';
import { INITIAL_PRODUCTS } from './products.data';

interface BabyInfo {
  name: string;
  birthDate: string;
  complementaryStart: string;
  weight: string;
}

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  filter: FilterType;
  searchQuery: string;
  selectedCategory: Product['category'] | null;
  babyInfo: BabyInfo;
}

interface ProductsActions {
  initializeProducts: () => void;
  updateProduct: (id: string, update: ProductUpdate) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Product['category'] | null) => void;
  resetAllProgress: () => void;
  importProducts: (products: Product[]) => void;
  setBabyInfo: (info: Partial<BabyInfo>) => void;
}

export type ProductsStore = ProductsState & ProductsActions;

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      filter: 'all',
      searchQuery: '',
      selectedCategory: null,
      babyInfo: { name: '', birthDate: '', complementaryStart: '', weight: '' },

      initializeProducts: () => {
        const { products } = get();
        if (products.length === 0) {
          set({ products: INITIAL_PRODUCTS });
        } else {
          // Merge any new products from INITIAL_PRODUCTS that aren't in state
          const existingIds = new Set(products.map((p) => p.id));
          const newProducts = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
          if (newProducts.length > 0) {
            set({ products: [...products, ...newProducts] });
          }
        }
      },

      updateProduct: (id, update) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...update, updatedAt: new Date().toISOString() } : p,
          ),
        }));
      },

      addProduct: (product) => {
        set((state) => ({ products: [...state.products, product] }));
      },

      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },

      setFilter: (filter) => set({ filter }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

      resetAllProgress: () => {
        set((state) => ({
          products: state.products.map((p) =>
            p.isCustom
              ? p
              : {
                  ...p,
                  tried: false,
                  firstTriedDate: undefined,
                  rating: undefined,
                  favorite: false,
                  reactionNotes: undefined,
                  notes: undefined,
                  updatedAt: new Date().toISOString(),
                },
          ),
        }));
      },

      importProducts: (products) => {
        set({ products });
      },

      setBabyInfo: (info) => {
        set((state) => ({
          babyInfo: { ...state.babyInfo, ...info },
        }));
      },
    }),
    {
      name: 'products-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ products: state.products, babyInfo: state.babyInfo }),
    },
  ),
);
