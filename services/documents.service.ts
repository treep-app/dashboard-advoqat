import api from "./api";
import { API_ENDPOINTS } from "@/lib/config";
import type { Document } from "@/types";

export const documentsService = {
  async getAll(): Promise<Document[]> {
    const response = await api.get(API_ENDPOINTS.DOCUMENTS.LIST);
    return response.data || [];
  },

  async getById(id: string): Promise<Document> {
    const response = await api.get(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
    return response.data;
  },
};

