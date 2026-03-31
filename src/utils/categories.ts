import { ProductCategory } from '../features/products/types';

export interface CategoryMeta {
  id: ProductCategory;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const CATEGORY_META: Record<ProductCategory, CategoryMeta> = {
  vegetables: {
    id: 'vegetables',
    emoji: '🥦',
    color: '#2d8a4e',
    bgColor: '#e8f7ed',
    borderColor: '#a8d8b9',
  },
  fruits: {
    id: 'fruits',
    emoji: '🍎',
    color: '#c0392b',
    bgColor: '#fde8e8',
    borderColor: '#f5b7b1',
  },
  dairy: {
    id: 'dairy',
    emoji: '🥛',
    color: '#1a6b96',
    bgColor: '#e3f2fd',
    borderColor: '#90caf9',
  },
  meat: {
    id: 'meat',
    emoji: '🥩',
    color: '#8b2635',
    bgColor: '#fce4e4',
    borderColor: '#f1a7a7',
  },
  grains: {
    id: 'grains',
    emoji: '🌾',
    color: '#8a6914',
    bgColor: '#fef9e7',
    borderColor: '#f9d97b',
  },
  nutsSeeds: {
    id: 'nutsSeeds',
    emoji: '🥜',
    color: '#6b4423',
    bgColor: '#f5eae3',
    borderColor: '#d4a574',
  },
  fish: {
    id: 'fish',
    emoji: '🐟',
    color: '#1565a0',
    bgColor: '#e1f0fa',
    borderColor: '#90c4e8',
  },
  spices: {
    id: 'spices',
    emoji: '🌿',
    color: '#4a7c59',
    bgColor: '#edf7f0',
    borderColor: '#9ecdb0',
  },
};

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  vegetables: 'carrot',
  fruits: 'fruit-cherries',
  dairy: 'cheese',
  meat: 'food-steak',
  grains: 'barley',
  nutsSeeds: 'peanut',
  fish: 'fish',
  spices: 'leaf',
};

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  vegetables: '#2d8a4e',
  fruits: '#c0392b',
  dairy: '#1a6b96',
  meat: '#8b2635',
  grains: '#8a6914',
  nutsSeeds: '#6b4423',
  fish: '#1565a0',
  spices: '#4a7c59',
};

export const CATEGORY_ORDER: ProductCategory[] = [
  'vegetables',
  'fruits',
  'dairy',
  'meat',
  'grains',
  'nutsSeeds',
  'fish',
  'spices',
];
