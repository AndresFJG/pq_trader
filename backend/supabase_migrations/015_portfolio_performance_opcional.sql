-- ============================================================================
-- OPCIONAL: Tabla para datos históricos de portfolios
-- ============================================================================
-- Esto permitirá gráficos precisos mes a mes

CREATE TABLE IF NOT EXISTS portfolio_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  period_date DATE NOT NULL,
  return_percentage DECIMAL(10, 2) NOT NULL,
  cumulative_return DECIMAL(10, 2),
  equity DECIMAL(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(portfolio_id, period_date)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_performance_portfolio 
ON portfolio_performance(portfolio_id, period_date DESC);

-- ============================================================================
-- NOTA: Esta tabla es OPCIONAL
-- El frontend actual genera gráficos automáticamente dividiendo ROI/12
-- Usa esto solo si quieres gráficos históricos precisos mes a mes
-- ============================================================================
