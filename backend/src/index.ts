import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Cargar variables de entorno PRIMERO
dotenv.config();

import { connectSupabase } from './config/supabase';
import { closeDatabase } from './config/database';
import { logger } from './utils/logger';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import dashboardRoutes from './routes/dashboard.routes';
import mentorshipRoutes from './routes/mentorship.routes';
import portfolioRoutes from './routes/portfolio.routes';
import transactionRoutes from './routes/transaction.routes';
// import paymentRoutes from './routes/paymentRoutes';
// import darwinexRoutes from './routes/darwinex.routes';
// import stripeRoutes from './routes/stripe.routes';
// import paypalRoutes from './routes/paypal.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

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
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mentorships', mentorshipRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
// app.use('/api/payments', paymentRoutes); // Temporalmente deshabilitado
// app.use('/api/darwinex', darwinexRoutes); // Temporalmente deshabilitado
// app.use('/api/stripe', stripeRoutes); // Temporalmente deshabilitado
// app.use('/api/paypal', paypalRoutes); // Temporalmente deshabilitado

// Error handling
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing HTTP server and database...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Closing HTTP server and database...');
  await closeDatabase();
  process.exit(0);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 Database: PostgreSQL (Supabase)`);
  });
}

export default app;
