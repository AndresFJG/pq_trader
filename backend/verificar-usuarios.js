// Script para verificar usuarios en Supabase
// Ejecutar con: node verificar-usuarios.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarUsuarios() {
  console.log('\n========================================');
  console.log('Verificando Usuarios en Supabase');
  console.log('========================================\n');

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, password, role')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Error al obtener usuarios:', error.message);
      return;
    }

    if (!users || users.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos');
      return;
    }

    console.log(`✅ Total de usuarios: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`Usuario #${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Nombre: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Rol: ${user.role}`);
      console.log(`  Contraseña (hash):`);
      console.log(`    - Longitud: ${user.password ? user.password.length : 0} caracteres`);
      console.log(`    - Formato: ${user.password ? user.password.substring(0, 20) : 'NULL'}...`);
      
      // Verificar si el hash es válido (bcrypt debe tener 60 caracteres)
      if (!user.password) {
        console.log(`    ❌ PROBLEMA: Contraseña es NULL`);
      } else if (user.password.length !== 60) {
        console.log(`    ⚠️  PROBLEMA: Hash bcrypt debe tener 60 caracteres, tiene ${user.password.length}`);
      } else if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        console.log(`    ⚠️  PROBLEMA: No parece ser un hash bcrypt válido`);
      } else {
        console.log(`    ✅ Hash válido`);
      }
      
      console.log('');
    });

    // Probar login con cada usuario
    console.log('\n========================================');
    console.log('Probando Login (con contraseñas comunes)');
    console.log('========================================\n');

    const commonPasswords = [
      'Admin123!',
      'Password123!',
      'admin123',
      'password',
      '123456'
    ];

    for (const user of users) {
      console.log(`\nProbando usuario: ${user.email}`);
      
      for (const password of commonPasswords) {
        try {
          const bcrypt = require('bcryptjs');
          const match = await bcrypt.compare(password, user.password);
          
          if (match) {
            console.log(`  ✅ CONTRASEÑA ENCONTRADA: "${password}"`);
            break;
          }
        } catch (error) {
          console.log(`  ⚠️  Error al comparar con "${password}":`, error.message);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verificarUsuarios();
