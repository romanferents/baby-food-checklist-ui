import { Product } from '../features/products/types';
import { AuthResponse, LoginRequest, RegisterRequest } from '../features/auth/types';
import { useAuthStore } from '../features/auth/auth.store';

export interface ApiConfig {
  baseUrl: string;
}

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
    throw new Error('Unauthorized');
  }

  return response;
}

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

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function syncProducts(products: Product[], config: ApiConfig): Promise<Product[]> {
  const response = await authenticatedFetch(`${config.baseUrl}/api/v1/products/sync`, {
    method: 'POST',
    body: JSON.stringify({ products }),
  });

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.products as Product[];
}

export async function fetchProducts(config: ApiConfig): Promise<Product[]> {
  const response = await authenticatedFetch(`${config.baseUrl}/api/v1/products`);

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.products as Product[];
}
