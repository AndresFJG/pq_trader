-- Migration 016: Create blog posts table
-- Description: Creates table for storing blog articles with multi-language support

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    -- Spanish content
    title_es VARCHAR(500) NOT NULL,
    excerpt_es TEXT NOT NULL,
    content_es TEXT NOT NULL,
    
    -- English content
    title_en VARCHAR(500) NOT NULL,
    excerpt_en TEXT NOT NULL,
    content_en TEXT NOT NULL,
    
    -- Metadata
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    read_time VARCHAR(20) NOT NULL,
    cover_image TEXT,
    
    -- SEO fields
    meta_description_es TEXT,
    meta_description_en TEXT,
    meta_keywords TEXT[] DEFAULT '{}',
    
    -- Status and visibility
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_posts_updated_at();

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can read published posts
CREATE POLICY "Public can view published blog posts"
    ON blog_posts FOR SELECT
    USING (status = 'published');

-- Only authenticated users with admin role can insert/update/delete
CREATE POLICY "Admins can manage blog posts"
    ON blog_posts FOR ALL
    USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Insert initial blog posts
INSERT INTO blog_posts (
    slug,
    title_es,
    excerpt_es,
    content_es,
    title_en,
    excerpt_en,
    content_en,
    author,
    category,
    read_time,
    cover_image,
    status,
    featured,
    published_at
) VALUES 
(
    'introduccion-trading-algoritmico',
    'Cómo Empezar con Trading Algorítmico en 2025',
    'Guía completa para principiantes que quieren adentrarse en el mundo del trading algorítmico.',
    '<h2>Introducción al Trading Algorítmico</h2>
<p>El trading algorítmico ha revolucionado la forma en que operamos en los mercados financieros. En esta guía completa, aprenderás los fundamentos esenciales para comenzar tu camino en el trading automatizado.</p>

<h3>¿Qué es el Trading Algorítmico?</h3>
<p>El trading algorítmico es la ejecución automática de operaciones en los mercados financieros mediante programas informáticos que siguen un conjunto predefinido de instrucciones (algoritmo). Estos algoritmos pueden analizar datos del mercado, identificar oportunidades de trading y ejecutar operaciones sin intervención humana.</p>

<h3>Ventajas del Trading Algorítmico</h3>
<ul>
  <li><strong>Velocidad:</strong> Los algoritmos pueden analizar datos y ejecutar operaciones en milisegundos</li>
  <li><strong>Precisión:</strong> Elimina errores humanos en la ejecución de órdenes</li>
  <li><strong>Disciplina:</strong> Sigue el plan de trading sin emociones</li>
  <li><strong>Backtesting:</strong> Prueba estrategias con datos históricos antes de arriesgar capital real</li>
  <li><strong>Diversificación:</strong> Opera múltiples estrategias y mercados simultáneamente</li>
</ul>

<h3>Primeros Pasos</h3>
<p>Para comenzar en el trading algorítmico necesitas:</p>
<ol>
  <li>Conocimientos básicos de trading y mercados financieros</li>
  <li>Fundamentos de programación (Python es el lenguaje más popular)</li>
  <li>Una plataforma de backtesting (MetaTrader, QuantConnect, Backtrader)</li>
  <li>Comprensión de análisis técnico y gestión de riesgo</li>
</ol>

<h3>Herramientas Esenciales</h3>
<p><strong>Python:</strong> El lenguaje más utilizado por su simplicidad y potentes librerías como Pandas, NumPy y TA-Lib.</p>
<p><strong>MetaTrader 4/5:</strong> Plataformas populares con soporte para automatización mediante MQL.</p>
<p><strong>Jupyter Notebooks:</strong> Ideales para desarrollo, análisis y documentación de estrategias.</p>

<h3>Tu Primera Estrategia</h3>
<p>Comienza con estrategias simples basadas en indicadores técnicos conocidos. Una estrategia de cruce de medias móviles es un excelente punto de partida. Aprende a codificarla, backtestearla y optimizarla antes de pasar a estrategias más complejas.</p>

<h3>Conclusión</h3>
<p>El trading algorítmico ofrece oportunidades increíbles, pero requiere dedicación para aprender. Comienza con lo básico, practica con datos históricos y nunca arriesgues capital real hasta que tu estrategia haya demostrado ser consistente en backtesting.</p>',
    'How to Start with Algorithmic Trading in 2025',
    'Complete guide for beginners who want to dive into the world of algorithmic trading.',
    '<h2>Introduction to Algorithmic Trading</h2>
<p>Algorithmic trading has revolutionized how we operate in financial markets. In this comprehensive guide, you''ll learn the essential fundamentals to start your journey in automated trading.</p>

<h3>What is Algorithmic Trading?</h3>
<p>Algorithmic trading is the automatic execution of operations in financial markets through computer programs that follow a predefined set of instructions (algorithm). These algorithms can analyze market data, identify trading opportunities, and execute operations without human intervention.</p>

<h3>Advantages of Algorithmic Trading</h3>
<ul>
  <li><strong>Speed:</strong> Algorithms can analyze data and execute trades in milliseconds</li>
  <li><strong>Precision:</strong> Eliminates human errors in order execution</li>
  <li><strong>Discipline:</strong> Follows the trading plan without emotions</li>
  <li><strong>Backtesting:</strong> Test strategies with historical data before risking real capital</li>
  <li><strong>Diversification:</strong> Operate multiple strategies and markets simultaneously</li>
</ul>

<h3>Getting Started</h3>
<p>To begin in algorithmic trading you need:</p>
<ol>
  <li>Basic knowledge of trading and financial markets</li>
  <li>Programming fundamentals (Python is the most popular language)</li>
  <li>A backtesting platform (MetaTrader, QuantConnect, Backtrader)</li>
  <li>Understanding of technical analysis and risk management</li>
</ol>

<h3>Essential Tools</h3>
<p><strong>Python:</strong> The most used language for its simplicity and powerful libraries like Pandas, NumPy, and TA-Lib.</p>
<p><strong>MetaTrader 4/5:</strong> Popular platforms with automation support through MQL.</p>
<p><strong>Jupyter Notebooks:</strong> Ideal for development, analysis, and strategy documentation.</p>

<h3>Your First Strategy</h3>
<p>Start with simple strategies based on known technical indicators. A moving average crossover strategy is an excellent starting point. Learn to code it, backtest it, and optimize it before moving to more complex strategies.</p>

<h3>Conclusion</h3>
<p>Algorithmic trading offers incredible opportunities but requires dedication to learn. Start with the basics, practice with historical data, and never risk real capital until your strategy has proven consistent in backtesting.</p>',
    'Carlos Martínez',
    'Principiantes',
    '8 min',
    'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&h=600&fit=crop',
    'published',
    TRUE,
    '2025-12-10 10:00:00+00'
),
(
    'python-vs-r-trading',
    'Python vs R: ¿Cuál es Mejor para Trading?',
    'Comparativa detallada entre Python y R para análisis cuantitativo y desarrollo de estrategias.',
    '<h2>Python vs R para Trading Cuantitativo</h2>
<p>Python y R son los dos lenguajes más populares en el mundo del trading cuantitativo. Ambos tienen fortalezas únicas, pero ¿cuál deberías elegir para tu proyecto de trading algorítmico?</p>

<h3>Python: El Rey del Trading Algorítmico</h3>
<p>Python se ha convertido en el estándar de facto para trading algorítmico profesional. Sus ventajas incluyen:</p>
<ul>
  <li><strong>Ecosistema completo:</strong> Pandas, NumPy, scikit-learn, TensorFlow para análisis y ML</li>
  <li><strong>Integración con brokers:</strong> APIs nativas para Interactive Brokers, Alpaca, Binance</li>
  <li><strong>Deployment:</strong> Fácil de poner en producción en servidores cloud</li>
  <li><strong>Comunidad masiva:</strong> Millones de desarrolladores y recursos de aprendizaje</li>
</ul>

<h3>R: El Especialista en Estadística</h3>
<p>R brilla en análisis estadístico avanzado y visualización de datos:</p>
<ul>
  <li><strong>Análisis estadístico:</strong> Modelos econométricos y series temporales superiores</li>
  <li><strong>Visualización:</strong> ggplot2 ofrece gráficos de calidad publication-ready</li>
  <li><strong>Quantmod y TTR:</strong> Librerías especializadas en análisis técnico</li>
  <li><strong>RStudio:</strong> IDE excelente para investigación y análisis exploratorio</li>
</ul>

<h3>¿Cuál Elegir?</h3>
<p><strong>Elige Python si:</strong></p>
<ul>
  <li>Quieres ejecutar estrategias en tiempo real</li>
  <li>Necesitas integración con APIs de brokers</li>
  <li>Planeas usar Machine Learning</li>
  <li>Buscas escalabilidad y deployment en producción</li>
</ul>

<p><strong>Elige R si:</strong></p>
<ul>
  <li>Tu enfoque es puramente research y backtesting</li>
  <li>Necesitas modelos estadísticos avanzados</li>
  <li>Priorizas la visualización de datos</li>
  <li>Trabajas principalmente en análisis exploratorio</li>
</ul>

<h3>La Mejor Opción: Ambos</h3>
<p>Muchos quants profesionales usan ambos lenguajes: R para investigación y análisis exploratorio, Python para producción y trading en vivo. Esta combinación te da lo mejor de ambos mundos.</p>',
    'Python vs R: Which is Better for Trading?',
    'Detailed comparison between Python and R for quantitative analysis and strategy development.',
    '<h2>Python vs R for Quantitative Trading</h2>
<p>Python and R are the two most popular languages in the world of quantitative trading. Both have unique strengths, but which should you choose for your algorithmic trading project?</p>

<h3>Python: The King of Algorithmic Trading</h3>
<p>Python has become the de facto standard for professional algorithmic trading. Its advantages include:</p>
<ul>
  <li><strong>Complete ecosystem:</strong> Pandas, NumPy, scikit-learn, TensorFlow for analysis and ML</li>
  <li><strong>Broker integration:</strong> Native APIs for Interactive Brokers, Alpaca, Binance</li>
  <li><strong>Deployment:</strong> Easy to put in production on cloud servers</li>
  <li><strong>Massive community:</strong> Millions of developers and learning resources</li>
</ul>

<h3>R: The Statistics Specialist</h3>
<p>R shines in advanced statistical analysis and data visualization:</p>
<ul>
  <li><strong>Statistical analysis:</strong> Superior econometric models and time series</li>
  <li><strong>Visualization:</strong> ggplot2 offers publication-ready quality charts</li>
  <li><strong>Quantmod and TTR:</strong> Specialized libraries for technical analysis</li>
  <li><strong>RStudio:</strong> Excellent IDE for research and exploratory analysis</li>
</ul>

<h3>Which to Choose?</h3>
<p><strong>Choose Python if:</strong></p>
<ul>
  <li>You want to execute strategies in real-time</li>
  <li>You need integration with broker APIs</li>
  <li>You plan to use Machine Learning</li>
  <li>You seek scalability and production deployment</li>
</ul>

<p><strong>Choose R if:</strong></p>
<ul>
  <li>Your focus is purely research and backtesting</li>
  <li>You need advanced statistical models</li>
  <li>You prioritize data visualization</li>
  <li>You work mainly in exploratory analysis</li>
</ul>

<h3>The Best Option: Both</h3>
<p>Many professional quants use both languages: R for research and exploratory analysis, Python for production and live trading. This combination gives you the best of both worlds.</p>',
    'Ana García',
    'Herramientas',
    '6 min',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop',
    'published',
    FALSE,
    '2025-12-08 14:30:00+00'
),
(
    'machine-learning-trading-casos-reales',
    'Machine Learning en Trading: Casos Reales',
    'Exploramos 5 casos de uso reales de ML en trading algorítmico con ejemplos de código.',
    '<h2>Machine Learning Aplicado al Trading</h2>
<p>El Machine Learning está transformando el trading cuantitativo. Descubre cómo los algoritmos de aprendizaje automático pueden mejorar tus estrategias de trading.</p>

<h3>Caso 1: Predicción de Dirección de Precios</h3>
<p>Los modelos de clasificación como Random Forest y XGBoost pueden predecir si el precio subirá o bajará en el próximo período:</p>
<ul>
  <li>Features: Indicadores técnicos, volumen, spreads, volatilidad</li>
  <li>Target: Dirección del precio (1: sube, 0: baja)</li>
  <li>Precisión típica: 55-60% (suficiente para rentabilidad con buena gestión de riesgo)</li>
</ul>

<h3>Caso 2: Detección de Anomalías</h3>
<p>Algoritmos de clustering (K-means, DBSCAN) identifican patrones inusuales en el mercado:</p>
<ul>
  <li>Detectar manipulación de precios</li>
  <li>Identificar cambios de régimen de mercado</li>
  <li>Encontrar oportunidades de arbitraje</li>
</ul>

<h3>Caso 3: Optimización de Parámetros</h3>
<p>Algoritmos genéticos y Bayesian Optimization mejoran los parámetros de tus estrategias:</p>
<ul>
  <li>Encuentra la mejor combinación de períodos para indicadores</li>
  <li>Optimiza stop-loss y take-profit dinámicos</li>
  <li>Evita overfitting con validación cruzada walk-forward</li>
</ul>

<h3>Caso 4: Sentiment Analysis</h3>
<p>NLP (Natural Language Processing) analiza noticias y redes sociales:</p>
<ul>
  <li>Procesa miles de tweets y artículos en tiempo real</li>
  <li>Clasifica sentimiento (positivo, negativo, neutral)</li>
  <li>Genera señales de trading basadas en cambios de sentimiento</li>
</ul>

<h3>Caso 5: Reinforcement Learning</h3>
<p>Agentes de RL aprenden estrategias óptimas mediante prueba y error:</p>
<ul>
  <li>El agente interactúa con el mercado simulado</li>
  <li>Recibe recompensas por ganancias y penalizaciones por pérdidas</li>
  <li>Aprende políticas de trading complejas sin programación explícita</li>
</ul>

<h3>Errores Comunes a Evitar</h3>
<p><strong>1. Overfitting:</strong> Usa validación cruzada y walk-forward analysis</p>
<p><strong>2. Data leakage:</strong> Nunca uses información futura en tus features</p>
<p><strong>3. Exceso de features:</strong> Más no es mejor, usa feature selection</p>
<p><strong>4. Ignorar costos:</strong> Incluye spreads, comisiones y slippage en tus backtests</p>

<h3>Conclusión</h3>
<p>El ML es una herramienta poderosa pero no mágica. Requiere conocimientos sólidos de trading, estadística y programación. Comienza con modelos simples, valida rigurosamente y escala gradualmente.</p>',
    'Machine Learning in Trading: Real Cases',
    'We explore 5 real use cases of ML in algorithmic trading with code examples.',
    '<h2>Machine Learning Applied to Trading</h2>
<p>Machine Learning is transforming quantitative trading. Discover how machine learning algorithms can improve your trading strategies.</p>

<h3>Case 1: Price Direction Prediction</h3>
<p>Classification models like Random Forest and XGBoost can predict whether the price will go up or down in the next period:</p>
<ul>
  <li>Features: Technical indicators, volume, spreads, volatility</li>
  <li>Target: Price direction (1: up, 0: down)</li>
  <li>Typical accuracy: 55-60% (enough for profitability with good risk management)</li>
</ul>

<h3>Case 2: Anomaly Detection</h3>
<p>Clustering algorithms (K-means, DBSCAN) identify unusual patterns in the market:</p>
<ul>
  <li>Detect price manipulation</li>
  <li>Identify market regime changes</li>
  <li>Find arbitrage opportunities</li>
</ul>

<h3>Case 3: Parameter Optimization</h3>
<p>Genetic algorithms and Bayesian Optimization improve your strategy parameters:</p>
<ul>
  <li>Find the best combination of periods for indicators</li>
  <li>Optimize dynamic stop-loss and take-profit</li>
  <li>Avoid overfitting with walk-forward cross-validation</li>
</ul>

<h3>Case 4: Sentiment Analysis</h3>
<p>NLP (Natural Language Processing) analyzes news and social media:</p>
<ul>
  <li>Process thousands of tweets and articles in real-time</li>
  <li>Classify sentiment (positive, negative, neutral)</li>
  <li>Generate trading signals based on sentiment changes</li>
</ul>

<h3>Case 5: Reinforcement Learning</h3>
<p>RL agents learn optimal strategies through trial and error:</p>
<ul>
  <li>The agent interacts with the simulated market</li>
  <li>Receives rewards for gains and penalties for losses</li>
  <li>Learns complex trading policies without explicit programming</li>
</ul>

<h3>Common Mistakes to Avoid</h3>
<p><strong>1. Overfitting:</strong> Use cross-validation and walk-forward analysis</p>
<p><strong>2. Data leakage:</strong> Never use future information in your features</p>
<p><strong>3. Too many features:</strong> More is not better, use feature selection</p>
<p><strong>4. Ignoring costs:</strong> Include spreads, commissions and slippage in your backtests</p>

<h3>Conclusion</h3>
<p>ML is a powerful but not magical tool. It requires solid knowledge of trading, statistics and programming. Start with simple models, validate rigorously and scale gradually.</p>',
    'Roberto Silva',
    'Machine Learning',
    '12 min',
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=600&fit=crop',
    'published',
    TRUE,
    '2025-12-05 09:15:00+00'
);

-- Verify the insertion
SELECT slug, title_es, category, status, published_at FROM blog_posts ORDER BY published_at DESC;
