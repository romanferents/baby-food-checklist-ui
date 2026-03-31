import * as SQLite from 'expo-sqlite';
import { Product } from '../features/products/types';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('babyfood.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (!db) await initDatabase();
  const database = db!;

  await database.withTransactionAsync(async () => {
    for (const product of products) {
      await database.runAsync(
        'INSERT OR REPLACE INTO products (id, data, updatedAt) VALUES (?, ?, ?)',
        product.id,
        JSON.stringify(product),
        product.updatedAt,
      );
    }
  });
}

export async function loadProducts(): Promise<Product[]> {
  if (!db) await initDatabase();
  const database = db!;

  const rows = await database.getAllAsync<{ id: string; data: string }>(
    'SELECT id, data FROM products ORDER BY id',
  );

  return rows.map((row) => JSON.parse(row.data) as Product);
}

export async function upsertProduct(product: Product): Promise<void> {
  if (!db) await initDatabase();
  const database = db!;

  await database.runAsync(
    'INSERT OR REPLACE INTO products (id, data, updatedAt) VALUES (?, ?, ?)',
    product.id,
    JSON.stringify(product),
    product.updatedAt,
  );
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) await initDatabase();
  const database = db!;

  await database.runAsync('DELETE FROM products WHERE id = ?', id);
}
