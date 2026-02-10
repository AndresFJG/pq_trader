/**
 * Script para actualizar información de mentores en Supabase
 * 
 * Uso:
 * cd backend
 * npx ts-node src/scripts/update-mentors.ts
 */

import { supabase } from '../config/supabase';

const mentorsData = [
  {
    id: 1,
    name: 'Marco Andrés',
    email: 'marco.andres@pqtrader.com',
    title: 'Trader & tutor',
    subtitle: 'Trader Algorítmico de enfoque práctico',
    description: 'Más de 5 años de trayectoria en MQL5 y 100% de éxito en Upwork. Profesor de Trading Algorítmico y experto en el desarrollo de Expert Advisors (EAs) para la plataforma MT4. Ha validado sistemas con esperanza matemática positiva en tiempo real y cuenta con certificaciones oficiales en pruebas de fondeo. Tutor de traders Top 1 en Darwinex Zero.',
    phrase: 'El trading es la forma más difícil de hacer dinero fácil',
    linkedin: 'https://www.mql5.com/es/users/marcotisma/news',
    students: 50,
    rating: 4.9,
    sessions: 100,
    highlights: [
      'Localizador de ventajas estadísticas',
      'Métodos personalizados de optimización',
      'Estrategias de volatilidad extrema',
      'MQL5, fxDremma, EAbuilder'
    ]
  },
  {
    id: 2,
    name: 'Jeremias',
    email: 'jeremias@pqtrader.com',
    title: 'Especialista en Trading Algorítmico',
    subtitle: '5+ años en desarrollo y optimización de estrategias',
    description: 'Más de cinco años de experiencia en el desarrollo, optimización y automatización de sistemas de trading algorítmico. Trabajo orientado a la construcción de estrategias sistemáticas sostenibles en el tiempo. Formado en el Programa Quant de UCEMA y con una Diplomatura en Asesoramiento Financiero (Universidad Blas Pascal), combina fundamentos académicos con experiencia operativa. Cuenta con experiencia en Darwinex y Darwinex Zero, incluyendo diseño de estrategias adaptadas al motor de riesgo de la plataforma y acompañamiento técnico en cuentas de fondeo y acceso a capital.',
    phrase: 'El trading algorítmico exige evidencia y robustez',
    linkedin: '',
    students: 150,
    rating: 4.9,
    sessions: 200,
    highlights: [
      'Backtesting y optimización (WFA)',
      'Tests de robustez (Montecarlo)',
      'Portafolios algorítmicos'
    ]
  }
];

async function updateMentors() {
  console.log('🚀 Iniciando actualización de mentores...\n');

  for (const mentor of mentorsData) {
    try {
      console.log(`📝 Actualizando ${mentor.name}...`);

      const { data, error } = await supabase
        .from('mentors')
        .update({
          name: mentor.name,
          email: mentor.email,
          title: mentor.title,
          subtitle: mentor.subtitle,
          description: mentor.description,
          phrase: mentor.phrase,
          linkedin: mentor.linkedin,
          students: mentor.students,
          rating: mentor.rating,
          sessions: mentor.sessions,
          highlights: mentor.highlights,
          updated_at: new Date().toISOString()
        })
        .eq('id', mentor.id)
        .select();

      if (error) {
        console.error(`❌ Error actualizando ${mentor.name}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        console.log(`✅ ${mentor.name} actualizado correctamente`);
        console.log(`   - Estudiantes: ${data[0].students}`);
        console.log(`   - Rating: ${data[0].rating}`);
        console.log(`   - Sesiones: ${data[0].sessions}`);
        console.log(`   - Especialidades: ${data[0].highlights.length}\n`);
      } else {
        console.log(`⚠️  No se encontró el mentor con ID ${mentor.id}\n`);
      }

    } catch (err: any) {
      console.error(`❌ Error inesperado con ${mentor.name}:`, err.message);
    }
  }

  // Verificar resultados finales
  console.log('📊 Verificando resultados...\n');
  const { data: allMentors, error: fetchError } = await supabase
    .from('mentors')
    .select('id, name, title, students, rating, sessions, updated_at')
    .order('id');

  if (fetchError) {
    console.error('❌ Error verificando mentores:', fetchError.message);
    return;
  }

  console.log('✅ Mentores actualizados:');
  console.table(allMentors?.map(m => ({
    ID: m.id,
    Nombre: m.name,
    Título: m.title,
    Estudiantes: m.students,
    Rating: m.rating,
    Sesiones: m.sessions,
    Actualizado: new Date(m.updated_at).toLocaleString('es-AR')
  })));

  console.log('\n✨ Actualización completada exitosamente!');
}

// Ejecutar script
updateMentors()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
