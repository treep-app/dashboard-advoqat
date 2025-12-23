import api from "./api";
import type { DashboardStats } from "@/types";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // This will aggregate data from multiple endpoints
    // For now, we'll create a simple aggregation
    // Later, we can create a dedicated backend endpoint
    
    try {
      // Fetch all data in parallel
      // Note: Some endpoints might not exist or require parameters
      const [usersRes, freelancersRes, casesRes, documentsRes] = await Promise.allSettled([
        api.get("/api/users"),
        api.get("/api/freelancers"),
        api.get("/api/cases/available").catch(() => ({ data: [] })), // Try available cases endpoint
        api.get("/api/v1/documents").catch(() => ({ data: [] })), // This might need userId param
      ]);

      // Extract data from responses, handling both fulfilled and rejected promises
      const users = usersRes.status === 'fulfilled' ? (usersRes.value.data || []) : [];
      const freelancers = freelancersRes.status === 'fulfilled' ? (freelancersRes.value.data || []) : [];
      const cases = casesRes.status === 'fulfilled' ? (casesRes.value.data || []) : [];
      const documents = documentsRes.status === 'fulfilled' ? (documentsRes.value.data || []) : [];

      console.log('Dashboard Stats - Raw data:', {
        usersCount: users.length,
        freelancersCount: freelancers.length,
        casesCount: Array.isArray(cases) ? cases.length : 0,
        documentsCount: Array.isArray(documents) ? documents.length : 0,
      });

      // Count users by role (excluding admins)
      // Total users = all users that are not admin or super_admin
      const totalUsers = users.filter((u: any) => 
        u.role === "user" || u.role === "barrister" || u.role === "freelancer"
      ).length;
      
      // Count barristers from users array (users with role='barrister' or have barrister data)
      // A user is a barrister if they have role='barrister' OR if they have barrister_status set
      const totalBarristers = users.filter((u: any) => 
        u.role === "barrister" || (u.barrister_status !== null && u.barrister_status !== undefined)
      ).length;
      
      // Count freelancers - use the freelancers array length (this is correct)
      const totalFreelancers = Array.isArray(freelancers) ? freelancers.length : 0;
      
      // Count cases and documents
      const totalCases = Array.isArray(cases) ? cases.length : 0;
      const totalDocuments = Array.isArray(documents) ? documents.length : 0;

      console.log('Dashboard Stats - Calculated:', {
        totalUsers,
        totalBarristers,
        totalFreelancers,
        totalCases,
        totalDocuments,
      });

      // Create recent activity from various sources
      const recentActivity: any[] = [];

      // Add recent cases
      cases.slice(0, 5).forEach((c: any) => {
        recentActivity.push({
          id: c.id,
          type: "case",
          description: `Case "${c.title}" was ${c.status}`,
          user_id: c.client_id,
          created_at: c.created_at,
        });
      });

      // Sort by date
      recentActivity.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return {
        totalUsers,
        totalBarristers,
        totalFreelancers,
        totalCases,
        totalDocuments,
        recentActivity: recentActivity.slice(0, 10),
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        totalUsers: 0,
        totalBarristers: 0,
        totalFreelancers: 0,
        totalCases: 0,
        totalDocuments: 0,
        recentActivity: [],
      };
    }
  },
};

