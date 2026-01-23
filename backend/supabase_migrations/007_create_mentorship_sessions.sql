-- Tabla de sesiones/horarios de mentorías (los espacios disponibles que crea el admin)
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id SERIAL PRIMARY KEY,
  mentorship_id INTEGER NOT NULL REFERENCES mentorships(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER DEFAULT 1, -- Para mentorías grupales
  current_participants INTEGER DEFAULT 0,
  meeting_link VARCHAR(500), -- Link de Zoom, Google Meet, etc.
  status VARCHAR(50) DEFAULT 'available', -- available, booked, completed, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas (bookings) de usuarios
CREATE TABLE IF NOT EXISTS mentorship_bookings (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES mentorship_sessions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, completed, cancelled, no_show
  notes TEXT, -- Notas del usuario al reservar
  payment_id INTEGER REFERENCES transactions(id), -- Referencia al pago
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  UNIQUE(session_id, user_id) -- Un usuario no puede reservar la misma sesión dos veces
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_mentorship_sessions_mentorship_id ON mentorship_sessions(mentorship_id);
CREATE INDEX idx_mentorship_sessions_date ON mentorship_sessions(session_date);
CREATE INDEX idx_mentorship_sessions_status ON mentorship_sessions(status);
CREATE INDEX idx_mentorship_bookings_session_id ON mentorship_bookings(session_id);
CREATE INDEX idx_mentorship_bookings_user_id ON mentorship_bookings(user_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_mentorship_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mentorship_sessions_updated_at_trigger
BEFORE UPDATE ON mentorship_sessions
FOR EACH ROW
EXECUTE FUNCTION update_mentorship_sessions_updated_at();

-- Función para actualizar el contador de participantes al crear/eliminar una reserva
CREATE OR REPLACE FUNCTION update_session_participants_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    -- Incrementar contador al confirmar reserva
    UPDATE mentorship_sessions
    SET current_participants = current_participants + 1,
        status = CASE 
          WHEN current_participants + 1 >= max_participants THEN 'booked'
          ELSE status
        END
    WHERE id = NEW.session_id;
  ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.status = 'cancelled' AND OLD.status = 'confirmed') THEN
    -- Decrementar contador al cancelar
    UPDATE mentorship_sessions
    SET current_participants = GREATEST(current_participants - 1, 0),
        status = CASE
          WHEN current_participants - 1 < max_participants AND status = 'booked' THEN 'available'
          ELSE status
        END
    WHERE id = COALESCE(NEW.session_id, OLD.session_id);
  END IF
;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_participants_trigger
AFTER INSERT OR UPDATE OR DELETE ON mentorship_bookings
FOR EACH ROW
EXECUTE FUNCTION update_session_participants_count();

-- Comentarios para documentación
COMMENT ON TABLE mentorship_sessions IS 'Sesiones/horarios disponibles para las mentorías';
COMMENT ON TABLE mentorship_bookings IS 'Reservas de usuarios para las sesiones de mentorías';
COMMENT ON COLUMN mentorship_sessions.max_participants IS 'Máximo de participantes (1 para individual, más para grupal)';
COMMENT ON COLUMN mentorship_sessions.current_participants IS 'Cantidad actual de participantes reservados';
COMMENT ON COLUMN mentorship_sessions.meeting_link IS 'Enlace de la reunión (Zoom, Google Meet, etc.)';
COMMENT ON COLUMN mentorship_bookings.payment_id IS 'ID de la transacción de pago si aplica';
