export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const API_ENDPOINTS = {
  // Auth - Using existing endpoints for now, will need admin-specific ones
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/signin`,
    REGISTER: `${API_BASE_URL}/api/auth/signup`,
    LOGOUT: `${API_BASE_URL}/api/auth/signout`,
    ME: `${API_BASE_URL}/api/auth/session`,
  },
  // Users - Note: No direct list endpoint, will need to query database
  USERS: {
    LIST: `${API_BASE_URL}/api/users`, // This might not exist, will need admin endpoint
    BY_ID: (id: string) => `${API_BASE_URL}/api/users/${id}`,
    UPDATE: `${API_BASE_URL}/api/users/update`,
    ROLE: `${API_BASE_URL}/api/users/role`,
  },
  // Barristers
  BARRISTERS: {
    LIST: `${API_BASE_URL}/api/barrister`, // May need to check actual endpoint
    BY_ID: (id: string) => `${API_BASE_URL}/api/barrister/${id}`,
    SEARCH: `${API_BASE_URL}/api/barrister/search`,
  },
  // Freelancers
  FREELANCERS: {
    LIST: `${API_BASE_URL}/api/freelancers`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/freelancers/${id}`,
    SEARCH: `${API_BASE_URL}/api/freelancers/search`,
  },
  // Cases - Need to check available endpoints
  CASES: {
    LIST: `${API_BASE_URL}/api/cases`, // May need admin endpoint
    BY_ID: (id: string) => `${API_BASE_URL}/api/cases/${id}`,
    STATS: `${API_BASE_URL}/api/cases/stats`,
  },
  // Documents
  DOCUMENTS: {
    LIST: `${API_BASE_URL}/api/v1/documents/user`, // Requires userId query param
    BY_ID: (id: string) => `${API_BASE_URL}/api/v1/documents/${id}`,
  },
  // Health
  HEALTH: `${API_BASE_URL}/api/health`,
} as const;

