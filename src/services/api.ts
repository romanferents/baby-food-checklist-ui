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
  rating?: string | null;
  reactionNote?: string | null;
  notes?: string | null;
  isFavorite: boolean;
}

export interface CreateProductRequest {
  nameUk: string;
  nameEn: string;
  category: string;
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
  return (data.value ?? data) as ApiProductDto[];
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
  return (data.value ?? data) as ApiEntryDto[];
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
