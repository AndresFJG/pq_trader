-- ============================================================================
-- ⚠️  SCRIPT MAESTRO - EJECUTAR PRIMERO EN SUPABASE SQL EDITOR
-- ============================================================================
-- Este script contiene TODAS las estructuras necesarias.
-- Ejecuta esto ANTES de las políticas RLS.
-- ============================================================================

-- Si hay errores sobre tablas que ya existen, eso está bien.
-- Si hay errores sobre columnas faltantes, necesitas este script.

-- ============================================================================
-- PASO 1: ELIMINAR ESTRUCTURA ANTIGUA (SOLO SI LO NECESITAS)
-- Descomenta esto SOLO si quieres borrar todo y empezar de cero
-- ============================================================================

-- DROP TABLE IF EXISTS token_blacklist CASCADE;
-- DROP TABLE IF EXISTS security_logs CASCADE;
-- DROP TABLE IF EXISTS mentorship_bookings CASCADE;
-- DROP TABLE IF EXISTS mentorship_sessions CASCADE;
-- DROP TABLE IF EXISTS portfolios CASCADE;
-- DROP TABLE IF EXISTS transactions CASCADE;
-- DROP TABLE IF EXISTS mentorships CASCADE;
-- DROP TABLE IF EXISTS enrollments CASCADE;
-- DROP TABLE IF EXISTS lessons CASCADE;
-- DROP TABLE IF EXISTS courses CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TYPE IF EXISTS user_role CASCADE;
-- DROP TYPE IF EXISTS subscription_status CASCADE;
-- DROP TYPE IF EXISTS subscription_tier CASCADE;
-- DROP TYPE IF EXISTS course_level CASCADE;
-- DROP TYPE IF EXISTS enrollment_status CASCADE;
-- DROP TYPE IF EXISTS mentorship_type CASCADE;
-- DROP TYPE IF EXISTS mentorship_status CASCADE;
-- DROP TYPE IF EXISTS transaction_type CASCADE;
-- DROP TYPE IF EXISTS transaction_status CASCADE;

-- ============================================================================
-- PASO 2: VERIFICAR Y CREAR ENUMS (tipos)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'mentor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'none');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE mentorship_type AS ENUM ('individual', 'group', 'workshop');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE mentorship_status AS ENUM ('scheduled', 'completed', 'canceled', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('stripe', 'paypal', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- PASO 3: CREAR TABLA USERS (base de todo)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  subscription_status subscription_status DEFAULT 'none',
  subscription_tier subscription_tier DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- PASO 4: CREAR TABLA COURSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  long_description TEXT,
  instructor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  category VARCHAR(100),
  level course_level DEFAULT 'beginner',
  duration_hours INTEGER DEFAULT 0,
  thumbnail VARCHAR(500),
  video_url TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  discount_price DECIMAL(10, 2),
  is_published BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);

-- ============================================================================
-- PASO 5: CREAR TABLA ENROLLMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  status enrollment_status DEFAULT 'active',
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);

-- ============================================================================
-- PASO 6: CREAR TABLA LESSONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  video_url TEXT,
  content TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON lessons(course_id, order_index);

-- ============================================================================
-- PASO 7: CREAR TABLA MENTORSHIPS
-- ============================================================================

CREATE TABLE IF NOT EXISTS mentorships (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  type mentorship_type DEFAULT 'individual',
  duration_minutes INTEGER,
  price DECIMAL(10, 2),
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  meeting_url TEXT,
  status mentorship_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(mentor_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_mentorships_mentor_id ON mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_student_id ON mentorships(student_id);

-- ============================================================================
-- PASO 8: CREAR TABLA MENTORSHIP_SESSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id SERIAL PRIMARY KEY,
  mentorship_id INTEGER NOT NULL REFERENCES mentorships(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER DEFAULT 1,
  current_participants INTEGER DEFAULT 0,
  meeting_link VARCHAR(500),
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_mentorship_id ON mentorship_sessions(mentorship_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_date ON mentorship_sessions(session_date);

-- ============================================================================
-- PASO 9: CREAR TABLA MENTORSHIP_BOOKINGS (LA IMPORTANTE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mentorship_bookings (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES mentorship_sessions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'confirmed',
  notes TEXT,
  payment_id INTEGER,
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  UNIQUE(session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_session_id ON mentorship_bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_user_id ON mentorship_bookings(user_id);

-- ============================================================================
-- PASO 10: CREAR TABLA PORTFOLIOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS portfolios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  strategy VARCHAR(255) NOT NULL,
  roi DECIMAL(10, 2) NOT NULL DEFAULT 0,
  performance DECIMAL(10, 2) DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  win_rate DECIMAL(5, 2) DEFAULT 0,
  sharpe_ratio DECIMAL(5, 2) DEFAULT 0,
  drawdown DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_public ON portfolios(is_public);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_roi ON portfolios(roi DESC);

-- ============================================================================
-- PASO 11: CREAR TABLA TRANSACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  type transaction_type DEFAULT 'stripe',
  status transaction_status DEFAULT 'pending',
  payment_id VARCHAR(255),
  payment_intent_id VARCHAR(255),
  subscription_id VARCHAR(255),
  paypal_order_id VARCHAR(255),
  paypal_capture_id VARCHAR(255),
  product_id INTEGER,
  product_name VARCHAR(255),
  product_type VARCHAR(50),
  metadata JSONB,
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_id ON transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_intent_id ON transactions(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id);

-- ============================================================================
-- PASO 12: CREAR TABLAS DE MENTOR SCHEDULES
-- ============================================================================

CREATE TABLE IF NOT EXISTS mentor_schedules (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Schedule details
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_sessions_per_day INTEGER DEFAULT 5,
  session_duration_minutes INTEGER DEFAULT 60,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  break_start TIME,
  break_end TIME,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_time CHECK (start_time < end_time)
);

CREATE TABLE IF NOT EXISTS mentor_unavailability (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Unavailable period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_period CHECK (start_date <= end_date)
);

CREATE INDEX IF NOT EXISTS idx_mentor_schedules_mentor_id ON mentor_schedules(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_schedules_day ON mentor_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_mentor_unavailability_mentor_id ON mentor_unavailability(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_unavailability_dates ON mentor_unavailability(start_date, end_date);

-- ============================================================================
-- ✅ FIN - Todas las tablas creadas exitosamente
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅✅✅ ESTRUCTURA BASE COMPLETA ✅✅✅';
  RAISE NOTICE 'Tablas creadas:';
  RAISE NOTICE '  ✓ users';
  RAISE NOTICE '  ✓ courses';
  RAISE NOTICE '  ✓ enrollments';
  RAISE NOTICE '  ✓ lessons';
  RAISE NOTICE '  ✓ mentorships';
  RAISE NOTICE '  ✓ mentorship_sessions';
  RAISE NOTICE '  ✓ mentorship_bookings';
  RAISE NOTICE '  ✓ portfolios';
  RAISE NOTICE '  ✓ transactions';
  RAISE NOTICE '  ✓ mentor_schedules';
  RAISE NOTICE '  ✓ mentor_unavailability';
  RAISE NOTICE '';
  RAISE NOTICE 'PRÓXIMO PASO: Ejecuta el archivo 010_enable_rls_policies_fixed.sql';
END $$;
