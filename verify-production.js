#!/usr/bin/env node

/**
 * Script para verificar configuración de producción
 * Ejecutar antes del deployment
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

console.log('🔍 Verificando configuración de producción...\n');

let errors = 0;
let warnings = 0;

// ====================================
// 1. Verificar que .env no tenga keys reales
// ====================================
console.log('📋 Verificando archivos .env...');

const envFiles = [
  path.join(__dirname, 'backend', '.env'),
  path.join(__dirname, 'frontend', '.env.local')
];

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for test keys
    if (content.includes('sk_test_') || content.includes('pk_test_')) {
      console.log(`${YELLOW}⚠️  ${file} contiene Stripe TEST keys${RESET}`);
      warnings++;
    }
    
    // Check for sandbox
    if (content.includes('PAYPAL_MODE=sandbox')) {
      console.log(`${YELLOW}⚠️  ${file} tiene PayPal en modo sandbox${RESET}`);
      warnings++;
    }
    
    // Check for localhost
    if (content.includes('localhost:')) {
      console.log(`${YELLOW}⚠️  ${file} tiene URLs de localhost${RESET}`);
      warnings++;
    }
  }
});

// ====================================
// 2. Verificar package.json
// ====================================
console.log('\n📦 Verificando package.json...');

const backendPackage = require('./backend/package.json');
const frontendPackage = require('./frontend/package.json');

// Check scripts
if (!backendPackage.scripts.build) {
  console.log(`${RED}❌ backend/package.json no tiene script "build"${RESET}`);
  errors++;
} else {
  console.log(`${GREEN}✅ Backend build script presente${RESET}`);
}

if (!backendPackage.scripts.start) {
  console.log(`${RED}❌ backend/package.json no tiene script "start"${RESET}`);
  errors++;
} else {
  console.log(`${GREEN}✅ Backend start script presente${RESET}`);
}

if (!frontendPackage.scripts.build) {
  console.log(`${RED}❌ frontend/package.json no tiene script "build"${RESET}`);
  errors++;
} else {
  console.log(`${GREEN}✅ Frontend build script presente${RESET}`);
}

// ====================================
// 3. Verificar TypeScript config
// ====================================
console.log('\n⚙️  Verificando TypeScript config...');

const backendTsConfig = path.join(__dirname, 'backend', 'tsconfig.json');
const frontendTsConfig = path.join(__dirname, 'frontend', 'tsconfig.json');

if (fs.existsSync(backendTsConfig)) {
  const config = JSON.parse(fs.readFileSync(backendTsConfig, 'utf8'));
  if (config.compilerOptions && config.compilerOptions.outDir) {
    console.log(`${GREEN}✅ Backend TypeScript configurado (outDir: ${config.compilerOptions.outDir})${RESET}`);
  }
} else {
  console.log(`${RED}❌ backend/tsconfig.json no encontrado${RESET}`);
  errors++;
}

if (fs.existsSync(frontendTsConfig)) {
  console.log(`${GREEN}✅ Frontend TypeScript configurado${RESET}`);
} else {
  console.log(`${RED}❌ frontend/tsconfig.json no encontrado${RESET}`);
  errors++;
}

// ====================================
// 4. Verificar archivos críticos
// ====================================
console.log('\n📁 Verificando archivos críticos...');

const criticalFiles = [
  'backend/src/index.ts',
  'frontend/src/app/layout.tsx',
  'backend/package.json',
  'frontend/package.json',
  'backend/.env.example',
  'frontend/.env.example',
  'DEPLOYMENT_GUIDE.md'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`${GREEN}✅ ${file}${RESET}`);
  } else {
    console.log(`${RED}❌ ${file} no encontrado${RESET}`);
    errors++;
  }
});

// ====================================
// 5. Verificar migraciones
// ====================================
console.log('\n🗄️  Verificando migraciones...');

const migrationsDir = path.join(__dirname, 'backend', 'supabase_migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  console.log(`${GREEN}✅ ${migrations.length} migraciones encontradas${RESET}`);
  migrations.forEach(m => console.log(`   - ${m}`));
} else {
  console.log(`${YELLOW}⚠️  Directorio de migraciones no encontrado${RESET}`);
  warnings++;
}

// ====================================
// 6. Verificar Vercel config
// ====================================
console.log('\n🌐 Verificando Vercel config...');

const vercelJson = path.join(__dirname, 'frontend', 'vercel.json');
if (fs.existsSync(vercelJson)) {
  const content = fs.readFileSync(vercelJson, 'utf8');
  if (content.includes('framework')) {
    console.log(`${GREEN}✅ vercel.json configurado${RESET}`);
  } else {
    console.log(`${YELLOW}⚠️  vercel.json existe pero puede estar incompleto${RESET}`);
    warnings++;
  }
} else {
  console.log(`${YELLOW}⚠️  vercel.json no encontrado (opcional)${RESET}`);
  warnings++;
}

// ====================================
// 7. Verificar Railway config
// ====================================
console.log('\n🚂 Verificando Railway config...');

const railwayToml = path.join(__dirname, 'backend', 'railway.toml');
if (fs.existsSync(railwayToml)) {
  console.log(`${GREEN}✅ railway.toml configurado${RESET}`);
} else {
  console.log(`${YELLOW}⚠️  railway.toml no encontrado (opcional)${RESET}`);
  warnings++;
}

// ====================================
// 8. Verificar .gitignore
// ====================================
console.log('\n🔒 Verificando .gitignore...');

const gitignore = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignore)) {
  const content = fs.readFileSync(gitignore, 'utf8');
  
  const requiredIgnores = ['.env', 'node_modules', 'dist', '.next'];
  const missing = requiredIgnores.filter(pattern => !content.includes(pattern));
  
  if (missing.length === 0) {
    console.log(`${GREEN}✅ .gitignore configurado correctamente${RESET}`);
  } else {
    console.log(`${YELLOW}⚠️  .gitignore falta: ${missing.join(', ')}${RESET}`);
    warnings++;
  }
} else {
  console.log(`${RED}❌ .gitignore no encontrado${RESET}`);
  errors++;
}

// ====================================
// RESUMEN
// ====================================
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
  console.log(`${GREEN}✅ Todo está listo para deployment${RESET}`);
  console.log('\nPróximos pasos:');
  console.log('1. Ejecutar: ./deploy.sh');
  console.log('2. O deployar manualmente siguiendo DEPLOYMENT_GUIDE.md');
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`${RED}❌ ${errors} error(es) encontrados${RESET}`);
  }
  if (warnings > 0) {
    console.log(`${YELLOW}⚠️  ${warnings} advertencia(s)${RESET}`);
  }
  
  console.log('\nRevisa los problemas antes de deployar.');
  console.log('Consulta DEPLOYMENT_GUIDE.md para más información.');
  
  if (errors > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
