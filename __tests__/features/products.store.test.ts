import { act } from '@testing-library/react-native';
import { useProductsStore } from '../../src/features/products/products.store';
import { INITIAL_PRODUCTS } from '../../src/features/products/products.data';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('ProductsStore', () => {
  beforeEach(() => {
    useProductsStore.setState({
      products: [],
      isLoading: false,
      filter: 'all',
      searchQuery: '',
      selectedCategory: null,
    });
  });

  it('initializes products from INITIAL_PRODUCTS when empty', () => {
    act(() => {
      useProductsStore.getState().initializeProducts();
    });
    const { products } = useProductsStore.getState();
    expect(products.length).toBe(INITIAL_PRODUCTS.length);
  });

  it('does not duplicate products on re-initialization', () => {
    act(() => {
      useProductsStore.getState().initializeProducts();
      useProductsStore.getState().initializeProducts();
    });
    const { products } = useProductsStore.getState();
    expect(products.length).toBe(INITIAL_PRODUCTS.length);
  });

  it('updateProduct modifies the correct product', () => {
    act(() => {
      useProductsStore.getState().initializeProducts();
    });
    act(() => {
      useProductsStore.getState().updateProduct('p001', { tried: true });
    });
    const product = useProductsStore.getState().products.find((p) => p.id === 'p001');
    expect(product?.tried).toBe(true);
  });

  it('addProduct adds a new product', () => {
    act(() => {
      useProductsStore.getState().initializeProducts();
    });
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
    act(() => {
      useProductsStore.getState().initializeProducts();
    });
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
    act(() => {
      useProductsStore.getState().initializeProducts();
      useProductsStore.getState().updateProduct('p001', { tried: true });
    });
    act(() => {
      useProductsStore.getState().resetAllProgress();
    });
    const product = useProductsStore.getState().products.find((p) => p.id === 'p001');
    expect(product?.tried).toBe(false);
  });
});
