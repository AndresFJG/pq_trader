import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Crear directorio de logs si no existe
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Formato personalizado
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Logger principal
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { service: 'pq-trader-api' },
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Error log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Security log
    new winston.transports.File({
      filename: path.join(logsDir, 'security.log'),
      level: 'warn',
      maxsize: 10485760, // 10MB
      maxFiles: 20,
    }),
    // Transactions log
    new winston.transports.File({
      filename: path.join(logsDir, 'transactions.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 30,
    }),
  ],
});

/**
 * Helper para logs de seguridad
 */
export const logSecurity = (event: string, data: any = {}) => {
  logger.warn({
    type: 'SECURITY',
    event,
    ...data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Helper para logs de transacciones
 */
export const logTransaction = (type: string, data: any = {}) => {
  logger.info({
    type: 'TRANSACTION',
    transactionType: type,
    ...data,
    timestamp: new Date().toISOString(),
  });
};

export default logger;
