import { act } from '@testing-library/react-native';
import { useProductsStore } from '../../src/features/products/products.store';
import { Product } from '../../src/features/products/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock fetch so API calls in the store don't actually fire
global.fetch = jest.fn(() =>
  Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve(null) }),
) as jest.Mock;

const SEED_PRODUCTS: Product[] = [
  {
    id: 'p001',
    nameUk: 'Морква',
    nameEn: 'Carrot',
    category: 'vegetables',
    tried: false,
    favorite: false,
    isCustom: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'p002',
    nameUk: 'Банан',
    nameEn: 'Banana',
    category: 'fruits',
    tried: false,
    favorite: false,
    isCustom: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('ProductsStore', () => {
  beforeEach(() => {
    useProductsStore.setState({
      products: [],
      isLoading: false,
      filter: 'all',
      searchQuery: '',
      selectedCategory: null,
      apiBaseUrl: '',
      entryIdMap: {},
    });
  });

  it('starts with empty products (loaded from API, not local)', () => {
    const { products } = useProductsStore.getState();
    expect(products.length).toBe(0);
  });

  it('updateProduct modifies the correct product', () => {
    useProductsStore.setState({ products: [...SEED_PRODUCTS] });
    act(() => {
      useProductsStore.getState().updateProduct('p001', { tried: true });
    });
    const product = useProductsStore.getState().products.find((p) => p.id === 'p001');
    expect(product?.tried).toBe(true);
  });

  it('addProduct adds a new product', () => {
    useProductsStore.setState({ products: [...SEED_PRODUCTS] });
    const before = useProductsStore.getState().products.length;
    act(() => {
      useProductsStore.getState().addProduct({
        id: 'custom_test',
        nameUk: 'Тест',
        nameEn: 'Test',
        category: 'fruits',
        tried: false,
        favorite: false,
        isCustom: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
    const after = useProductsStore.getState().products.length;
    expect(after).toBe(before + 1);
  });

  it('deleteProduct removes the correct product', () => {
    useProductsStore.setState({ products: [...SEED_PRODUCTS] });
    const before = useProductsStore.getState().products.length;
    act(() => {
      useProductsStore.getState().deleteProduct('p001');
    });
    const after = useProductsStore.getState().products.length;
    expect(after).toBe(before - 1);
    expect(useProductsStore.getState().products.find((p) => p.id === 'p001')).toBeUndefined();
  });

  it('setFilter updates filter state', () => {
    act(() => {
      useProductsStore.getState().setFilter('tried');
    });
    expect(useProductsStore.getState().filter).toBe('tried');
  });

  it('setSearchQuery updates searchQuery state', () => {
    act(() => {
      useProductsStore.getState().setSearchQuery('apple');
    });
    expect(useProductsStore.getState().searchQuery).toBe('apple');
  });

  it('resetAllProgress clears tried status on non-custom products', () => {
    useProductsStore.setState({
      products: SEED_PRODUCTS.map((p) => (p.id === 'p001' ? { ...p, tried: true } : p)),
    });
    act(() => {
      useProductsStore.getState().resetAllProgress();
    });
    const product = useProductsStore.getState().products.find((p) => p.id === 'p001');
    expect(product?.tried).toBe(false);
  });

  it('setApiBaseUrl stores the URL', () => {
    act(() => {
      useProductsStore.getState().setApiBaseUrl('http://localhost:5247');
    });
    expect(useProductsStore.getState().apiBaseUrl).toBe('http://localhost:5247');
  });
});
