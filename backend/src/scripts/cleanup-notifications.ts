// Script para limpiar notificaciones antiguas
// Ejecutar como: npm run cleanup-notifications
// O configurar como cron job

import { NotificationService } from '../services/notification.service';
import { config } from '../config/env';

const DAYS_TO_KEEP = 30; // Mantener notificaciones de los últimos 30 días

/**
 * Limpia notificaciones antiguas de la base de datos
 */
async function cleanupOldNotifications() {
  try {
    console.log(`\n🧹 Iniciando limpieza de notificaciones antiguas (${DAYS_TO_KEEP}+ días)...\n`);

    const count = await NotificationService.deleteOld(DAYS_TO_KEEP);

    if (count > 0) {
      console.log(`✅ Se eliminaron ${count} notificaciones antiguas exitosamente.`);
    } else {
      console.log(`ℹ️  No hay notificaciones antiguas para eliminar.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar notificaciones:', error);
    process.exit(1);
  }
}

// Ejecutar limpieza
cleanupOldNotifications();
