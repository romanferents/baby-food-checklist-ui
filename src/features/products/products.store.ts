import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductUpdate, FilterType, ProductCategory, ProductRating } from './types';
import {
  fetchProductsFromApi,
  fetchEntriesFromApi,
  upsertEntryOnApi,
  createProductOnApi,
  deleteProductOnApi,
  deleteEntryOnApi,
  ApiProductDto,
  ApiEntryDto,
} from '../../services/api';
import { STORAGE_KEYS } from '../../constants';

// ── Category mapping: backend enum name → UI key ─────────
const CATEGORY_MAP: Record<string, ProductCategory> = {
  Vegetables: 'vegetables',
  Fruits: 'fruits',
  Dairy: 'dairy',
  Meat: 'meat',
  Grains: 'grains',
  NutsSeeds: 'nutsSeeds',
  Fish: 'fish',
  Spices: 'spices',
  Other: 'spices', // fallback
};

const CATEGORY_REVERSE: Record<string, string> = {
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  dairy: 'Dairy',
  meat: 'Meat',
  grains: 'Grains',
  nutsSeeds: 'NutsSeeds',
  fish: 'Fish',
  spices: 'Spices',
};

function mapRating(r: string | null | undefined): ProductRating | undefined {
  if (!r) return undefined;
  const lower = r.toLowerCase();
  if (lower === 'liked' || lower === '1') return 'liked';
  if (lower === 'neutral' || lower === '2') return 'neutral';
  if (lower === 'disliked' || lower === '3') return 'disliked';
  return undefined;
}

function ratingToApi(r: ProductRating | undefined): string | null {
  if (!r) return null;
  if (r === 'liked') return 'Liked';
  if (r === 'neutral') return 'Neutral';
  if (r === 'disliked') return 'Disliked';
  return null;
}

/** Merge server products + entries into the flat Product shape the UI expects */
function mergeProductsAndEntries(
  apiProducts: ApiProductDto[],
  apiEntries: ApiEntryDto[],
): Product[] {
  const entriesByProductId = new Map<string, ApiEntryDto>();
  for (const e of apiEntries) {
    entriesByProductId.set(e.productId, e);
  }

  return apiProducts.map((p) => {
    const entry = entriesByProductId.get(p.id);
    return {
      id: p.id,
      nameUk: p.nameUk,
      nameEn: p.nameEn,
      category: CATEGORY_MAP[p.category] ?? 'vegetables',
      tried: entry?.tried ?? false,
      firstTriedDate: entry?.firstTriedAt ?? undefined,
      rating: mapRating(entry?.rating),
      favorite: entry?.isFavorite ?? false,
      reactionNotes: entry?.reactionNote ?? undefined,
      notes: entry?.notes ?? undefined,
      isCustom: !p.isDefault,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _entryId: entry?.id,
    } as Product & { _entryId?: string };
  });
}

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
  apiBaseUrl: string;
  /** Maps productId → entryId for quick lookup when deleting entries */
  entryIdMap: Record<string, string>;
}

interface ProductsActions {
  initializeProducts: () => void;
  loadFromApi: () => Promise<void>;
  updateProduct: (id: string, update: ProductUpdate) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Product['category'] | null) => void;
  resetAllProgress: () => void;
  importProducts: (products: Product[]) => void;
  setBabyInfo: (info: Partial<BabyInfo>) => void;
  setApiBaseUrl: (url: string) => void;
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
      apiBaseUrl: '',
      entryIdMap: {},

      initializeProducts: () => {
        // Now a no-op on its own; the real loading happens in loadFromApi
        // Keep for backward compat with _layout.tsx call
      },

      loadFromApi: async () => {
        const baseUrl = get().apiBaseUrl;
        if (!baseUrl) return;

        set({ isLoading: true });
        try {
          const [apiProducts, apiEntries] = await Promise.all([
            fetchProductsFromApi(baseUrl),
            fetchEntriesFromApi(baseUrl),
          ]);

          const merged = mergeProductsAndEntries(apiProducts, apiEntries);

          // Build entryId map
          const entryIdMap: Record<string, string> = {};
          for (const e of apiEntries) {
            entryIdMap[e.productId] = e.id;
          }

          set({ products: merged, entryIdMap, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      updateProduct: (id, update) => {
        // Optimistic local update
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...update, updatedAt: new Date().toISOString() } : p,
          ),
        }));

        // Persist to API via upsert entry
        const baseUrl = get().apiBaseUrl;
        if (!baseUrl) return;

        const product = get().products.find((p) => p.id === id);
        if (!product) return;

        upsertEntryOnApi(baseUrl, {
          productId: id,
          tried: product.tried,
          firstTriedAt: product.firstTriedDate ?? null,
          rating: ratingToApi(product.rating),
          reactionNote: product.reactionNotes ?? null,
          notes: product.notes ?? null,
          isFavorite: product.favorite,
        })
          .then((entry) => {
            // Update entryId map
            set((state) => ({
              entryIdMap: { ...state.entryIdMap, [id]: entry.id },
            }));
          })
          .catch(() => {
            // Silently fail — user data was saved optimistically
          });
      },

      addProduct: (product) => {
        // Optimistic local add
        set((state) => ({ products: [...state.products, product] }));

        // Persist to API
        const baseUrl = get().apiBaseUrl;
        if (!baseUrl) return;

        createProductOnApi(baseUrl, {
          nameUk: product.nameUk,
          nameEn: product.nameEn,
          category: CATEGORY_REVERSE[product.category] ?? 'Vegetables',
        })
          .then((apiProduct) => {
            // Replace temp ID with server ID
            set((state) => ({
              products: state.products.map((p) =>
                p.id === product.id ? { ...p, id: apiProduct.id } : p,
              ),
            }));
          })
          .catch(() => {
            // Rollback on failure
            set((state) => ({
              products: state.products.filter((p) => p.id !== product.id),
            }));
          });
      },

      deleteProduct: (id) => {
        const existing = get().products.find((p) => p.id === id);
        // Optimistic local remove
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));

        // Delete on API (only custom products can be deleted)
        const baseUrl = get().apiBaseUrl;
        if (!baseUrl) return;

        deleteProductOnApi(baseUrl, id).catch(() => {
          // Rollback on failure
          if (existing) {
            set((state) => ({ products: [...state.products, existing] }));
          }
        });
      },

      setFilter: (filter) => set({ filter }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

      resetAllProgress: () => {
        const baseUrl = get().apiBaseUrl;
        const { entryIdMap } = get();

        // Optimistic reset
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

        // Delete all entries on API
        if (baseUrl) {
          for (const entryId of Object.values(entryIdMap)) {
            deleteEntryOnApi(baseUrl, entryId).catch(() => {
              /* best effort */
            });
          }
          set({ entryIdMap: {} });
        }
      },

      importProducts: (products) => {
        set({ products });
      },

      setBabyInfo: (info) => {
        set((state) => ({
          babyInfo: { ...state.babyInfo, ...info },
        }));
      },

      setApiBaseUrl: (url) => {
        set({ apiBaseUrl: url });
      },
    }),
    {
      name: STORAGE_KEYS.PRODUCTS,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        babyInfo: state.babyInfo,
        apiBaseUrl: state.apiBaseUrl,
      }),
    },
  ),
);
