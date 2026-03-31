import { Product, ProductCategory, FilterType, CategoryStats, AppStats } from './types';

export function getFilteredProducts(
  products: Product[],
  filter: FilterType,
  searchQuery: string,
  selectedCategory: ProductCategory | null,
  language: string,
): Product[] {
  let result = [...products];

  if (selectedCategory) {
    result = result.filter((p) => p.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    result = result.filter(
      (p) => p.nameUk.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q),
    );
  }

  switch (filter) {
    case 'tried':
      result = result.filter((p) => p.tried);
      break;
    case 'notTried':
      result = result.filter((p) => !p.tried);
      break;
    case 'favorites':
      result = result.filter((p) => p.favorite);
      break;
    default:
      break;
  }

  return result;
}

export function getProductsByCategory(products: Product[]): Record<ProductCategory, Product[]> {
  return products.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    },
    {} as Record<ProductCategory, Product[]>,
  );
}

export function getCategoryStats(products: Product[]): CategoryStats[] {
  const categories: ProductCategory[] = [
    'vegetables',
    'fruits',
    'dairy',
    'meat',
    'grains',
    'nutsSeeds',
    'fish',
  ];

  return categories.map((category) => {
    const categoryProducts = products.filter((p) => p.category === category);
    return {
      category,
      total: categoryProducts.length,
      tried: categoryProducts.filter((p) => p.tried).length,
    };
  });
}

export function getRecentlyTried(products: Product[], limit = 5): Product[] {
  return products
    .filter((p) => p.tried && p.firstTriedDate)
    .sort((a, b) => {
      const dateA = a.firstTriedDate ? new Date(a.firstTriedDate).getTime() : 0;
      const dateB = b.firstTriedDate ? new Date(b.firstTriedDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit);
}

export function getAppStats(products: Product[]): AppStats {
  const triedProducts = products.filter((p) => p.tried);

  return {
    totalProducts: products.length,
    triedProducts: triedProducts.length,
    customProducts: products.filter((p) => p.isCustom).length,
    favorites: products.filter((p) => p.favorite).length,
    liked: triedProducts.filter((p) => p.rating === 'liked').length,
    neutral: triedProducts.filter((p) => p.rating === 'neutral').length,
    disliked: triedProducts.filter((p) => p.rating === 'disliked').length,
    categoryStats: getCategoryStats(products),
    recentlyTried: getRecentlyTried(products),
  };
}
