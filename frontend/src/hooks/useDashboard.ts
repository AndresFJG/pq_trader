'use client';

import { useState, useEffect } from 'react';
import { dashboardService, DashboardStats, RecentUser, RecentTransaction } from '@/services/dashboardService';
import { useToast } from '@/hooks/use-toast';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsData, usersData, transactionsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentUsers(),
        dashboardService.getRecentTransactions(),
      ]);

      setStats(statsData);
      setRecentUsers(usersData);
      setRecentTransactions(transactionsData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Error al cargar datos del dashboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentUsers,
    recentTransactions,
    loading,
    refetch: fetchDashboardData,
  };
}
