import api from '@/lib/api';

export interface ChangeMetric {
  value: string;
  isPositive: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalMentorships: number;
  totalRevenue: number;
  conversionRate: number;
  certificatesIssued: number;
  activeSubscriptions: number;
  usersChange: ChangeMetric;
  coursesChange: ChangeMetric;
  mentorshipsChange: ChangeMetric;
  revenueChange: ChangeMetric;
  conversionChange: ChangeMetric;
  certificatesChange: ChangeMetric;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  subscriptionTier: string;
  createdAt: string;
}

export interface RecentTransaction {
  id: string;
  productName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get('/dashboard/stats');
    return data.data;
  },

  async getRecentUsers(): Promise<RecentUser[]> {
    const { data } = await api.get('/dashboard/recent-users');
    return data.data || [];
  },

  async getRecentTransactions(): Promise<RecentTransaction[]> {
    const { data } = await api.get('/dashboard/recent-transactions');
    return data.data || [];
  },
};
