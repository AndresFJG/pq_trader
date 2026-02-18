// Script para probar login directo
// Ejecutar con: node probar-login.js admin@pqtrader.com Admin123!

const axios = require('axios');

const email = process.argv[2] || 'admin@pqtrader.com';
const password = process.argv[3] || 'Admin123!';

async function probarLogin() {
  console.log('\n========================================');
  console.log('Probando Login');
  console.log('========================================\n');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}\n`);

  try {
    const response = await axios.post('http://localhost:4000/api/auth/login', {
      email,
      password
    });

    console.log('✅ LOGIN EXITOSO!\n');
    console.log('Usuario:');
    console.log(`  - ID: ${response.data.data.user.id}`);
    console.log(`  - Nombre: ${response.data.data.user.name}`);
    console.log(`  - Email: ${response.data.data.user.email}`);
    console.log(`  - Rol: ${response.data.data.user.role}`);
    console.log(`\nToken: ${response.data.data.token.substring(0, 30)}...`);

  } catch (error) {
    console.log('❌ LOGIN FALLIDO\n');
    
    if (error.response) {
      console.log(`Status Code: ${error.response.status}`);
      console.log(`Error: ${error.response.data.error || 'Error desconocido'}`);
      
      if (error.response.status === 401) {
        console.log('\n⚠️  CREDENCIALES INVÁLIDAS');
        console.log('\nPosibles causas:');
        console.log('  1. Email no existe en la base de datos');
        console.log('  2. Contraseña incorrecta');
        console.log('  3. Hash de contraseña corrupto');
        
        console.log('\n💡 Intenta con otros usuarios:');
        console.log('  node probar-login.js grupoetercapital@gmail.com tu_password');
        console.log('  node probar-login.js amador@pqtraders.com tu_password');
      }
    } else {
      console.log(`Error de conexión: ${error.message}`);
      console.log('\n⚠️  Verifica que el backend esté corriendo:');
      console.log('  cd backend && npm run dev');
    }
  }
}

probarLogin();
