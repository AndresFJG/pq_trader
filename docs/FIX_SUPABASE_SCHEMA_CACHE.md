# Solución al Error PGRST205 - Schema Cache de Supabase

## Error Actual:
```
Could not find the table 'public.mentors' in the schema cache
code: PGRST205
hint: Perhaps you meant the table 'public.mentorships'
```

## Causa:
La tabla `mentors` existe en Supabase pero el **PostgREST API cache** no se ha actualizado. Esto ocurre cuando creas tablas manualmente en la interfaz de Supabase.

## Solución 1: Refrescar Schema Cache (RECOMENDADO - 30 segundos)

### Opción A: Desde Supabase Dashboard
1. Ve a **Supabase Dashboard** → `https://supabase.com/dashboard/project/nmkmhtfdpoutcvizoxrr`
2. Menú lateral → **Settings** (⚙️)
3. **API** section
4. Encuentra el botón **"Reload schema"** o **"Refresh schema cache"**
5. Click en el botón
6. Espera 10 segundos
7. Prueba nuevamente: `curl http://localhost:3000/api/mentors`

### Opción B: Reiniciar Proyecto Supabase
1. Supabase Dashboard → **Settings** → **General**
2. Scroll down → **Restart project**
3. Espera 1-2 minutos
4. Prueba nuevamente

### Opción C: Esperar (No recomendado)
El cache se refresca automáticamente cada 5-10 minutos (pero es muy lento)

## Solución 2: Verificar Conexión (Si persiste el error)

### Verificar .env del Frontend
Archivo: `frontend/.env.local`

Debe contener:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://nmkmhtfdpoutcvizoxrr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verificar .env del Backend
Archivo: `backend/.env`

Debe contener:
```bash
SUPABASE_URL=https://nmkmhtfdpoutcvizoxrr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Solución 3: Verificar RLS Policy

Ejecuta este SQL en Supabase para asegurarte de que la política RLS existe:

```sql
-- Ver políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'mentors';

-- Si no hay ninguna, crea la política:
CREATE POLICY "Permitir lectura pública de mentores"
ON public.mentors FOR SELECT 
TO anon, authenticated 
USING (true);
```

## Verificación Final

Una vez que hayas refrescado el schema cache, ejecuta:

```bash
# Desde PowerShell
curl http://localhost:3000/api/mentors

# Deberías ver:
# [
#   {
#     "id": "1",
#     "name": "Marco Andrés",
#     "title": "Trader & tutor",
#     ...
#   },
#   {
#     "id": "2",
#     "name": "Andrés J",
#     ...
#   }
# ]
```

## Solución 4: Recrear Cliente Supabase (Última opción)

Si nada funciona, modifica temporalmente el código para forzar la reconexión:

**En `frontend/src/lib/supabase.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public' // Forzar schema público
  },
  global: {
    headers: { 
      'x-client-info': 'pq-trader-frontend',
      'apikey': supabaseAnonKey 
    }
  }
});
```

## Debugging Adicional

Si el error persiste, ejecuta este SQL en Supabase para verificar que la tabla existe:

```sql
-- Verificar que la tabla existe
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'mentors';

-- Ver estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mentors';

-- Ver datos en la tabla
SELECT id, name, title FROM mentors;
```

---

**NOTA IMPORTANTE:**
El error `PGRST205` es un problema de cache de PostgREST, NO un problema de tu código. La tabla existe (se ve en las capturas), solo necesitas refrescar el schema cache en Supabase Dashboard.
