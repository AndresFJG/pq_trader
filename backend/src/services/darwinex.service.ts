import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

interface DarwinPerformance {
  return: number;
  drawdown: number;
  sharpeRatio: number;
  trades: number;
  winRate: number;
}

export class DarwinexService {
  private client: AxiosInstance;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.apiKey = process.env.DARWINEX_API_KEY!;
    this.apiSecret = process.env.DARWINEX_API_SECRET!;

    this.client = axios.create({
      baseURL: process.env.DARWINEX_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor
    this.client.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${this.apiKey}`;
      return config;
    });
  }

  /**
   * Get portfolio performance data
   */
  async getPortfolioPerformance(darwinName: string): Promise<DarwinPerformance> {
    try {
      const response = await this.client.get(`/darwins/${darwinName}/performance`);
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching Darwinex performance', { darwinName, error: error.message });
      throw new Error('Error al obtener datos de Darwinex');
    }
  }

  /**
   * Get multiple portfolios
   */
  async getPortfolios(darwinNames: string[]): Promise<DarwinPerformance[]> {
    try {
      const promises = darwinNames.map((name) =>
        this.getPortfolioPerformance(name)
      );
      return await Promise.all(promises);
    } catch (error: any) {
      logger.error('Error fetching Darwinex portfolios', { error: error.message });
      throw new Error('Error al obtener portafolios');
    }
  }

  /**
   * Get historical data
   */
  async getHistoricalData(
    darwinName: string,
    from: Date,
    to: Date
  ): Promise<any> {
    try {
      const response = await this.client.get(
        `/darwins/${darwinName}/historical`,
        {
          params: {
            from: from.toISOString(),
            to: to.toISOString(),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching historical data', { darwinName, error: error.message });
      throw new Error('Error al obtener datos históricos');
    }
  }

  /**
   * Get statistics
   */
  async getStatistics(darwinName: string): Promise<any> {
    try {
      const response = await this.client.get(`/darwins/${darwinName}/stats`);
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching statistics', { darwinName, error: error.message });
      throw new Error('Error al obtener estadísticas');
    }
  }
}

export default new DarwinexService();
