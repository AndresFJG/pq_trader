import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

    // Get total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Get users from last month
    const { count: usersLastMonth } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayLastMonth)
      .lte('created_at', lastDayLastMonth);

    // Get users this month
    const { count: usersThisMonth } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayThisMonth);

    // Get total courses
    const { count: totalCourses, error: coursesError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    if (coursesError) throw coursesError;

    // Get courses from last month
    const { count: coursesLastMonth } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayLastMonth)
      .lte('created_at', lastDayLastMonth);

    // Get courses this month
    const { count: coursesThisMonth } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayThisMonth);

    // Get total mentorships
    const { count: totalMentorships, error: mentorshipsError } = await supabase
      .from('mentorships')
      .select('*', { count: 'exact', head: true });

    if (mentorshipsError) throw mentorshipsError;

    // Get mentorships from last month
    const { count: mentorshipsLastMonth } = await supabase
      .from('mentorships')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayLastMonth)
      .lte('created_at', lastDayLastMonth);

    // Get mentorships this month
    const { count: mentorshipsThisMonth } = await supabase
      .from('mentorships')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayThisMonth);

    // Get revenue this month
    const { data: transactionsThisMonth, error: transactionsThisMonthError } = await supabase
      .from('transactions')
      .select('amount, status, created_at')
      .eq('status', 'completed')
      .gte('created_at', firstDayThisMonth);

    if (transactionsThisMonthError) throw transactionsThisMonthError;

    const revenueThisMonth = transactionsThisMonth?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // Get revenue last month
    const { data: transactionsLastMonth } = await supabase
      .from('transactions')
      .select('amount, status')
      .eq('status', 'completed')
      .gte('created_at', firstDayLastMonth)
      .lte('created_at', lastDayLastMonth);

    const revenueLastMonth = transactionsLastMonth?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // Get total revenue from all completed transactions
    const { data: allTransactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount, status')
      .eq('status', 'completed');

    if (transactionsError) throw transactionsError;

    const totalRevenue = allTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // Get total transactions for conversion rate
    const { count: totalTransactions, error: totalTransError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    if (totalTransError) throw totalTransError;

    // Calculate conversion rate this month
    const completedThisMonth = transactionsThisMonth?.length || 0;
    const { count: totalTransactionsThisMonth } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayThisMonth);

    const conversionRateThisMonth = totalTransactionsThisMonth 
      ? (completedThisMonth / totalTransactionsThisMonth) * 100 
      : 0;

    // Calculate conversion rate last month
    const completedLastMonth = transactionsLastMonth?.length || 0;
    const { count: totalTransactionsLastMonth } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayLastMonth)
      .lte('created_at', lastDayLastMonth);

    const conversionRateLastMonth = totalTransactionsLastMonth 
      ? (completedLastMonth / totalTransactionsLastMonth) * 100 
      : 0;

    // Get active subscriptions
    const { count: activeSubscriptions, error: subsError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    if (subsError) throw subsError;

    // Calculate certificates (use enrollment count from courses)
    const { data: courses, error: certError } = await supabase
      .from('courses')
      .select('enrollment_count');

    if (certError) throw certError;

    const certificatesIssued = courses?.reduce((sum, c) => sum + (c.enrollment_count || 0), 0) || 0;

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number): { value: string; isPositive: boolean } => {
      if (previous === 0) {
        return current > 0 ? { value: '+100%', isPositive: true } : { value: '0%', isPositive: true };
      }
      const change = ((current - previous) / previous) * 100;
      const isPositive = change >= 0;
      return {
        value: `${isPositive ? '+' : ''}${change.toFixed(1)}%`,
        isPositive,
      };
    };

    const calculateAbsoluteChange = (current: number, previous: number): { value: string; isPositive: boolean } => {
      const change = current - previous;
      const isPositive = change >= 0;
      return {
        value: `${isPositive ? '+' : ''}${change}`,
        isPositive,
      };
    };

    res.status(200).json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        totalCourses: totalCourses || 0,
        totalMentorships: totalMentorships || 0,
        totalRevenue: Number(revenueThisMonth.toFixed(2)),
        conversionRate: Number(conversionRateThisMonth.toFixed(1)),
        certificatesIssued,
        activeSubscriptions: activeSubscriptions || 0,
        // Growth metrics
        usersChange: calculateChange(usersThisMonth || 0, usersLastMonth || 0),
        coursesChange: calculateAbsoluteChange(coursesThisMonth || 0, coursesLastMonth || 0),
        mentorshipsChange: calculateChange(mentorshipsThisMonth || 0, mentorshipsLastMonth || 0),
        revenueChange: calculateChange(revenueThisMonth, revenueLastMonth),
        conversionChange: {
          value: `${conversionRateThisMonth >= conversionRateLastMonth ? '+' : ''}${(conversionRateThisMonth - conversionRateLastMonth).toFixed(1)}%`,
          isPositive: conversionRateThisMonth >= conversionRateLastMonth,
        },
        certificatesChange: calculateAbsoluteChange(certificatesIssued, 0), // Tracking mensual pendiente: agregar created_at a certificates
      },
    });
  } catch (error: any) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener estadísticas',
    });
  }
};

// Get recent users
export const getRecentUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, subscription_tier, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data?.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscription_tier,
        createdAt: user.created_at,
      })) || [],
    });
  } catch (error: any) {
    logger.error('Error fetching recent users:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener usuarios recientes',
    });
  }
};

// Get recent transactions
export const getRecentTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        status,
        created_at,
        metadata
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data?.map((transaction) => ({
        id: transaction.id,
        productName: transaction.metadata?.productName || transaction.metadata?.product_name || 'N/A',
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.created_at,
      })) || [],
    });
  } catch (error: any) {
    logger.error('Error fetching recent transactions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener transacciones recientes',
    });
  }
};
