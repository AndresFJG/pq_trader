import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { config } from '../config/env';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: ServiceStatus;
    storage: ServiceStatus;
    email: ServiceStatus;
  };
  version: string;
  environment: string;
}

interface ServiceStatus {
  status: 'up' | 'down' | 'unknown';
  latency?: number;
  message?: string;
}

/**
 * @desc    Health check básico
 * @route   GET /health
 * @access  Public
 */
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

/**
 * @desc    Health check detallado con verificación de servicios
 * @route   GET /api/health
 * @access  Public
 */
export const detailedHealthCheck = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    // Verificar base de datos
    const dbStatus = await checkDatabase();

    // Verificar Supabase Storage
    const storageStatus = await checkStorage();

    // Verificar servicio de email
    const emailStatus = await checkEmail();

    // Determinar estado general
    const allServicesUp = 
      dbStatus.status === 'up' && 
      storageStatus.status === 'up';

    const someServicesDown = 
      dbStatus.status === 'down' || 
      storageStatus.status === 'down';

    const overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 
      allServicesUp && emailStatus.status === 'up' ? 'healthy' :
      allServicesUp ? 'degraded' :
      someServicesDown ? 'unhealthy' : 'degraded';

    const healthData: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbStatus,
        storage: storageStatus,
        email: emailStatus,
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };

    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
    
    res.status(statusCode).json(healthData);

    // Log si hay problemas
    if (overallStatus !== 'healthy') {
      logger.warn('Health check returned non-healthy status', { healthData });
    }

  } catch (error: any) {
    logger.error('Health check failed', { error: error.message });
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      error: 'Health check failed',
      message: error.message,
    });
  }
};

/**
 * Verificar conexión a base de datos
 */
async function checkDatabase(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // Query simple para verificar conexión
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single();

    const latency = Date.now() - startTime;

    if (error) {
      return {
        status: 'down',
        latency,
        message: error.message,
      };
    }

    return {
      status: 'up',
      latency,
    };
  } catch (error: any) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      message: error.message,
    };
  }
}

/**
 * Verificar Supabase Storage
 */
async function checkStorage(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // Listar buckets para verificar conexión
    const { data, error } = await supabase.storage.listBuckets();

    const latency = Date.now() - startTime;

    if (error) {
      return {
        status: 'down',
        latency,
        message: error.message,
      };
    }

    // Verificar que exista el bucket lesson-media
    const lessonMediaBucket = data?.find(bucket => bucket.name === 'lesson-media');
    
    if (!lessonMediaBucket) {
      return {
        status: 'down',
        latency,
        message: 'lesson-media bucket not found',
      };
    }

    return {
      status: 'up',
      latency,
    };
  } catch (error: any) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      message: error.message,
    };
  }
}

/**
 * Verificar servicio de email
 */
async function checkEmail(): Promise<ServiceStatus> {
  try {
    // Verificar que las variables de entorno estén configuradas
    const emailConfigured = 
      process.env.EMAIL_HOST && 
      process.env.EMAIL_USER && 
      process.env.EMAIL_PASSWORD;

    if (!emailConfigured) {
      return {
        status: 'unknown',
        message: 'Email service not configured',
      };
    }

    // En producción, podrías hacer un test real enviando un email
    // Por ahora, solo verificamos que esté configurado
    return {
      status: 'up',
      message: 'Email configured',
    };
  } catch (error: any) {
    return {
      status: 'down',
      message: error.message,
    };
  }
}

/**
 * @desc    Readiness probe (para Kubernetes)
 * @route   GET /ready
 * @access  Public
 */
export const readinessCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar servicios críticos
    const dbStatus = await checkDatabase();
    
    if (dbStatus.status === 'down') {
      res.status(503).json({ 
        ready: false, 
        reason: 'Database unavailable' 
      });
      return;
    }

    res.status(200).json({ 
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(503).json({ 
      ready: false, 
      reason: error.message 
    });
  }
};

/**
 * @desc    Liveness probe (para Kubernetes)
 * @route   GET /live
 * @access  Public
 */
export const livenessCheck = async (req: Request, res: Response): Promise<void> => {
  // Simple check que el proceso está vivo
  res.status(200).json({ 
    alive: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
