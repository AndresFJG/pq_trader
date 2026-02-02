/**
 * Tipos de la base de datos Supabase (PostgreSQL)
 * Generados desde el schema en backend/database/schema-supabase.sql
 */

// ============================================
// Enums de PostgreSQL
// ============================================

export type UserRole = 'user' | 'admin' | 'mentor';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'none';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type EnrollmentStatus = 'active' | 'completed' | 'suspended';
export type MentorshipType = 'individual' | 'group' | 'workshop';
export type MentorshipStatus = 'scheduled' | 'completed' | 'canceled' | 'pending';
export type TransactionType = 'stripe' | 'paypal' | 'other';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// ============================================
// Tablas de la Base de Datos
// ============================================

export interface User {
  id: number;
  _id?: number; // Alias para compatibilidad con código MongoDB
  name: string;
  email: string;
  password: string;
  role: UserRole;
  
  // Subscription
  subscription_status: SubscriptionStatus;
  subscription_tier: SubscriptionTier;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  paypal_subscription_id?: string;
  
  // Security
  login_attempts: number;
  lockout_until?: Date;
  password_changed_at: Date;
  
  // Email verification
  is_email_verified: boolean;
  email_verification_token?: string;
  email_verification_expire?: Date;
  
  // Password reset
  reset_password_token?: string;
  reset_password_expire?: Date;
  
  // Two-factor authentication
  two_factor_secret?: string;
  two_factor_enabled: boolean;
  
  // Activity tracking
  last_login_at?: Date;
  last_login_ip?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string;
  long_description?: string;
  instructor_id?: number;
  
  // Content
  category?: string;
  level: CourseLevel;
  duration_hours: number;
  thumbnail?: string;
  video_url?: string;
  
  // Pricing
  price: number;
  discount_price?: number;
  
  // Status
  is_published: boolean;
  enrollment_count: number;
  rating: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  content?: string;
  
  // Media
  video_url?: string;
  duration_minutes: number;
  
  // Order & Access
  order_index: number;
  is_free: boolean;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  
  // Progress
  progress: number;
  completed_lessons: number;
  total_lessons: number;
  
  // Status
  status: EnrollmentStatus;
  
  // Timestamps
  enrolled_at: Date;
  completed_at?: Date;
  last_accessed_at: Date;
}

export interface Mentorship {
  id: number;
  mentor_id: number;
  student_id: number;
  
  // Details
  title: string;
  description?: string;
  type: MentorshipType;
  duration_minutes: number;
  price: number;
  
  // Scheduling
  scheduled_at?: Date;
  completed_at?: Date;
  meeting_url?: string;
  
  // Status & Notes
  status: MentorshipStatus;
  notes?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: number;
  user_id: number;
  
  // Amount
  amount: number;
  currency: string;
  
  // Payment
  type: TransactionType;
  status: TransactionStatus;
  
  // Stripe IDs
  payment_intent_id?: string;
  subscription_id?: string;
  
  // PayPal IDs
  paypal_order_id?: string;
  paypal_capture_id?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  paid_at?: Date;
  refunded_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// Interfaces Auxiliares
// ============================================

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  strategy: string;
  roi: number;
  total_trades: number;
  win_rate: number;
  sharpe_ratio?: number;
  drawdown?: number;
  darwinex_url?: string;
  status: 'active' | 'archived';
  created_at: Date;
  updated_at: Date;
}

// ============================================
// Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
