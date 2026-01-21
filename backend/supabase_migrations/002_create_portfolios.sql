-- Crear tabla portfolios con datos del frontend
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  strategy VARCHAR(255) NOT NULL,
  roi DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  win_rate DECIMAL(5, 2) DEFAULT 0,
  sharpe_ratio DECIMAL(5, 2) DEFAULT 0,
  drawdown DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_roi ON portfolios(roi DESC);

-- Insert portfolios from frontend (Darwinex section)
INSERT INTO portfolios (name, description, strategy, roi, total_trades, win_rate, sharpe_ratio, drawdown, status) VALUES
('PQT.Alpha', 'Estrategia Alpha con enfoque en momentum y mean reversion', 'Alpha Strategy', 24.5, 342, 68.4, 2.45, -8.2, 'active'),
('PQT.Momentum', 'Estrategia de momentum puro en acciones y futuros', 'Momentum', 18.3, 289, 64.2, 2.12, -6.1, 'active'),
('PQT.Conservative', 'Estrategia conservadora con bajo riesgo', 'Conservative', 12.7, 156, 59.8, 1.85, -4.3, 'active'),
('Scalping EUR/USD', 'Estrategia de scalping en pares mayores', 'Scalping', 23.5, 1247, 68.2, 2.10, -9.5, 'active'),
('Swing Trading S&P500', 'Trading de mediano plazo en índices', 'Swing Trading', 45.8, 89, 72.5, 2.80, -12.3, 'active'),
('Day Trading Bitcoin', 'Operativa intradía en criptomonedas', 'Day Trading', -5.2, 234, 58.1, 0.45, -18.7, 'archived')
ON CONFLICT DO NOTHING;
