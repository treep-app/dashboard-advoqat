export type UserRole = "user" | "barrister" | "freelancer" | "admin" | "super_admin";

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  supabase_id?: string;
  // Freelancer fields (only for freelancer role)
  experience?: number;
  expertise_areas?: string[];
  id_card_url?: string;
  bar_certificate_url?: string;
  additional_documents?: string[];
  is_verified?: boolean;
  verification_status?: "pending" | "approved" | "rejected";
  total_earnings?: string | number;
  performance_score?: string | number;
  is_available?: boolean;
  // Barrister fields
  barrister_status?: string;
  barrister_verification_notes?: string;
}

export interface Barrister {
  id: number;
  user_id: number;
  verification_status: "pending" | "verified" | "rejected";
  profile_completion: number;
  created_at: string;
  user?: User;
}

export interface Freelancer {
  id: number;
  user_id: number;
  skills?: string[];
  specialization?: string;
  availability: boolean;
  created_at: string;
  user?: User;
  // Direct properties from backend response
  name?: string;
  email?: string;
  experience?: number;
  expertise_areas?: string[];
  id_card_url?: string;
  bar_certificate_url?: string;
  additional_documents?: string[];
  is_verified?: boolean;
  verification_status?: "pending" | "approved" | "rejected";
  total_earnings?: string | number;
  performance_score?: string | number;
  is_available?: boolean;
}

export interface Case {
  id: number;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "declined";
  client_id: number;
  freelancer_id?: number;
  barrister_id?: number;
  priority?: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
  client?: User;
  freelancer?: Freelancer;
  barrister?: Barrister;
}

export interface Document {
  id: number;
  user_id: number;
  case_id?: number;
  document_type: string;
  file_url: string;
  created_at: string;
  user?: User;
  case?: Case;
}

export interface DashboardStats {
  totalUsers: number;
  totalBarristers: number;
  totalFreelancers: number;
  totalCases: number;
  totalDocuments: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: number;
  type: string;
  description: string;
  user_id?: number;
  created_at: string;
  user?: User;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  created_at: string;
  updated_at: string;
}

