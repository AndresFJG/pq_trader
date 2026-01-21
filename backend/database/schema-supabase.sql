-- ============================================
-- PQ Trader - Supabase Database Schema
-- PostgreSQL 14+
-- ============================================

-- Eliminar tablas si existen (en orden por dependencias)
DROP TABLE IF EXISTS token_blacklist CASCADE;
DROP TABLE IF EXISTS security_logs CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS mentorships CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Eliminar tipos ENUM si existen
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS subscription_tier CASCADE;
DROP TYPE IF EXISTS course_level CASCADE;
DROP TYPE IF EXISTS enrollment_status CASCADE;
DROP TYPE IF EXISTS mentorship_type CASCADE;
DROP TYPE IF EXISTS mentorship_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;

-- Tipos ENUM para PostgreSQL
CREATE TYPE user_role AS ENUM ('user', 'admin', 'mentor');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'none');
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'suspended');
CREATE TYPE mentorship_type AS ENUM ('individual', 'group', 'workshop');
CREATE TYPE mentorship_status AS ENUM ('scheduled', 'completed', 'canceled', 'pending');
CREATE TYPE transaction_type AS ENUM ('stripe', 'paypal', 'other');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- ============================================
-- Tabla: users
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  
  -- Subscription
  subscription_status subscription_status DEFAULT 'none',
  subscription_tier subscription_tier DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  paypal_subscription_id VARCHAR(255),
  
  -- Security
  login_attempts INTEGER DEFAULT 0,
  lockout_until TIMESTAMP,
  password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Email verification
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_expire TIMESTAMP,
  
  -- Password reset
  reset_password_token VARCHAR(255),
  reset_password_expire TIMESTAMP,
  
  -- Two-factor authentication
  two_factor_secret VARCHAR(255),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  
  -- Activity tracking
  last_login_at TIMESTAMP,
  last_login_ip VARCHAR(45),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);

-- ============================================
-- Tabla: courses
-- ============================================
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  instructor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- Content
  category VARCHAR(100),
  level course_level DEFAULT 'beginner',
  duration_hours INTEGER DEFAULT 0,
  thumbnail VARCHAR(500),
  video_url VARCHAR(500),
  
  -- Pricing
  price DECIMAL(10,2) DEFAULT 0,
  discount_price DECIMAL(10,2),
  
  -- Status
  is_published BOOLEAN DEFAULT FALSE,
  enrollment_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para courses
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_is_published ON courses(is_published);

-- ============================================
-- Tabla: lessons
-- ============================================
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  
  -- Media
  video_url VARCHAR(500),
  duration_minutes INTEGER DEFAULT 0,
  
  -- Order & Access
  order_index INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para lessons
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_order_index ON lessons(order_index);

-- ============================================
-- Tabla: enrollments
-- ============================================
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Progress
  progress INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  
  -- Status
  status enrollment_status DEFAULT 'active',
  
  -- Timestamps
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, course_id)
);

-- Índices para enrollments
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- ============================================
-- Tabla: mentorships
-- ============================================
CREATE TABLE mentorships (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type mentorship_type DEFAULT 'individual',
  duration_minutes INTEGER DEFAULT 60,
  price DECIMAL(10,2) DEFAULT 0,
  
  -- Scheduling
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  meeting_url VARCHAR(500),
  
  -- Status & Notes
  status mentorship_status DEFAULT 'pending',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mentorships
CREATE INDEX idx_mentorships_mentor_id ON mentorships(mentor_id);
CREATE INDEX idx_mentorships_student_id ON mentorships(student_id);
CREATE INDEX idx_mentorships_status ON mentorships(status);
CREATE INDEX idx_mentorships_scheduled_at ON mentorships(scheduled_at);

-- ============================================
-- Tabla: transactions
-- ============================================
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Amount
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Payment
  type transaction_type DEFAULT 'stripe',
  status transaction_status DEFAULT 'pending',
  
  -- Stripe IDs
  payment_intent_id VARCHAR(255),
  subscription_id VARCHAR(255),
  
  -- PayPal IDs
  paypal_order_id VARCHAR(255),
  paypal_capture_id VARCHAR(255),
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_payment_intent_id ON transactions(payment_intent_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ============================================
-- Tabla: security_logs
-- ============================================
CREATE TABLE security_logs (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para security_logs
CREATE INDEX idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX idx_security_logs_created_at ON security_logs(created_at);

-- ============================================
-- Tabla: token_blacklist
-- ============================================
CREATE TABLE token_blacklist (
  id SERIAL PRIMARY KEY,
  token VARCHAR(500) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para token_blacklist
CREATE INDEX idx_token_blacklist_token ON token_blacklist(token);
CREATE INDEX idx_token_blacklist_expires_at ON token_blacklist(expires_at);

-- ============================================
-- Datos iniciales
-- ============================================

-- Usuario administrador por defecto
INSERT INTO users (name, email, password, role, is_email_verified)
VALUES (
  'Admin PQ Trader',
  'admin@pqtrader.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lDxN.1rC1uPO', -- Admin123
  'admin',
  TRUE
);

-- ============================================
-- Funciones útiles
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentorships_updated_at BEFORE UPDATE ON mentorships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comentarios de documentación
-- ============================================
COMMENT ON TABLE users IS 'Usuarios del sistema con autenticación y suscripciones';
COMMENT ON TABLE courses IS 'Cursos de trading disponibles en la plataforma';
COMMENT ON TABLE lessons IS 'Lecciones individuales de cada curso';
COMMENT ON TABLE enrollments IS 'Inscripciones de usuarios en cursos con seguimiento de progreso';
COMMENT ON TABLE mentorships IS 'Sesiones de mentoría 1-on-1 o grupales';
COMMENT ON TABLE transactions IS 'Registro de todas las transacciones de pago';
COMMENT ON TABLE security_logs IS 'Logs de auditoría y seguridad';
COMMENT ON TABLE token_blacklist IS 'Tokens JWT invalidados (logout, cambio de contraseña)';
