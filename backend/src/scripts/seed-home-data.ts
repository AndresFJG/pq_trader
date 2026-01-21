import * as dotenv from 'dotenv';
import { supabase } from '../config/supabase';

// Cargar variables de entorno
dotenv.config();

async function seedData() {
  console.log('🌱 Iniciando seed de datos...\n');

  // 1. Crear cursos de ejemplo
  console.log('📚 Creando cursos...');
  const coursesData = [
    {
      title: 'Trading Algorítmico con Python',
      slug: 'trading-algoritmico-python',
      description: 'Aprende a crear estrategias de trading automatizadas usando Python, pandas y backtesting.',
      category: 'Python',
      level: 'intermedio',
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
      category: 'Trading',
      level: 'avanzado',
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
      category: 'Fundamentos',
      level: 'principiante',
      price: 199,
      duration_hours: 30,
      thumbnail: 'https://images.unsplash.com/photo-1642790551116-18e150f248e8?w=800',
      is_published: true,
      enrollment_count: 421,
      rating: 4.7
    }
  ];

  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .insert(coursesData)
    .select();

  if (coursesError) {
    console.error('❌ Error creando cursos:', coursesError);
  } else {
    console.log(`✅ ${courses?.length} cursos creados`);
  }

  // 2. Crear mentorías de ejemplo
  console.log('\n👨‍🏫 Creando mentorías...');
  const mentorshipsData = [
    {
      title: 'Mentoría Personal en Trading',
      description: 'Sesiones 1-on-1 con traders profesionales. Aprende estrategias personalizadas según tu perfil de riesgo.',
      mentor_name: 'Carlos Rodríguez',
      price: 1500,
      duration_weeks: 8,
      spots_available: 5,
      thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800',
      is_active: true,
      enrolled_count: 12,
      rating: 5.0
    },
    {
      title: 'Mentoría Grupal: Trading Sistemático',
      description: 'Grupo reducido de 10 personas. Aprende a crear y optimizar sistemas de trading algorítmico.',
      mentor_name: 'Ana Martínez',
      price: 800,
      duration_weeks: 12,
      spots_available: 3,
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      is_active: true,
      enrolled_count: 28,
      rating: 4.9
    },
    {
      title: 'Mentoría Avanzada: Portfolio Management',
      description: 'Gestión profesional de portafolio, diversificación y estrategias multi-activos.',
      mentor_name: 'Miguel Sánchez',
      price: 2000,
      duration_weeks: 16,
      spots_available: 2,
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      is_active: true,
      enrolled_count: 8,
      rating: 4.8
    }
  ];

  const { data: mentorships, error: mentorshipsError } = await supabase
    .from('mentorships')
    .insert(mentorshipsData)
    .select();

  if (mentorshipsError) {
    console.error('❌ Error creando mentorías:', mentorshipsError);
  } else {
    console.log(`✅ ${mentorships?.length} mentorías creadas`);
  }

  // 3. Crear portafolios de ejemplo
  console.log('\n📊 Creando portafolios...');
  
  // Obtener el primer usuario (admin) para asociar portafolios
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  const userId = users?.[0]?.id || '00000000-0000-0000-0000-000000000000';

  const portfoliosData = [
    {
      user_id: userId,
      title: 'Momentum Strategy Pro',
      description: 'Estrategia de momentum en pares de divisas mayores con gestión de riesgo automática.',
      strategy_type: 'Momentum',
      total_return: 45.3,
      sharpe_ratio: 1.8,
      max_drawdown: -12.5,
      win_rate: 68.2,
      total_trades: 234,
      is_public: true,
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800'
    },
    {
      user_id: userId,
      title: 'Mean Reversion EUR/USD',
      description: 'Sistema de reversión a la media optimizado para EUR/USD en timeframes diarios.',
      strategy_type: 'Mean Reversion',
      total_return: 32.7,
      sharpe_ratio: 1.5,
      max_drawdown: -8.3,
      win_rate: 72.5,
      total_trades: 156,
      is_public: true,
      thumbnail: 'https://images.unsplash.com/photo-1642790551116-18e150f248e8?w=800'
    },
    {
      user_id: userId,
      title: 'Breakout Multi-Asset',
      description: 'Estrategia de breakouts en múltiples activos con filtros de volatilidad.',
      strategy_type: 'Breakout',
      total_return: 56.8,
      sharpe_ratio: 2.1,
      max_drawdown: -15.2,
      win_rate: 64.8,
      total_trades: 189,
      is_public: true,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    },
    {
      user_id: userId,
      title: 'Statistical Arbitrage',
      description: 'Arbitraje estadístico en pares correlacionados con alta frecuencia.',
      strategy_type: 'Statistical Arbitrage',
      total_return: 28.4,
      sharpe_ratio: 1.6,
      max_drawdown: -6.7,
      win_rate: 75.3,
      total_trades: 412,
      is_public: true,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    },
    {
      user_id: userId,
      title: 'Trend Following System',
      description: 'Sistema de seguimiento de tendencias en commodities y forex.',
      strategy_type: 'Trend Following',
      total_return: 38.9,
      sharpe_ratio: 1.7,
      max_drawdown: -11.4,
      win_rate: 66.1,
      total_trades: 267,
      is_public: true,
      thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800'
    },
    {
      user_id: userId,
      title: 'Grid Trading Bot',
      description: 'Bot de grid trading automatizado con ajuste dinámico de niveles.',
      strategy_type: 'Grid Trading',
      total_return: 41.2,
      sharpe_ratio: 1.9,
      max_drawdown: -9.8,
      win_rate: 70.4,
      total_trades: 523,
      is_public: true,
      thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800'
    }
  ];

  const { data: portfolios, error: portfoliosError } = await supabase
    .from('portfolios')
    .insert(portfoliosData)
    .select();

  if (portfoliosError) {
    console.error('❌ Error creando portafolios:', portfoliosError);
  } else {
    console.log(`✅ ${portfolios?.length} portafolios creados`);
  }

  console.log('\n🎉 Seed completado exitosamente!');
}

seedData().catch(console.error);
