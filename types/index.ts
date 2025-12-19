// User types
export interface User {
  id: string;
  email: string;
  username?: string;
  languageId?: string | null;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

// Backend AuthResponse format
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    languageId: string | null;
  };
}

// Frontend format with expiresAt
export interface AuthResponseWithExpiry extends AuthResponse {
  expiresAt: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    languageId: string | null;
  };
}

// API Response types
export interface BaseResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

// API Status codes
export enum ApiStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}


