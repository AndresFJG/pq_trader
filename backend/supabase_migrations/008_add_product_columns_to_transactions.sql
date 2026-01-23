-- Agregar columnas de producto a la tabla transactions
-- Para mostrar información detallada en el dashboard de admin

ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS product_id INTEGER,
ADD COLUMN IF NOT EXISTS product_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS product_type VARCHAR(50);

-- Crear índice para búsqueda por producto
CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product_type ON transactions(product_type);

-- Comentarios
COMMENT ON COLUMN transactions.product_id IS 'ID del producto comprado (curso, mentoría, etc.)';
COMMENT ON COLUMN transactions.product_name IS 'Nombre del producto comprado';
COMMENT ON COLUMN transactions.product_type IS 'Tipo de producto: course, mentorship, portfolio, etc.';
