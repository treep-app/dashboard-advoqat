// Normalize API_BASE_URL to remove trailing /api if present
// This prevents double /api/api in URLs
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legaliq.onrender.com/api";
export const API_BASE_URL = rawApiUrl.replace(/\/api\/?$/, "");

// API endpoints are relative paths (will be appended to baseURL in axios config)
export const API_ENDPOINTS = {
  // Auth - Using existing endpoints for now, will need admin-specific ones
  AUTH: {
    LOGIN: "/api/auth/signin",
    REGISTER: "/api/auth/signup",
    LOGOUT: "/api/auth/signout",
    ME: "/api/auth/session",
  },
  // Users - Note: No direct list endpoint, will need to query database
  USERS: {
    LIST: "/api/users", // This might not exist, will need admin endpoint
    BY_ID: (id: string) => `/api/users/${id}`,
    UPDATE: "/api/users/update",
    ROLE: "/api/users/role",
  },
  // Barristers
  BARRISTERS: {
    LIST: "/api/barrister", // May need to check actual endpoint
    BY_ID: (id: string) => `/api/barrister/${id}`,
    SEARCH: "/api/barrister/search",
  },
  // Freelancers
  FREELANCERS: {
    LIST: "/api/freelancers",
    BY_ID: (id: string) => `/api/freelancers/${id}`,
    SEARCH: "/api/freelancers/search",
  },
  // Cases - Need to check available endpoints
  CASES: {
    LIST: "/api/cases", // May need admin endpoint
    BY_ID: (id: string) => `/api/cases/${id}`,
    STATS: "/api/cases/stats",
  },
  // Documents
  DOCUMENTS: {
    LIST: "/api/v1/documents/user", // Requires userId query param
    BY_ID: (id: string) => `/api/v1/documents/${id}`,
  },
  // Health
  HEALTH: "/api/health",
} as const;

