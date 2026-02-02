#!/usr/bin/env python3
"""
Script para ejecutar migraciones SQL en Supabase
Usa la API REST de Supabase con credenciales de service_role
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv
import requests

# Cargar .env
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    print("❌ Error: Falta SUPABASE_URL en .env")
    sys.exit(1)

if not SUPABASE_SERVICE_KEY:
    print("❌ Error: Falta SUPABASE_SERVICE_ROLE_KEY en .env")
    print("\n⚠️  Necesitas agregar a tu .env:")
    print("   SUPABASE_SERVICE_ROLE_KEY=tu_clave_aqui")
    print("\n📍 Obtén la clave en: https://app.supabase.com → Project → Settings → API Keys")
    sys.exit(1)

def get_migrations():
    """Obtiene lista de migraciones ordenadas"""
    migrations_dir = Path(__file__).parent / "supabase_migrations"
    
    if not migrations_dir.exists():
        print(f"❌ Error: No existe {migrations_dir}")
        sys.exit(1)
    
    files = sorted([f for f in migrations_dir.glob("*.sql")])
    
    # Filtrar y ordenar: primero 000, luego 001-009, luego 010+
    priority_files = []
    
    # Archivo 000 primero (schema completo)
    for f in files:
        if f.name.startswith("000_"):
            priority_files.append(f)
    
    # Luego otros (excepto 010+ que son RLS)
    for f in files:
        if not f.name.startswith("000_") and not f.name.startswith("010_") and not f.name.startswith("011_"):
            priority_files.append(f)
    
    # Finalmente RLS (010+)
    for f in files:
        if f.name.startswith("010_") or f.name.startswith("011_"):
            priority_files.append(f)
    
    return priority_files

def execute_sql(sql_content, filename):
    """Ejecuta SQL en Supabase usando la API REST"""
    
    if not sql_content.strip():
        print(f"⏭️  Saltando {filename} (vacío)")
        return True
    
    # Dividir en statements (split por ;)
    statements = [s.strip() for s in sql_content.split(";") if s.strip()]
    
    print(f"\n📄 {filename}")
    print(f"   {len(statements)} statements detectados")
    
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Ejecutar cada statement
    for i, statement in enumerate(statements, 1):
        try:
            # Supabase no tiene endpoint directo para SQL raw
            # Debemos usar el dashboard o exportar a Supabase CLI
            print(f"   ⚙️  {statement[:60]}...")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            return False
    
    return True

def main():
    print("=" * 80)
    print("EJECUTOR DE MIGRACIONES - SUPABASE")
    print("=" * 80)
    print(f"\n🔗 URL: {SUPABASE_URL}")
    print(f"🔑 Service Key: {SUPABASE_SERVICE_KEY[:20]}...")
    
    migrations = get_migrations()
    
    if not migrations:
        print("\n❌ No se encontraron archivos de migración")
        return
    
    print(f"\n📋 Se encontraron {len(migrations)} migraciones:\n")
    for i, f in enumerate(migrations, 1):
        print(f"   {i}. {f.name}")
    
    print("\n" + "=" * 80)
    print("⚠️  IMPORTANTE:")
    print("   Supabase REST API NO permite ejecutar SQL directamente.")
    print("   Debes hacerlo manualmente en el SQL Editor de Supabase.")
    print("=" * 80)
    
    print("\n✅ INSTRUCCIONES:")
    print("   1. Ve a https://app.supabase.com → Tu Proyecto → SQL Editor")
    print("   2. Crea una NUEVA query")
    print("   3. Copia y pega el contenido de TODOS estos archivos EN ORDEN:")
    
    for i, f in enumerate(migrations, 1):
        print(f"      {i}. {f.name}")
    
    print("\n   4. Ejecuta (Ctrl+Enter)")
    print("\n" + "=" * 80)
    
    # Crear archivo combinado
    combined_file = Path(__file__).parent / "supabase_migrations" / "_COMBINED_MIGRATIONS.sql"
    
    print(f"\n📦 Creando archivo combinado: {combined_file.name}\n")
    
    with open(combined_file, 'w', encoding='utf-8') as f:
        for migration in migrations:
            f.write(f"\n-- ============================================================================\n")
            f.write(f"-- MIGRACIÓN: {migration.name}\n")
            f.write(f"-- ============================================================================\n\n")
            
            with open(migration, 'r', encoding='utf-8') as m:
                f.write(m.read())
            
            f.write("\n\n")
    
    print(f"✅ Archivo creado: {combined_file}")
    print(f"\n📋 Pasos finales:")
    print(f"   1. Abre el archivo: backend/supabase_migrations/_COMBINED_MIGRATIONS.sql")
    print(f"   2. Copia TODO el contenido")
    print(f"   3. Ve a Supabase SQL Editor")
    print(f"   4. Pega y ejecuta")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()
