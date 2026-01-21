import api from '@/lib/api';

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  strategy: string;
  roi: number;
  sharpe_ratio: number;
  drawdown: number;
  win_rate: number;
  total_trades: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export const portfolioService = {
  async getFeaturedPortfolios(): Promise<Portfolio[]> {
    try {
      const { data } = await api.get('/portfolios/featured');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching featured portfolios:', error);
      return [];
    }
  },

  async getAllPortfolios(): Promise<Portfolio[]> {
    try {
      const { data } = await api.get('/portfolios');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      return [];
    }
  },

  async getPortfolioById(id: string): Promise<Portfolio | null> {
    try {
      const { data } = await api.get(`/portfolios/${id}`);
      return data.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return null;
    }
  },
};
