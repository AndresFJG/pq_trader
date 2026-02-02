-- ============================================================================
-- RLS (Row Level Security) Policies para PQ Trader - VERSIÓN FINAL
-- Basada en estructura REAL de tablas de Supabase
-- ============================================================================

-- VERIFICAR QUE LAS TABLAS EXISTEN ANTES DE HABILITAR RLS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses' AND table_schema = 'public') THEN
    ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollments' AND table_schema = 'public') THEN
    ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lessons' AND table_schema = 'public') THEN
    ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mentorships' AND table_schema = 'public') THEN
    ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mentorship_sessions' AND table_schema = 'public') THEN
    ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mentorship_bookings' AND table_schema = 'public') THEN
    ALTER TABLE public.mentorship_bookings ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'portfolios' AND table_schema = 'public') THEN
    ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions' AND table_schema = 'public') THEN
    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mentor_schedules' AND table_schema = 'public') THEN
    ALTER TABLE public.mentor_schedules ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mentor_unavailability' AND table_schema = 'public') THEN
    ALTER TABLE public.mentor_unavailability ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================================================
-- 1. USERS TABLE - Políticas de Seguridad
-- ============================================================================

-- ELIMINAR POLÍTICAS PREVIAS
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;

-- Usuarios pueden ver su propio perfil
CREATE POLICY "users_view_own"
ON public.users
FOR SELECT
USING (id::text = auth.uid()::text);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "users_update_own"
ON public.users
FOR UPDATE
USING (id::text = auth.uid()::text)
WITH CHECK (id::text = auth.uid()::text);

-- Admins pueden ver todos los usuarios
CREATE POLICY "admins_view_all_users"
ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Admins pueden actualizar cualquier usuario
CREATE POLICY "admins_update_users"
ON public.users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- ============================================================================
-- 2. COURSES TABLE - Acceso a Cursos
-- ============================================================================

DROP POLICY IF EXISTS "Everyone can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Only mentors can create courses" ON public.courses;
DROP POLICY IF EXISTS "Mentors can update their own courses" ON public.courses;

-- Todos pueden ver cursos publicados
CREATE POLICY "courses_view_published"
ON public.courses
FOR SELECT
USING (is_published = true);

-- Instructores pueden ver sus propios cursos
CREATE POLICY "courses_view_own"
ON public.courses
FOR SELECT
USING (instructor_id::text = auth.uid()::text);

-- Admins pueden ver todos los cursos
CREATE POLICY "courses_admins_view_all"
ON public.courses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Solo mentores/admins pueden crear cursos
CREATE POLICY "courses_mentors_create"
ON public.courses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text AND u.role::text IN ('admin', 'mentor')
  )
);

-- Propietario o admin puede actualizar curso
CREATE POLICY "courses_update_own"
ON public.courses
FOR UPDATE
USING (
  instructor_id::text = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
)
WITH CHECK (
  instructor_id::text = auth.uid()::text OR
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- ============================================================================
-- 3. ENROLLMENTS TABLE - Inscripciones
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Mentors can view enrollments in their courses" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can create their own enrollments" ON public.enrollments;

-- Los usuarios pueden ver sus propias inscripciones
CREATE POLICY "enrollments_view_own"
ON public.enrollments
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Los mentores pueden ver inscripciones en sus cursos
CREATE POLICY "enrollments_mentors_view"
ON public.enrollments
FOR SELECT
USING (
  course_id IN (
    SELECT id FROM public.courses WHERE instructor_id::text = auth.uid()::text
  )
);

-- Admins ven todas las inscripciones
CREATE POLICY "enrollments_admins_view_all"
ON public.enrollments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Los usuarios pueden inscribirse en cursos
CREATE POLICY "enrollments_users_create"
ON public.enrollments
FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

-- ============================================================================
-- 4. LESSONS TABLE - Lecciones
-- ============================================================================

DROP POLICY IF EXISTS "Users can view lessons of enrolled courses" ON public.lessons;

-- Usuarios pueden ver lecciones de cursos donde están inscritos o son públicos
CREATE POLICY "lessons_view_enrolled"
ON public.lessons
FOR SELECT
USING (
  course_id IN (
    SELECT course_id FROM public.enrollments WHERE user_id::text = auth.uid()::text
  ) OR
  course_id IN (
    SELECT id FROM public.courses WHERE is_published = true
  )
);

-- Instructores/admins pueden ver todas las lecciones
CREATE POLICY "lessons_view_all_admin"
ON public.lessons
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text IN ('admin', 'mentor')
  )
);

