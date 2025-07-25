import { apiRequest } from "./queryClient";
import type { User, LoginRequest, RegisterRequest } from "@shared/schema";

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  private static TOKEN_KEY = 'viemind_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/auth/login', credentials);
    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/auth/register', userData);
    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  static async logout(): Promise<void> {
    try {
      await apiRequest('POST', '/api/auth/logout');
    } catch (error) {
      // Continue with logout even if request fails
    } finally {
      this.removeToken();
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await apiRequest('GET', '/api/auth/me');
      return await response.json();
    } catch (error) {
      this.removeToken();
      return null;
    }
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
