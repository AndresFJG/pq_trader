-- Insertar datos de cursos actualizados
-- Tabla courses ya existe con columnas: id, title, slug, description, long_description, instructor_id, 
-- category, level, duration_hours, thumbnail, video_url, price, discount_price, is_published, 
-- enrollment_count, rating, created_at, updated_at

-- Obtener o crear instructor por defecto
DO $$
DECLARE
  default_instructor_id INTEGER;
BEGIN
  -- Intentar obtener un admin o mentor existente
  SELECT id INTO default_instructor_id 
  FROM users 
  WHERE role IN ('admin', 'mentor') 
  LIMIT 1;
  
  -- Si no hay admin/mentor, crear uno temporal
  IF default_instructor_id IS NULL THEN
    INSERT INTO users (name, email, password, role)
    VALUES ('PQ Trader Admin', 'admin@pqtrader.com', '$2b$10$placeholder', 'admin')
    RETURNING id INTO default_instructor_id;
    
    RAISE NOTICE 'Created default instructor with ID: %', default_instructor_id;
  END IF;
  
  -- Insertar cursos con el instructor_id
  INSERT INTO courses (instructor_id, title, slug, description, long_description, level, price, duration_hours, thumbnail, is_published, enrollment_count, rating, category) VALUES
(
  default_instructor_id,
  'Curso Básico de Trading Algorítmico', 
  'curso-basico-trading-algoritmico', 
  'Este curso está diseñado para guiarte desde los fundamentos del mercado hasta la puesta en marcha de sistemas automáticos. Aprenderás a eliminar el factor emocional, validar tus estrategias con rigor estadístico y dominar las herramientas profesionales que utilizan los traders cuantitativos.', 
  'Este curso está diseñado para guiarte desde los fundamentos del mercado hasta la puesta en marcha de sistemas automáticos. Aprenderás a eliminar el factor emocional, validar tus estrategias con rigor estadístico y dominar las herramientas profesionales que utilizan los traders cuantitativos.

Módulos:
• Módulo 1: Fundamentos del enfoque cuantitativo y microestructura
• Módulo 2: Operativa técnica y gestión de plataforma (MT5)
• Módulo 3: Construcción lógica de estrategias y gestión de riesgo
• Módulo 4: Evaluación estadística y análisis de métricas de rendimiento
• Módulo 5: Pruebas de robustez y validación de datos no vistos
• Módulo 6: Implementación en real, monitoreo y mejora continua

El objetivo: Pasar de la intuición a la evidencia estadística mediante la automatización.', 
  'beginner', 
  290.00, 
  6, 
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3', 
  TRUE, 
  245, 
  4.9, 
  'Trading Algorítmico'
),
(default_instructor_id,
  
  'StrategyQuant Masterclass', 
  'strategyquant-masterclass', 
  'Aprende a crear estrategias de trading algorítmico sin necesidad de programar. En este curso introductorio conocerás StrategyQuant desde cero: su interfaz, lógica de generación de estrategias, evaluación de resultados y exportación a plataformas de trading.', 
  'Aprende a crear estrategias de trading algorítmico sin necesidad de programar. En este curso introductorio conocerás StrategyQuant desde cero: su interfaz, lógica de generación de estrategias, evaluación de resultados y exportación a plataformas de trading. Ideal para traders que quieren dar sus primeros pasos en la automatización de forma práctica y estructurada.

Módulos:
• Módulo 1: Fundamentos y Flujo de Trabajo - Introducción al ecosistema de StrategyQuant y la lógica de generación automática de estrategias
• Módulo 2: Configuración y Gestión de Datos - Manejo de la interfaz, carga de datos históricos de calidad y configuración técnica del entorno
• Módulo 3: Motor de Generación - Uso de bloques lógicos, indicadores y reglas de entrada/salida para la creación autónoma de sistemas
• Módulo 4: Evaluación y Robustez - Funciones básicas del retester y optimizador
• Módulo 5: Exportación e Implementación - Paso de la estrategia al mercado real mediante la exportación a MetaTrader o TradeStation', 
  'intermediate', 
  300.00, 
  5, 
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f', 
  TRUE, 
  189, 
  4.9, 
  'StrategyQuant'
),
(default_instructor_id,
  
  'FXDreema Masterclass', 
  'fxdreema-masterclass', 
  'Transforma tus ideas en sistemas de trading automatizados profesionales sin necesidad de programar código complejo.', 
  'Transforma tus ideas en sistemas de trading automatizados profesionales sin necesidad de programar código complejo.

Este curso integral te guía paso a paso a través de tres niveles clave para dominar fxDreema:

• Fundamentos y Lógica: Aprende los conceptos básicos de programación, tipos de variables (Bool, Double, Int) y el desarrollo de indicadores personalizados mediante señales de buffer

• Mecánicas Operativas: Domina el funcionamiento de fxDreema a través de sus eventos (On Tick, On Trade, On Timer) y el uso de bloques esenciales como filtros de tiempo, acciones de trading y gestión de riesgos (Trailing Stop y Breakeven)

• Estrategias Avanzadas: Diseña estrategias compuestas (Trend Follow, Scalping, Grid) con un enfoque en el mercado real, considerando factores críticos como el spread, el slippage y la optimización para obtener un edge estadístico sólido

Objetivo del curso: Al finalizar, serás capaz de construir, conectar y optimizar EAs robustos listos para operar con fundamentos técnicos y realistas en el mercado en vivo.', 
  'beginner', 
  600.00, 
  10, 
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 
  TRUE, 
  156, 
  4.8, 
  'fxDreema'
),
(default_instructor_id,
  
  'De la teoría al mercado real: Datos, Optimización y Robustez', 
  'teoria-mercado-real-datos-optimizacion-robustez', 
  'Evoluciona del simple desarrollo de algoritmos hacia la arquitectura de sistemas validados bajo procesos de rigor estadístico y robustez técnica', 
  'Evoluciona del simple desarrollo de algoritmos hacia la arquitectura de sistemas validados bajo procesos de rigor estadístico y robustez técnica.

Este curso avanzado está diseñado para traders que buscan profesionalizar sus sistemas mediante el rigor estadístico y la validación de datos. Aprenderás a diferenciar una curva de beneficios "maquillada" de un sistema verdaderamente robusto.

• Optimización Profesional y WFA: Domina el Walk Forward Analysis para validar tus estrategias y evitar el overfitting (sobreoptimización), asegurando que tu sistema funcione fuera del histórico

• Calidad de Datos y Robustez: Aprende a trabajar con datos de alta precisión y utiliza Tests de Montecarlo para medir la probabilidad de éxito y la resistencia de tu edge estadístico

• Gestión de Portafolios: Utiliza herramientas como QuantAnalyzer para combinar sistemas, analizar correlaciones y construir carteras diversificadas que minimicen el riesgo

• Implementación en Vivo: Todo lo necesario para el salto al mercado real: configuración de VPS, auditoría de cuentas y análisis de performance en tiempo real

El objetivo: Desarrollar un criterio analítico avanzado para validar la viabilidad de estrategias algorítmicas, mitigando el sesgo de sobreajuste (overfitting) y optimizando la gestión de carteras bajo estándares profesionales.', 
  'advanced', 
  600.00, 
  10, 
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71', 
  TRUE, 
  98, 
  4.9, 
  'Análisis Avanzado'
)
ON CONFLICT (slug) DO NOTHING;

  RAISE NOTICE 'Cursos insertados exitosamente';
END $$;
