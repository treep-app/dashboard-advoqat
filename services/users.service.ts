import api from "./api";
import { API_ENDPOINTS } from "@/lib/config";
import type { User } from "@/types";

export const usersService = {
  async getAll(): Promise<User[]> {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.LIST);
      console.log('Users API Response:', response.data);
      // Handle both array and object responses
      if (Array.isArray(response.data)) {
        return response.data;
      }
      // If response is wrapped in an object, try to extract the array
      if (response.data?.users && Array.isArray(response.data.users)) {
        return response.data.users;
      }
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  async getById(id: string): Promise<User> {
    const response = await api.get(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE, {
      userId: id,
      ...data,
    });
    return response.data;
  },

  async getRole(userId: string): Promise<{ role: string }> {
    const response = await api.get(API_ENDPOINTS.USERS.ROLE, {
      params: { userId },
    });
    return response.data;
  },
};

