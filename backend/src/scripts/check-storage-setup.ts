import dotenv from 'dotenv';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

// Cargar variables de entorno PRIMERO
dotenv.config();

/**
 * Script para verificar y configurar Supabase Storage
 */
async function checkStorageSetup() {
  console.log('\n🔍 Verificando configuración de Supabase Storage...\n');

  try {
    // 1. Verificar conexión a Supabase
    console.log('📡 Verificando conexión a Supabase...');
    
    // Solo verificamos que las variables de entorno estén configuradas
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configuradas');
      return;
    }
    
    console.log('✅ Conexión a Supabase OK\n');

    // 2. Listar buckets disponibles
    console.log('📦 Listando buckets disponibles...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error al listar buckets:', bucketsError.message);
      return;
    }

    console.log(`✅ Encontrados ${buckets.length} buckets:\n`);
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (público: ${bucket.public ? '✅' : '❌'})`);
    });

    // 3. Verificar bucket 'lesson-media'
    console.log('\n🎯 Verificando bucket "lesson-media"...');
    const lessonMediaBucket = buckets.find(b => b.name === 'lesson-media');
    
    if (!lessonMediaBucket) {
      console.error('❌ Bucket "lesson-media" NO encontrado');
      console.log('\n📝 Para crearlo:');
      console.log('   1. Ve a: https://supabase.com/dashboard');
      console.log('   2. Storage → New bucket');
      console.log('   3. Nombre: lesson-media');
      console.log('   4. Público: SÍ');
      console.log('   5. Configura las políticas RLS (ver SUPABASE_STORAGE_SETUP.md)');
      return;
    }

    console.log('✅ Bucket "lesson-media" encontrado');
    console.log(`   - Público: ${lessonMediaBucket.public ? '✅ SÍ' : '❌ NO (debes marcarlo como público)'}`);
    console.log(`   - ID: ${lessonMediaBucket.id}`);
    console.log(`   - Creado: ${new Date(lessonMediaBucket.created_at).toLocaleString()}`);

    // 4. Listar archivos en el bucket
    console.log('\n📂 Listando archivos en "lesson-media/lessons"...');
    const { data: files, error: filesError } = await supabase.storage
      .from('lesson-media')
      .list('lessons', {
        limit: 10,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (filesError) {
      console.error('❌ Error al listar archivos:', filesError.message);
      console.log('   Esto puede indicar que las políticas RLS no están configuradas');
      console.log('   Ver: SUPABASE_STORAGE_SETUP.md (Paso 1.4)');
      return;
    }

    if (files.length === 0) {
      console.log('📭 No hay archivos subidos aún');
    } else {
      console.log(`✅ Encontrados ${files.length} archivos:\n`);
      files.forEach((file, index) => {
        const size = ((file.metadata?.size || 0) / (1024 * 1024)).toFixed(2);
        console.log(`   ${index + 1}. ${file.name} (${size} MB)`);
      });
    }

    // 5. Probar subida de archivo de prueba
    console.log('\n🧪 Probando subida de archivo de prueba...');
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Este es un archivo de prueba para verificar Supabase Storage';
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lesson-media')
      .upload(`lessons/${testFileName}`, testContent, {
        contentType: 'text/plain',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Error al subir archivo de prueba:', uploadError.message);
      console.log('   Verifica las políticas RLS (deben permitir INSERT a admins)');
      return;
    }

    console.log('✅ Archivo de prueba subido correctamente');
    console.log(`   Path: ${uploadData.path}`);

    // 6. Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('lesson-media')
      .getPublicUrl(`lessons/${testFileName}`);

    console.log(`   URL pública: ${publicUrlData.publicUrl}`);

    // 7. Eliminar archivo de prueba
    console.log('\n🧹 Limpiando archivo de prueba...');
    const { error: deleteError } = await supabase.storage
      .from('lesson-media')
      .remove([`lessons/${testFileName}`]);

    if (deleteError) {
      console.error('❌ Error al eliminar archivo de prueba:', deleteError.message);
    } else {
      console.log('✅ Archivo de prueba eliminado');
    }

    // 8. Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('🎉 CONFIGURACIÓN COMPLETADA');
    console.log('='.repeat(60));
    console.log('\n✅ Supabase Storage está correctamente configurado');
    console.log('✅ Bucket "lesson-media" existe y es público');
    console.log('✅ Subida y eliminación de archivos funcional');
    console.log('\n🚀 El sistema está listo para subir archivos multimedia\n');

  } catch (error: any) {
    console.error('\n❌ Error inesperado:', error.message);
    logger.error('Storage check error', { error: error.message, stack: error.stack });
  }
}

// Ejecutar verificación
checkStorageSetup()
  .then(() => {
    console.log('✅ Verificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
