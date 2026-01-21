import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

// Cargar variables de entorno PRIMERO
dotenv.config();

async function updateAdminPassword() {
  try {
    const adminEmail = 'admin@pqtrader.com';
    const adminPassword = 'Admin123!';
    
    logger.info('🔐 Actualizando contraseña del administrador...');

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Actualizar usuario admin
    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', adminEmail)
      .select()
      .single();

    if (error) throw error;

    logger.info('✅ Contraseña actualizada exitosamente');
    logger.info(`📧 Email: ${adminEmail}`);
    logger.info(`🔑 Password: ${adminPassword}`);
    logger.info('');
    logger.info('Ahora puedes iniciar sesión con estas credenciales');

    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateAdminPassword();
