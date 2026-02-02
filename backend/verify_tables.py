#!/usr/bin/env python3
"""
Script para verificar la estructura de las tablas en Supabase
"""

import os
import sys
from dotenv import load_dotenv

# Cargar .env
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY") or os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Faltan variables de entorno")
    sys.exit(1)

import requests

def get_table_columns(table_name):
    """Obtiene las columnas de una tabla"""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}?limit=0"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            # Las columnas vienen en el header Content-Range o en la estructura
            print(f"✅ Tabla '{table_name}' existe")
            print(f"   Status: {response.status_code}")
            print(f"   Headers: {dict(response.headers)}")
        else:
            print(f"❌ Tabla '{table_name}' no existe o error: {response.status_code}")
            print(f"   Respuesta: {response.text}")
    except Exception as e:
        print(f"❌ Error consultando '{table_name}': {e}")

def main():
    print("=" * 70)
    print("VERIFICADOR DE ESTRUCTURA DE TABLAS - SUPABASE")
    print("=" * 70)
    
    tables = [
        'users',
        'courses',
        'enrollments',
        'lessons',
        'mentorships',
        'mentorship_sessions',
        'mentorship_bookings',
        'portfolios',
        'transactions'
    ]
    
    print(f"\nVerificando {len(tables)} tablas en Supabase...\n")
    
    for table in tables:
        get_table_columns(table)
        print()

if __name__ == "__main__":
    main()