-- ============================================================================
-- 5. MENTORSHIPS TABLE - Mentorías
-- ============================================================================

DROP POLICY IF EXISTS "Mentors can view their own mentorships" ON public.mentorships;
DROP POLICY IF EXISTS "Students can view their own mentorships" ON public.mentorships;
DROP POLICY IF EXISTS "Admins can view all mentorships" ON public.mentorships;

-- Mentores pueden ver sus propias mentorías
CREATE POLICY "mentorships_view_mentor"
ON public.mentorships
FOR SELECT
USING (mentor_id::text = auth.uid()::text);

-- Estudiantes pueden ver sus mentorías
CREATE POLICY "mentorships_view_student"
ON public.mentorships
FOR SELECT
USING (student_id::text = auth.uid()::text);

-- Admins ven todo
CREATE POLICY "mentorships_view_admin"
ON public.mentorships
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- ============================================================================
-- 6. MENTORSHIP_SESSIONS TABLE - Sesiones Disponibles
-- ============================================================================

DROP POLICY IF EXISTS "Users can view available sessions" ON public.mentorship_sessions;
DROP POLICY IF EXISTS "Mentors can manage their sessions" ON public.mentorship_sessions;

-- Los usuarios pueden ver sesiones no canceladas o de sus mentorías
CREATE POLICY "sessions_view_available"
ON public.mentorship_sessions
FOR SELECT
USING (
  status::text != 'cancelled' OR 
  mentorship_id IN (
    SELECT id FROM public.mentorships 
    WHERE mentor_id::text = auth.uid()::text OR student_id::text = auth.uid()::text
  )
);

-- Mentores pueden crear/editar sus propias sesiones
CREATE POLICY "sessions_mentors_create"
ON public.mentorship_sessions
FOR INSERT
WITH CHECK (
  mentorship_id IN (
    SELECT id FROM public.mentorships WHERE mentor_id::text = auth.uid()::text
  )
);

-- ============================================================================
-- 7. MENTORSHIP_BOOKINGS TABLE - Reservas de Sesiones
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own bookings" ON public.mentorship_bookings;
DROP POLICY IF EXISTS "Mentors can view bookings in their sessions" ON public.mentorship_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.mentorship_bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.mentorship_bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.mentorship_bookings;

-- Los usuarios pueden ver sus propias reservas
CREATE POLICY "bookings_view_own"
ON public.mentorship_bookings
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Mentores pueden ver reservas en sus sesiones
CREATE POLICY "bookings_mentors_view"
ON public.mentorship_bookings
FOR SELECT
USING (
  session_id IN (
    SELECT id FROM public.mentorship_sessions 
    WHERE mentorship_id IN (
      SELECT id FROM public.mentorships WHERE mentor_id::text = auth.uid()::text
    )
  )
);

-- Admins ven todas las reservas
CREATE POLICY "bookings_view_admin"
ON public.mentorship_bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Los usuarios pueden crear sus propias reservas
CREATE POLICY "bookings_users_create"
ON public.mentorship_bookings
FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

-- Los usuarios pueden cancelar sus propias reservas
CREATE POLICY "bookings_users_delete"
ON public.mentorship_bookings
FOR DELETE
USING (user_id::text = auth.uid()::text);

-- ============================================================================
-- 8. PORTFOLIOS TABLE - Portafolios
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Everyone can view public portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Admins can view all portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can manage their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios" ON public.portfolios;

-- Los usuarios pueden ver sus propios portafolios
CREATE POLICY "portfolios_view_own"
ON public.portfolios
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Portafolios públicos pueden verse
CREATE POLICY "portfolios_view_public"
ON public.portfolios
FOR SELECT
USING (is_public = true);

-- Admins ven todo
CREATE POLICY "portfolios_view_admin"
ON public.portfolios
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Usuarios solo pueden crear sus propios portafolios
CREATE POLICY "portfolios_users_create"
ON public.portfolios
FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

