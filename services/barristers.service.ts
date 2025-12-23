import api from "./api";
import { API_ENDPOINTS } from "@/lib/config";
import type { Barrister } from "@/types";

export const barristersService = {
  async getAll(): Promise<Barrister[]> {
    const response = await api.get(API_ENDPOINTS.BARRISTERS.LIST);
    return response.data || [];
  },

  async getById(id: string): Promise<Barrister> {
    const response = await api.get(API_ENDPOINTS.BARRISTERS.BY_ID(id));
    return response.data;
  },

  async search(query: string): Promise<Barrister[]> {
    const response = await api.get(API_ENDPOINTS.BARRISTERS.SEARCH, {
      params: { q: query },
    });
    return response.data || [];
  },
};

