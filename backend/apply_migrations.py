#!/usr/bin/env python3
"""
Script para aplicar migraciones SQL a Supabase
"""

import os
import sys
from pathlib import Path
from supabase import create_client
import dotenv

# Cargar variables de entorno
dotenv.load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY") or os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Error: Faltan variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY")
    print("   Asegúrate de tener un archivo .env con estas variables")
    sys.exit(1)

# Crear cliente Supabase
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    print(f"✅ Conectado a Supabase: {SUPABASE_URL}")
except Exception as e:
    print(f"❌ Error al conectar a Supabase: {e}")
    sys.exit(1)

def get_migration_files():
    """Obtiene archivos de migración en orden"""
    migrations_dir = Path(__file__).parent / "supabase_migrations"
    
    if not migrations_dir.exists():
        print(f"❌ Error: No se encontró directorio {migrations_dir}")
        sys.exit(1)
    
    # Leer todos los archivos .sql y ordenarlos numéricamente
    files = sorted([f for f in migrations_dir.glob("*.sql") if f.name[0].isdigit()])
    return files

def execute_migration(file_path):
    """Ejecuta un archivo de migración"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        if not sql.strip():
            print(f"⏭️  Saltando {file_path.name} (vacío)")
            return True
        
        print(f"\n📄 Ejecutando: {file_path.name}")
        print(f"   Tamaño: {len(sql)} bytes")
        
        # Ejecutar el SQL
        result = supabase.postgrest.postgrest.request(
            "POST",
            "/sql",
            json={"sql": sql},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"✅ {file_path.name} ejecutado exitosamente")
        return True
        
    except Exception as e:
        print(f"❌ Error en {file_path.name}: {e}")
        return False

def main():
    print("=" * 70)
    print("APLICADOR DE MIGRACIONES - PQ TRADER")
    print("=" * 70)
    
    files = get_migration_files()
    
    if not files:
        print("⚠️  No se encontraron archivos de migración")
        return
    
    print(f"\n📋 Se encontraron {len(files)} archivos de migración:\n")
    for i, f in enumerate(files, 1):
        print(f"   {i}. {f.name}")
    
    print("\n" + "=" * 70)
    
    successful = 0
    failed = 0
    
    for file_path in files:
        if execute_migration(file_path):
            successful += 1
        else:
            failed += 1
            # Preguntar si continuar
            if input("\n⚠️  ¿Continuar con las migraciones siguientes? (s/n): ").lower() != 's':
                break
    
    print("\n" + "=" * 70)
    print(f"RESUMEN: {successful} exitosas, {failed} errores")
    print("=" * 70)
    
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
