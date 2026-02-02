#!/usr/bin/env python3
"""
Script para aplicar migraciones SQL a Supabase
"""
import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / 'backend' / 'src'
sys.path.insert(0, str(backend_path))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("Error: psycopg2 no está instalado. Instalando...")
    os.system(f"{sys.executable} -m pip install psycopg2-binary python-dotenv")
    import psycopg2
    from psycopg2.extras import RealDictCursor

def apply_migration(migration_file):
    """Apply a single migration file to the database"""
    
    # Get database connection from environment
    db_host = os.getenv('DB_HOST', 'db.supabase.co')
    db_port = os.getenv('DB_PORT', '5432')
    db_name = os.getenv('DB_NAME')
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    
    if not all([db_name, db_user, db_password]):
        print("Error: Variables de entorno DB_NAME, DB_USER, DB_PASSWORD no configuradas")
        print(f"DB_NAME: {db_name}")
        print(f"DB_USER: {db_user}")
        print(f"DB_HOST: {db_host}")
        return False
    
    try:
        print(f"Conectando a {db_host}:{db_port}/{db_name}...")
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password,
            sslmode='require'
        )
        
        cursor = conn.cursor()
        
        # Read migration file
        with open(migration_file, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        print(f"Aplicando migración: {migration_file}")
        print("-" * 60)
        
        # Execute migration
        cursor.execute(sql)
        conn.commit()
        
        print("✓ Migración aplicada exitosamente")
        print("-" * 60)
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"✗ Error aplicando migración: {e}")
        return False

if __name__ == '__main__':
    # Aplicar migraciones en orden
    migrations = [
        '009_create_mentor_schedules.sql',
        '010_enable_rls_policies_fixed.sql'  # Usar versión fixed que maneja UUID/BIGINT
    ]
    
    migrations_path = Path(__file__).parent / 'backend' / 'supabase_migrations'
    
    all_success = True
    for migration_name in migrations:
        migration_file = migrations_path / migration_name
        
        if not migration_file.exists():
            # Si fixed no existe, intentar con versión original
            if 'fixed' in migration_name:
                migration_name = migration_name.replace('_fixed', '')
                migration_file = migrations_path / migration_name
                if not migration_file.exists():
                    print(f"Error: Archivo de migración no encontrado: {migration_file}")
                    all_success = False
                    continue
            else:
                print(f"Error: Archivo de migración no encontrado: {migration_file}")
                all_success = False
                continue
        
        print(f"\n{'='*60}")
        print(f"Aplicando: {migration_file.name}")
        success = apply_migration(str(migration_file))
        all_success = all_success and success
    
    print(f"\n{'='*60}")
    if all_success:
        print("✓ Todas las migraciones aplicadas exitosamente")
        print("\n📋 Próximos pasos:")
        print("1. Verificar en Supabase que RLS está habilitado:")
        print("   - Ir a Database → Tables → Seleccionar tabla")
        print("   - Ver Authentication → Policies")
        print("2. Si hay errores de tipo UUID/BIGINT:")
        print("   - Revisar: UUID_BIGINT_DIAGNOSTIC.md")
    else:
        print("✗ Algunas migraciones fallaron")
        print("\n🔧 Troubleshooting:")
        print("1. Verificar credenciales en backend/.env")
        print("2. Si error es 'uuid = integer':")
        print("   - Revisar: UUID_BIGINT_DIAGNOSTIC.md")
    
    sys.exit(0 if all_success else 1)
