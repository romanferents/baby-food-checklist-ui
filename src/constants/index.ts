export const APP_VERSION = '1.0.0';
export const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
export const GITHUB_URL = 'https://github.com/romanferents/baby-food-checklist-ui';
export const MAX_CUSTOM_PRODUCTS = 50;
export const DEBOUNCE_DELAY_MS = 300;
export const RECENTLY_TRIED_LIMIT = 5;
export const STORAGE_KEYS = {
  PRODUCTS: 'products-storage',
  THEME: 'theme-preference',
  LANGUAGE: 'language-preference',
  API_URL: 'api-url',
  AUTH: 'auth-storage',
} as const;
