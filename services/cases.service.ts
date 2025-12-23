import api from "./api";
import { API_ENDPOINTS } from "@/lib/config";
import type { Case } from "@/types";

export const casesService = {
  async getAll(): Promise<Case[]> {
    const response = await api.get(API_ENDPOINTS.CASES.LIST);
    return response.data || [];
  },

  async getById(id: string): Promise<Case> {
    const response = await api.get(API_ENDPOINTS.CASES.BY_ID(id));
    return response.data;
  },

  async getStats(): Promise<any> {
    const response = await api.get(API_ENDPOINTS.CASES.STATS);
    return response.data;
  },
};

