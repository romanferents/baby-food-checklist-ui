import { AuthResponse, LoginRequest, RegisterRequest } from '../features/auth/types';
import { useAuthStore } from '../features/auth/auth.store';

// ──────────────────────────────────────────────────────────
// API response types (match backend DTOs)
// ──────────────────────────────────────────────────────────

export interface ApiProductDto {
  id: string;
  nameUk: string;
  nameEn: string;
  category: string;
  categoryNameUk: string;
  categoryNameEn: string;
  isDefault: boolean;
  sortOrder: number;
}

export interface ApiEntryDto {
  id: string;
  productId: string;
  productNameUk: string;
  productNameEn: string;
  tried: boolean;
  firstTriedAt: string | null;
  rating: string | null;
  reactionNote: string | null;
  notes: string | null;
  isFavorite: boolean;
}

export interface ApiStatisticsDto {
  totalProducts: number;
  triedProducts: number;
  progressPercentage: number;
  categoryBreakdown: ApiCategoryStatDto[];
}

export interface ApiCategoryStatDto {
  category: string;
  categoryNameUk: string;
  categoryNameEn: string;
  totalProducts: number;
  triedProducts: number;
  progressPercentage: number;
}

export interface UpsertEntryRequest {
  productId: string;
  tried: boolean;
  firstTriedAt?: string | null;
  rating?: number | null;
  reactionNote?: string | null;
  notes?: string | null;
  isFavorite: boolean;
}

export interface CreateProductRequest {
  nameUk: string;
  nameEn: string;
  category: number;
}

// ──────────────────────────────────────────────────────────
// OData PascalCase → camelCase normalization
// ──────────────────────────────────────────────────────────

/** Category enum integer → string mapping (matches backend enum) */
const CATEGORY_INT_TO_STRING: Record<number, string> = {
  1: 'Vegetables',
  2: 'Fruits',
  3: 'Dairy',
  4: 'Meat',
  5: 'Grains',
  6: 'NutsSeeds',
  7: 'Fish',
  8: 'Spices',
  9: 'Other',
};

/** Category string → integer mapping for POST requests */
const CATEGORY_STRING_TO_INT: Record<string, number> = {
  Vegetables: 1,
  Fruits: 2,
  Dairy: 3,
  Meat: 4,
  Grains: 5,
  NutsSeeds: 6,
  Fish: 7,
  Spices: 8,
  Other: 9,
};

export function categoryToInt(category: string): number {
  return CATEGORY_STRING_TO_INT[category] ?? 1;
}

/** FoodRating enum integer → string mapping */
const RATING_INT_TO_STRING: Record<number, string> = {
  1: 'Liked',
  2: 'Neutral',
  3: 'Disliked',
};

/** FoodRating string → integer mapping for POST requests */
const RATING_STRING_TO_INT: Record<string, number> = {
  Liked: 1,
  Neutral: 2,
  Disliked: 3,
};

