-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL, -- 'new_user', 'payment_processed', 'new_course', 'new_enrollment', 'contact_message', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Usuario que generó la notificación (opcional)
    related_id UUID, -- ID del recurso relacionado (curso, pago, etc)
    metadata JSONB DEFAULT '{}', -- Información adicional
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- RLS Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Los admins pueden ver todas las notificaciones
CREATE POLICY "Admins can view all notifications"
    ON public.notifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Los admins pueden marcar notificaciones como leídas
CREATE POLICY "Admins can update notifications"
    ON public.notifications
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Solo el sistema puede crear notificaciones (vía backend)
CREATE POLICY "Service role can insert notifications"
    ON public.notifications
    FOR INSERT
    WITH CHECK (true);

-- Función para obtener el conteo de notificaciones no leídas
CREATE OR REPLACE FUNCTION get_unread_notifications_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.notifications WHERE is_read = FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios
COMMENT ON TABLE public.notifications IS 'Sistema de notificaciones para actividades del panel admin';
COMMENT ON COLUMN public.notifications.type IS 'Tipo de notificación: new_user, payment_processed, new_course, new_enrollment, contact_message';
COMMENT ON COLUMN public.notifications.metadata IS 'Datos adicionales en formato JSON (email, monto, nombre del curso, etc)';
