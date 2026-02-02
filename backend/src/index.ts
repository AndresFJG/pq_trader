import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Cargar y validar variables de entorno PRIMERO
import env, { config } from './config/env';

import { connectSupabase } from './config/supabase';
import { logger } from './utils/logger';
import TransactionService from './services/transaction.service';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import lessonRoutes from './routes/lesson.routes';
import dashboardRoutes from './routes/dashboard.routes';
import mentorshipRoutes from './routes/mentorship.routes';
import mentorshipSessionRoutes from './routes/mentorshipSession.routes';
import portfolioRoutes from './routes/portfolio.routes';
import transactionRoutes from './routes/transaction.routes';
import paypalRoutes from './routes/paypal.routes';
import paymentRoutes from './routes/payment.routes';
import stripeRoutes from './routes/stripe.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import uploadRoutes from './routes/upload.routes';
import mentorshipBookingRoutes from './routes/mentorshipBooking.routes';
import mentorScheduleRoutes from './routes/mentorSchedule.routes';
import { healthCheck, detailedHealthCheck, readinessCheck, livenessCheck } from './controllers/health.controller';
// import darwinexRoutes from './routes/darwinex.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

const app: Application = express();
const PORT = config.server.port;

// Supabase connection via HTTPS (puerto 443 - no bloqueado por ISP)
connectSupabase()
  .then(() => logger.info('✅ Database Ready'))
  .catch((err) => {
    logger.error('❌ Supabase Connection Error:', err);
    logger.warn('⚠️ Server continuing without database');
  });

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Logging
if (config.server.isDevelopment) {
  app.use(morgan('dev'));
}

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Health checks
app.get('/health', healthCheck);  // Simple health check
app.get('/api/health', detailedHealthCheck);  // Detailed health with service checks
app.get('/ready', readinessCheck);  // Kubernetes readiness probe
app.get('/live', livenessCheck);  // Kubernetes liveness probe

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/lessons', lessonRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mentorships', mentorshipRoutes);
app.use('/api/mentorships/:mentorshipId/sessions', mentorshipSessionRoutes);
app.use('/api/mentorships', mentorshipSessionRoutes); // Para rutas sin mentorshipId (bookings)
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/mentorship-bookings', mentorshipBookingRoutes);
app.use('/api/mentor-schedules', mentorScheduleRoutes);
// app.use('/api/darwinex', darwinexRoutes); // Temporalmente deshabilitado

// Error handling
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// 🕒 Cron job: Cancelar transacciones pendientes antiguas cada 10 minutos
setInterval(async () => {
  try {
    const cancelled = await TransactionService.cancelExpiredPendingTransactions();
    if (cancelled > 0) {
      logger.info(`🧹 Auto-cancelled ${cancelled} expired pending transactions`);
    }
  } catch (error: any) {
    logger.error('Error in transaction cleanup cron:', error);
  }
}, 10 * 60 * 1000); // 10 minutos

// Start server
if (config.server.nodeEnv !== 'test') {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${config.server.nodeEnv}`);
    logger.info(`🔗 Database: PostgreSQL (Supabase)`);
  });
}

export default app;
