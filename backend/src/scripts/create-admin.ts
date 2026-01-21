import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

// Cargar variables de entorno PRIMERO
dotenv.config();

interface AdminUser {
  name: string;
  email: string;
  password: string;
  role: 'admin';
  subscription_tier: 'enterprise';
  subscription_status: 'active';
}

async function createAdminUser() {
  try {
    const adminEmail = 'admin@pqtrader.com';
    const adminPassword = 'Admin123!'; // Cambiar después del primer login
    
    logger.info('🔐 Creando usuario administrador...');

    // Verificar si ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (existingUser) {
      logger.warn('⚠️  El usuario admin ya existe');
      logger.info(`📧 Email: ${adminEmail}`);
      logger.info(`🔑 Password: (usa el que configuraste anteriormente)`);
      return;
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Crear usuario admin
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name: 'Administrador',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          subscription_tier: 'vip',
          subscription_status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    logger.info('✅ Usuario administrador creado exitosamente!');
    logger.info('\n' + '='.repeat(60));
    logger.info('📋 CREDENCIALES DEL ADMINISTRADOR');
    logger.info('='.repeat(60));
    logger.info(`📧 Email:    ${adminEmail}`);
    logger.info(`🔑 Password: ${adminPassword}`);
    logger.info('='.repeat(60));
    logger.info('\n⚠️  IMPORTANTE: Cambia esta contraseña después del primer login\n');

    return newUser;
  } catch (error: any) {
    logger.error('❌ Error creando usuario admin:', error);
    throw error;
  }
}

// Ejecutar si se corre directamente
if (require.main === module) {
  createAdminUser()
    .then(() => {
      logger.info('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Script falló:', error);
      process.exit(1);
    });
}

export { createAdminUser };
