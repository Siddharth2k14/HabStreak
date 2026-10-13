export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: AuthUser;
}

export interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string>;
}
