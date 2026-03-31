import { Product } from '../features/products/types';

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
}

export async function syncProducts(products: Product[], config: ApiConfig): Promise<Product[]> {
  const response = await fetch(`${config.baseUrl}/products/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify({ products }),
  });

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.products as Product[];
}

export async function fetchProducts(config: ApiConfig): Promise<Product[]> {
  const response = await fetch(`${config.baseUrl}/products`, {
    headers: {
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.products as Product[];
}
