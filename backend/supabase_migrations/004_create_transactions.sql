-- Insertar transacciones de ejemplo (tabla ya existe en schema)
-- Schema existente: id, user_id, amount, currency, type (stripe/paypal/other), 
-- status (pending/completed/failed/refunded), payment_intent_id, subscription_id,
-- paypal_order_id, paypal_capture_id, metadata, paid_at, refunded_at, created_at, updated_at

DO $$
BEGIN
  -- Solo insertar si hay usuarios
  IF EXISTS (SELECT 1 FROM users LIMIT 1) THEN
    -- Insertar transacciones de ejemplo si no existen
    IF NOT EXISTS (SELECT 1 FROM transactions LIMIT 1) THEN
      INSERT INTO transactions (user_id, amount, currency, type, status, payment_intent_id, paid_at, created_at, metadata) 
      SELECT 
        users.id,
        CASE (ROW_NUMBER() OVER ()) % 3
          WHEN 0 THEN 99.00
          WHEN 1 THEN 500.00
          ELSE 29.99
        END,
        'USD',
        CASE (ROW_NUMBER() OVER ()) % 2
          WHEN 0 THEN 'stripe'
          ELSE 'paypal'
        END::transaction_type,
        'completed'::transaction_status,
        'pi_' || substr(md5(random()::text), 1, 24),
        NOW() - (ROW_NUMBER() OVER ()) * INTERVAL '1 day',
        NOW() - (ROW_NUMBER() OVER ()) * INTERVAL '1 day',
        jsonb_build_object(
          'product_type', CASE (ROW_NUMBER() OVER ()) % 3
            WHEN 0 THEN 'course'
            WHEN 1 THEN 'mentorship'
            ELSE 'subscription'
          END,
          'product_name', CASE (ROW_NUMBER() OVER ()) % 3
            WHEN 0 THEN 'Trading para Principiantes'
            WHEN 1 THEN 'Mentoría 1-on-1'
            ELSE 'Premium Subscription'
          END
        )
      FROM users
      LIMIT 10;
    END IF;
  END IF;
END $$;