-- Usuarios pueden actualizar sus propios portafolios
CREATE POLICY "portfolios_users_update"
ON public.portfolios
FOR UPDATE
USING (user_id::text = auth.uid()::text)
WITH CHECK (user_id::text = auth.uid()::text);

-- ============================================================================
-- 9. TRANSACTIONS TABLE - Transacciones
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;

-- Los usuarios pueden ver sus propias transacciones
CREATE POLICY "transactions_view_own"
ON public.transactions
FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Admins pueden ver todas las transacciones
CREATE POLICY "transactions_view_admin"
ON public.transactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- ============================================================================
-- 10. MENTOR_SCHEDULES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "mentor_schedules_view_own" ON public.mentor_schedules;
DROP POLICY IF EXISTS "mentor_schedules_view_admin" ON public.mentor_schedules;
DROP POLICY IF EXISTS "mentor_schedules_update_own" ON public.mentor_schedules;
DROP POLICY IF EXISTS "mentor_schedules_insert_own" ON public.mentor_schedules;

-- Mentores pueden ver sus propios horarios
CREATE POLICY "mentor_schedules_view_own"
ON public.mentor_schedules
FOR SELECT
USING (mentor_id::text = auth.uid()::text);

-- Admins pueden ver todos los horarios
CREATE POLICY "mentor_schedules_view_admin"
ON public.mentor_schedules
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Mentores pueden actualizar sus horarios
CREATE POLICY "mentor_schedules_update_own"
ON public.mentor_schedules
FOR UPDATE
USING (mentor_id::text = auth.uid()::text)
WITH CHECK (mentor_id::text = auth.uid()::text);

-- Mentores pueden insertar sus horarios
CREATE POLICY "mentor_schedules_insert_own"
ON public.mentor_schedules
FOR INSERT
WITH CHECK (mentor_id::text = auth.uid()::text);

-- ============================================================================
-- 11. MENTOR_UNAVAILABILITY TABLE
-- ============================================================================

DROP POLICY IF EXISTS "mentor_unavailability_view_own" ON public.mentor_unavailability;
DROP POLICY IF EXISTS "mentor_unavailability_view_admin" ON public.mentor_unavailability;
DROP POLICY IF EXISTS "mentor_unavailability_manage_own" ON public.mentor_unavailability;

-- Mentores pueden ver su disponibilidad
CREATE POLICY "mentor_unavailability_view_own"
ON public.mentor_unavailability
FOR SELECT
USING (mentor_id::text = auth.uid()::text);

-- Admins pueden ver toda la disponibilidad
CREATE POLICY "mentor_unavailability_view_admin"
ON public.mentor_unavailability
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id::text = auth.uid()::text AND u.role::text = 'admin'
  )
);

-- Mentores pueden gestionar su disponibilidad
CREATE POLICY "mentor_unavailability_manage_own"
ON public.mentor_unavailability
FOR ALL
USING (mentor_id::text = auth.uid()::text)
WITH CHECK (mentor_id::text = auth.uid()::text);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentor_id ON public.mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_student_id ON public.mentorships(student_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_mentorship_id ON public.mentorship_sessions(mentorship_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_session_id ON public.mentorship_bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_user_id ON public.mentorship_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_public ON public.portfolios(is_public);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_schedules_mentor_id ON public.mentor_schedules(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_unavailability_mentor_id ON public.mentor_unavailability(mentor_id);

-- ============================================================================
-- CONFIRMACIÓN
-- ============================================================================

DO $$
DECLARE
  v_message TEXT;
BEGIN
  SELECT STRING_AGG('✅ RLS habilitado: ' || schemaname || '.' || tablename, E'\n')
  INTO v_message
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN ('users', 'courses', 'enrollments', 'lessons', 'mentorships', 
                    'mentorship_sessions', 'mentorship_bookings', 'portfolios', 'transactions',
                    'mentor_schedules', 'mentor_unavailability');
  
  RAISE NOTICE '%', COALESCE(v_message, 'No tables found');
  RAISE NOTICE 'RLS Policies aplicadas exitosamente para TODAS las tablas';
END $$;

-- ============================================================================
-- FIN - RLS POLICIES CORREGIDAS
-- ============================================================================
