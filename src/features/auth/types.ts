export interface AuthResponse {
  userId: string;
  username: string;
  email: string;
  token: string;
}

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
