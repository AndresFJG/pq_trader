// Script rápido para generar hash de contraseña
const bcrypt = require('bcryptjs');

const password = 'Admin123!'; // Cambia esto si quieres

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('\n='.repeat(60));
  console.log('PASSWORD HASH GENERADO');
  console.log('='.repeat(60));
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log('='.repeat(60));
  console.log('\nUsa este SQL en Supabase:\n');
  console.log(`INSERT INTO users (name, email, password, role, subscription_tier, subscription_status)
VALUES (
  'Administrador',
  'admin@pqtrader.com',
  '${hash}',
  'admin',
  'vip',
  'active'
);`);
  console.log('\n');
});
