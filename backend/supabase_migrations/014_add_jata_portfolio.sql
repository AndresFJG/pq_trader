-- ============================================================================
-- Agregar Portfolio JATA de Darwinex
-- ============================================================================
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Agregar columna darwinex_url si no existe
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS darwinex_url VARCHAR(500);

-- Paso 2: Insertar portfolio JATA
INSERT INTO portfolios (
  name, 
  description, 
  strategy, 
  roi, 
  total_trades, 
  win_rate, 
  sharpe_ratio, 
  drawdown, 
  darwinex_url,
  status
) VALUES (
  'JATA - Darwinex Zero',
  'Darwin JATA - Estrategia algorítmica verificada en Darwinex Zero. Rentabilidad anualizada del 14.78% con excelente gestión de riesgo. 388 operaciones con 51.03% de acierto y ratio de payoff 1.30. Asignación total recibida: 150,000€.',
  'Algorithmic Trading',
  17.62,  -- Rentabilidad total
  388,    -- Total operaciones
  51.03,  -- Win rate real
  1.55,   -- Ratio de Sharpe
  -5.58,  -- Drawdown máximo
  'https://www.darwinexzero.com/es/darwin/JATA/performance',  -- URL Darwinex
  'active'
)
ON CONFLICT DO NOTHING;

-- Verificar inserción
SELECT * FROM portfolios WHERE name LIKE '%JATA%';

-- ============================================================================
-- DATOS REALES DE JATA (01/02/2026):
-- ============================================================================
-- ✅ Rentabilidad total: 17.62%
-- ✅ Rentabilidad anualizada: 14.78%
-- ✅ Ratio de Sharpe: 1.55
-- ✅ Ratio de Sortino: 1.82
-- ✅ Drawdown máximo: -5.58%
-- ✅ Volatilidad anualizada: 9.54%
-- ✅ Total operaciones: 388
-- ✅ Win rate: 51.03%
-- ✅ Ratio de payoff: 1.30
-- ✅ Factor de beneficio: 1.36
-- ✅ Operación ganadora media: 0.34%
-- ✅ Operación perdedora media: -0.26%
-- ✅ Asignación total DarwinIA: 150,000€
-- ✅ Mejor posición DarwinIA SILVER: #1122
-- ============================================================================
