#!/usr/bin/env node

/**
 * Script de limpieza pre-deploy
 * Elimina archivos temporales, builds viejos, y verifica configuración
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando proyecto para producción...\n');

const filesToDelete = [
  // Root level
  'ACCION_INMEDIATA.md',
  'ESTADO_IMPLEMENTACION.md',
  'MEJORAS_IMPLEMENTADAS.md',
  'MENTORSHIP_COMPLETE.md',
  'PAYPAL_CREDENCIALES.md',
  'PQ Trader nuevo contenido.pdf',
  '.venv',
  
  // Backend
  'backend/logs',
  'backend/uploads',
  'backend/dist',
  'backend/.env.production', // No debe estar en repo
  
  // Frontend
  'frontend/.next',
  'frontend/out',
  'frontend/.env.production', // No debe estar en repo
  'frontend/.env.local',
];

let deletedCount = 0;

filesToDelete.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Eliminado directorio: ${file}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`✅ Eliminado archivo: ${file}`);
      }
      deletedCount++;
    }
  } catch (error) {
    console.log(`⚠️  No se pudo eliminar ${file}: ${error.message}`);
  }
});

console.log(`\n📊 Total eliminados: ${deletedCount} archivos/directorios\n`);

// Verificar archivos críticos
console.log('🔍 Verificando archivos críticos...\n');

const requiredFiles = [
  'backend/package.json',
  'backend/tsconfig.json',
  'backend/.env.example',
  'backend/railway.toml',
  'frontend/package.json',
  'frontend/tsconfig.json',
  'frontend/.env.example',
  'frontend/vercel.json',
  'DEPLOYMENT.md',
  'DEPLOY_CHECKLIST.md',
  'README.md',
];

let missingFiles = [];

requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ FALTA: ${file}`);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log(`\n⚠️  Advertencia: Faltan ${missingFiles.length} archivos críticos`);
  process.exit(1);
}

console.log('\n✅ Limpieza completada. Proyecto listo para deploy.\n');
console.log('📋 Próximos pasos:');
console.log('   1. git add .');
console.log('   2. git commit -m "chore: cleanup for production"');
console.log('   3. git push');
console.log('   4. Seguir DEPLOYMENT.md para deploy en Vercel/Railway\n');
