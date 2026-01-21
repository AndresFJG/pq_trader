import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Conectar a PostgreSQL (Supabase)
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false,
    } : undefined,
  },
  logging: false,
});

async function viewDatabase() {
  try {
    console.log('🔌 Conectando a Supabase (PostgreSQL)...\n');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa!\n');

    // Ver todas las tablas (PostgreSQL)
    console.log('📊 TABLAS EN LA BASE DE DATOS:');
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.table(tables);

    // Ver estructura de cada tabla
    for (const tableObj of tables as any[]) {
      const tableName = tableObj.table_name;
      console.log(`\n📋 Estructura de la tabla: ${tableName}`);
      
      // Columnas (PostgreSQL)
      const [columns] = await sequelize.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = '${tableName}'
        ORDER BY ordinal_position
      `);
      console.table(columns);

      // Contar registros
      const [count] = await sequelize.query(`SELECT COUNT(*) as total FROM ${tableName}`);
      console.log(`   Total de registros: ${(count as any)[0].total}\n`);
      
      // Mostrar primeros 5 registros si existen
      if ((count as any)[0].total > 0) {
        console.log(`   Primeros registros de ${tableName}:`);
        const [data] = await sequelize.query(`SELECT * FROM ${tableName} LIMIT 5`);
        console.table(data);
      }
    }

    // Resumen general
    console.log('\n📈 RESUMEN GENERAL:');
    const summary: any = {};
    for (const tableObj of tables as any[]) {
      const tableName = tableObj.table_name;
      const [count] = await sequelize.query(`SELECT COUNT(*) as total FROM ${tableName}`);
      summary[tableName] = (count as any)[0].total;
    }
    console.table(summary);

    await sequelize.close();
    console.log('\n✅ Conexión cerrada');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('\nVerifica que:');
    console.error('1. DATABASE_URL esté configurado en .env');
    console.error('2. Hayas importado el schema en Supabase');
    console.error('3. La conexión SSL esté habilitada');
    process.exit(1);
  }
}

viewDatabase();
