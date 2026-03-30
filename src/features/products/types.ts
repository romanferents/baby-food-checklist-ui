/** Category identifier for a food product */
export type ProductCategory =
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'meat'
  | 'grains'
  | 'nutsSeeds'
  | 'fish';

/** Rating for a tried food */
export type ProductRating = 'liked' | 'neutral' | 'disliked';

/** A food product in the checklist */
export interface Product {
  /** Unique identifier */
  id: string;
  /** Ukrainian name */
  nameUk: string;
  /** English name */
  nameEn: string;
  /** Product category */
  category: ProductCategory;
  /** Whether the baby has tried this food */
  tried: boolean;
  /** Date when first tried (ISO string) */
  firstTriedDate?: string;
  /** Rating of the food */
  rating?: ProductRating;
  /** Whether marked as favorite */
  favorite: boolean;
  /** Notes about reactions/allergies */
  reactionNotes?: string;
  /** General notes */
  notes?: string;
  /** Whether this is a custom user-added product */
  isCustom: boolean;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/** Partial product update */
export type ProductUpdate = Partial<Omit<Product, 'id' | 'isCustom' | 'createdAt'>>;

/** Filter options for the product list */
export type FilterType = 'all' | 'tried' | 'notTried' | 'favorites';

/** Statistics for a category */
export interface CategoryStats {
  category: ProductCategory;
  total: number;
  tried: number;
}

/** Overall app statistics */
export interface AppStats {
  totalProducts: number;
  triedProducts: number;
  customProducts: number;
  favorites: number;
  liked: number;
  neutral: number;
  disliked: number;
  categoryStats: CategoryStats[];
  recentlyTried: Product[];
}