export function ratingToInt(rating: string): number | null {
  return RATING_STRING_TO_INT[rating] ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(raw: any): ApiProductDto {
  const cat = raw.Category ?? raw.category;
  const categoryStr = typeof cat === 'number' ? (CATEGORY_INT_TO_STRING[cat] ?? 'Vegetables') : (cat ?? 'Vegetables');
  return {
    id: raw.Id ?? raw.id,
    nameUk: raw.NameUk ?? raw.nameUk ?? '',
    nameEn: raw.NameEn ?? raw.nameEn ?? '',
    category: categoryStr,
    categoryNameUk: raw.CategoryNameUk ?? raw.categoryNameUk ?? '',
    categoryNameEn: raw.CategoryNameEn ?? raw.categoryNameEn ?? '',
    isDefault: raw.IsDefault ?? raw.isDefault ?? true,
    sortOrder: raw.SortOrder ?? raw.sortOrder ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeEntry(raw: any): ApiEntryDto {
  const rawRating = raw.Rating ?? raw.rating ?? null;
  const rating = typeof rawRating === 'number' ? (RATING_INT_TO_STRING[rawRating] ?? null) : rawRating;
  return {
    id: raw.Id ?? raw.id,
    productId: raw.ProductId ?? raw.productId,
    productNameUk: raw.ProductNameUk ?? raw.productNameUk ?? '',
    productNameEn: raw.ProductNameEn ?? raw.productNameEn ?? '',
    tried: raw.Tried ?? raw.tried ?? false,
    firstTriedAt: raw.FirstTriedAt ?? raw.firstTriedAt ?? null,
    rating,
    reactionNote: raw.ReactionNote ?? raw.reactionNote ?? null,
    notes: raw.Notes ?? raw.notes ?? null,
    isFavorite: raw.IsFavorite ?? raw.isFavorite ?? false,
  };
}

// ──────────────────────────────────────────────────────────
// Error class
// ──────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ──────────────────────────────────────────────────────────
// Authenticated fetch wrapper (auto-attaches JWT, auto-logout on 401)
// ──────────────────────────────────────────────────────────

async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const { token } = useAuthStore.getState();
  const existingHeaders =
    options.headers && typeof options.headers === 'object' && !Array.isArray(options.headers)
      ? (options.headers as Record<string, string>)
      : {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...existingHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    useAuthStore.getState().logout();
    throw new ApiError('Unauthorized', 401);
  }

  return response;
}

async function apiGet<T>(baseUrl: string, path: string): Promise<T> {
  const response = await authenticatedFetch(`${baseUrl}${path}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(errorData?.title ?? response.statusText, response.status);
  }
  return (await response.json()) as T;
}

async function apiPost<T>(baseUrl: string, path: string, body: unknown): Promise<T> {
  const response = await authenticatedFetch(`${baseUrl}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(errorData?.title ?? response.statusText, response.status);
  }
  return (await response.json()) as T;
}

async function apiDelete(baseUrl: string, path: string): Promise<void> {
  const response = await authenticatedFetch(`${baseUrl}${path}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(errorData?.title ?? response.statusText, response.status);
  }
}

// ──────────────────────────────────────────────────────────
// Auth endpoints (no JWT required)
// ──────────────────────────────────────────────────────────

export async function loginUser(baseUrl: string, credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message ?? errorData?.title ?? response.statusText;
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as AuthResponse;
}

export async function registerUser(baseUrl: string, data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message ?? errorData?.title ?? response.statusText;
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as AuthResponse;
}

// ──────────────────────────────────────────────────────────
// Products (OData query + CRUD)
// ──────────────────────────────────────────────────────────

export async function fetchProductsFromApi(baseUrl: string): Promise<ApiProductDto[]> {
  const response = await authenticatedFetch(
    `${baseUrl}/odata/v1/Products?$orderby=SortOrder&$count=true`,
  );
  if (!response.ok) {
    throw new ApiError(`Fetch products failed: ${response.statusText}`, response.status);
  }
  const data = await response.json();
  const raw = (data.value ?? data) as unknown[];
  return raw.map(normalizeProduct);
}

export async function createProductOnApi(
  baseUrl: string,
  body: CreateProductRequest,
): Promise<ApiProductDto> {
  return apiPost<ApiProductDto>(baseUrl, '/api/v1/products', body);
}

export async function deleteProductOnApi(baseUrl: string, id: string): Promise<void> {
  return apiDelete(baseUrl, `/api/v1/products/${id}`);
}

// ──────────────────────────────────────────────────────────
// Entries (OData query + upsert + delete)
// ──────────────────────────────────────────────────────────

export async function fetchEntriesFromApi(baseUrl: string): Promise<ApiEntryDto[]> {
  const response = await authenticatedFetch(`${baseUrl}/odata/v1/Entries?$count=true`);
  if (!response.ok) {
    throw new ApiError(`Fetch entries failed: ${response.statusText}`, response.status);
  }
  const data = await response.json();
  const raw = (data.value ?? data) as unknown[];
  return raw.map(normalizeEntry);
}

export async function upsertEntryOnApi(
  baseUrl: string,
  body: UpsertEntryRequest,
): Promise<ApiEntryDto> {
  return apiPost<ApiEntryDto>(baseUrl, '/api/v1/entries', body);
}

export async function deleteEntryOnApi(baseUrl: string, entryId: string): Promise<void> {
  return apiDelete(baseUrl, `/api/v1/entries/${entryId}`);
}

// ──────────────────────────────────────────────────────────
// Statistics
// ──────────────────────────────────────────────────────────

export async function fetchStatisticsFromApi(baseUrl: string): Promise<ApiStatisticsDto> {
  return apiGet<ApiStatisticsDto>(baseUrl, '/api/v1/statistics');
}
