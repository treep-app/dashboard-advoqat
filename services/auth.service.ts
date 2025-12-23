import api from "./api";
import { API_ENDPOINTS } from "@/lib/config";
import type { AdminUser } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: "admin" | "super_admin";
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  error?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // For now, use the existing signin endpoint
      // Later we'll create dedicated admin endpoints
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const data = response.data;
      
      if (data.success && data.token) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        return { success: true, token: data.token, user: data.user };
      }
      
      return { success: false, error: data.error || "Login failed" };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
      const result = response.data;
      
      if (result.success && result.token) {
        localStorage.setItem("admin_token", result.token);
        localStorage.setItem("admin_user", JSON.stringify(result.user));
        return { success: true, token: result.token, user: result.user };
      }
      
      return { success: false, error: result.error || "Registration failed" };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      return response.data.user || null;
    } catch (error) {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/auth/login";
  },

  getStoredUser(): AdminUser | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("admin_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("admin_token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

