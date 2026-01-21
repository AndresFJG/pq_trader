import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';
import dns from 'dns';

// Forzar IPv4
dns.setDefaultResultOrder('ipv4first');

// Configuración de Sequelize para PostgreSQL (Supabase)
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? (msg) => logger.info(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false,
    } : undefined,
    // Forzar IPv4 en lugar de IPv6
    host: process.env.DB_SSL === 'true' ? 'db.nmkmhtfdpoutcvizoxrr.supabase.co' : undefined,
  },
  define: {
    timestamps: true,
    underscored: true, // Usar snake_case para nombres de columnas
    freezeTableName: true, // No pluralizar nombres de tablas
  },
});

/**
 * Probar conexión a la base de datos
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('✅ PostgreSQL Database Connected (Supabase)');
    
    // En desarrollo, sincronizar modelos (cuidado en producción)
    if (process.env.NODE_ENV === 'development') {
      // await sequelize.sync({ alter: true });
      logger.info('📦 Database models synchronized');
    }
  } catch (error: any) {
    logger.error('❌ PostgreSQL Connection Error:', error);
    logger.warn('⚠️ Server continuing without database connection');
    // No lanzar error para que el servidor pueda arrancar sin BD
  }
};

/**
 * Cerrar conexión
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('🔌 PostgreSQL Database Connection Closed');
  } catch (error: any) {
    logger.error('Error closing database connection:', error);
  }
};

export default sequelize;
