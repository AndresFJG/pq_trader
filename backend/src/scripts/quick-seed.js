// Script simple para agregar datos de prueba
// Ejecutar: node src/scripts/quick-seed.js

const coursesData = [
  {
    title: 'Trading Algorítmico con Python',
    slug: 'trading-algoritmico-python',
    description: 'Aprende a crear estrategias de trading automatizadas usando Python, pandas y backtesting.',
    long_description: 'Curso completo de trading algorítmico con Python desde cero hasta estrategias avanzadas.',
    category: 'Python',
    level: 'intermediate',
    price: 299,
    duration_hours: 40,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    is_published: true,
    enrollment_count: 156,
    rating: 4.8
  },
  {
    title: 'Análisis Técnico Avanzado',
    slug: 'analisis-tecnico-avanzado',
    description: 'Domina indicadores técnicos, patrones de precio y estrategias de trading profesionales.',
    long_description: 'Curso avanzado de análisis técnico para traders profesionales.',
    category: 'Trading',
    level: 'advanced',
    price: 399,
    duration_hours: 50,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    is_published: true,
    enrollment_count: 203,
    rating: 4.9
  },
  {
    title: 'Introducción al Trading Cuantitativo',
    slug: 'intro-trading-cuantitativo',
    description: 'Fundamentos de trading cuantitativo, backtesting y optimización de estrategias.',
    long_description: 'Curso introductorio al mundo del trading cuantitativo.',
    category: 'Fundamentos',
    level: 'beginner',
    price: 199,
    duration_hours: 30,
    thumbnail: 'https://images.unsplash.com/photo-1642790551116-18e150f248e8?w=800',
    is_published: true,
    enrollment_count: 421,
    rating: 4.7
  }
];

async function seedDirectlyToSupabase() {
  console.log('🌱 Agregando datos directamente a Supabase...\n');
  
  const { createClient } = require('@supabase/supabase-js');
  require('dotenv').config();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 1. Cursos
  console.log('📚 Insertando cursos...');
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .insert(coursesData)
    .select();

  if (coursesError) {
    console.error('❌ Error:', coursesError.message);
  } else {
    console.log(`✅ ${courses?.length || 0} cursos insertados`);
  }

  // 2. Portafolios
  console.log('\n📊 Insertando portafolios...');
  const portfoliosData = [
    {
      name: 'Momentum Strategy Pro',
      description: 'Estrategia de momentum en pares de divisas mayores.',
      strategy: 'Momentum',
      roi: 45.3,
      sharpe_ratio: 1.8,
      drawdown: -12.5,
      win_rate: 68.2,
      total_trades: 234,
      status: 'active'
    },
    {
      name: 'Mean Reversion EUR/USD',
      description: 'Sistema de reversión a la media optimizado.',
      strategy: 'Mean Reversion',
      roi: 32.7,
      sharpe_ratio: 1.5,
      drawdown: -8.3,
      win_rate: 72.5,
      total_trades: 156,
      status: 'active'
    },
    {
      name: 'Breakout Multi-Asset',
      description: 'Estrategia de breakouts en múltiples activos.',
      strategy: 'Breakout',
      roi: 56.8,
      sharpe_ratio: 2.1,
      drawdown: -15.2,
      win_rate: 64.8,
      total_trades: 189,
      status: 'active'
    },
    {
      name: 'Statistical Arbitrage',
      description: 'Arbitraje estadístico en pares correlacionados.',
      strategy: 'Statistical Arbitrage',
      roi: 28.4,
      sharpe_ratio: 1.6,
      drawdown: -6.7,
      win_rate: 75.3,
      total_trades: 412,
      status: 'active'
    },
    {
      name: 'Trend Following System',
      description: 'Sistema de seguimiento de tendencias.',
      strategy: 'Trend Following',
      roi: 38.9,
      sharpe_ratio: 1.7,
      drawdown: -11.4,
      win_rate: 66.1,
      total_trades: 267,
      status: 'active'
    },
    {
      name: 'Grid Trading Bot',
      description: 'Bot de grid trading automatizado.',
      strategy: 'Grid Trading',
      roi: 41.2,
      sharpe_ratio: 1.9,
      drawdown: -9.8,
      win_rate: 70.4,
      total_trades: 523,
      status: 'active'
    }
  ];

  const { data: portfolios, error: portfoliosError } = await supabase
    .from('portfolios')
    .insert(portfoliosData)
    .select();

  if (portfoliosError) {
    console.error('❌ Error:', portfoliosError.message);
  } else {
    console.log(`✅ ${portfolios?.length || 0} portafolios insertados`);
  }

  console.log('\n🎉 Proceso completado!');
}

seedDirectlyToSupabase().catch(console.error);
