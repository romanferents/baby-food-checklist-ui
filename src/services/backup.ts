import { Share } from 'react-native';
import { Product } from '../features/products/types';

export function exportToJSON(products: Product[]): string {
  return JSON.stringify(
    {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      products,
    },
    null,
    2,
  );
}

export function importFromJSON(json: string): Product[] {
  const parsed: unknown = JSON.parse(json);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON format');
  }

  const obj = parsed as Record<string, unknown>;
  if (!Array.isArray(obj.products)) {
    throw new Error('Missing products array');
  }

  return obj.products as Product[];
}

export async function shareFile(content: string, filename: string): Promise<void> {
  await Share.share({
    message: content,
    title: filename,
  });
}
