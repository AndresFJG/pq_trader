import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('❌ Missing Supabase credentials in .env');
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

// Cliente de Supabase usando HTTPS (puerto 443, no bloqueado por ISP)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const connectSupabase = async (): Promise<void> => {
  try {
    // Test connection usando HTTPS API en lugar de PostgreSQL directo
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    logger.info('✅ Supabase Connected via HTTPS API (puerto 443)');
    logger.info(`📊 Users table accessible`);
  } catch (error: any) {
    logger.error('❌ Supabase Connection Error:', error.message);
    throw error;
  }
};
