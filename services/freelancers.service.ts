import api from "./api";
import { API_ENDPOINTS } from "@/lib/config";
import type { Freelancer } from "@/types";

export const freelancersService = {
  async getAll(): Promise<Freelancer[]> {
    const response = await api.get(API_ENDPOINTS.FREELANCERS.LIST);
    return response.data || [];
  },

  async getById(id: string): Promise<Freelancer> {
    const response = await api.get(API_ENDPOINTS.FREELANCERS.BY_ID(id));
    return response.data;
  },

  async search(query: string): Promise<Freelancer[]> {
    const response = await api.get(API_ENDPOINTS.FREELANCERS.SEARCH, {
      params: { q: query },
    });
    return response.data || [];
  },
};

