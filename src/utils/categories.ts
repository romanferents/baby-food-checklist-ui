import { ProductCategory } from '../features/products/types';

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  vegetables: 'carrot',
  fruits: 'fruit-cherries',
  dairy: 'cheese',
  meat: 'food-steak',
  grains: 'barley',
  nutsSeeds: 'peanut',
  fish: 'fish',
};

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  vegetables: '#4CAF50',
  fruits: '#FF9800',
  dairy: '#2196F3',
  meat: '#F44336',
  grains: '#795548',
  nutsSeeds: '#FF5722',
  fish: '#00BCD4',
};

export const CATEGORY_ORDER: ProductCategory[] = [
  'vegetables',
  'fruits',
  'dairy',
  'meat',
  'grains',
  'nutsSeeds',
  'fish',
];
