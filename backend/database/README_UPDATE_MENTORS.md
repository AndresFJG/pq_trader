# Actualización de Datos de Mentores en Supabase

Este directorio contiene los scripts necesarios para actualizar la información de los mentores en la base de datos de Supabase.

## 📁 Archivos Disponibles

### 1. SQL Directo - `update_mentors_data.sql`
Script SQL puro para ejecutar directamente en Supabase Dashboard.

### 2. Script Automatizado - `src/scripts/update-mentors.ts`
Script TypeScript que automatiza la actualización usando la API de Supabase.

---

## 🚀 Opción 1: Actualización Manual con SQL

**Ventajas:**
- Rápido y directo
- No requiere ejecutar código
- Ideal para cambios únicos

**Pasos:**

1. Ir a tu proyecto Supabase: https://app.supabase.com/
2. Navegar a **SQL Editor** (icono de base de datos en el sidebar)
3. Click en **"New Query"**
4. Copiar y pegar el contenido de `update_mentors_data.sql`
5. Click en **"Run"** o presionar `Ctrl + Enter`
6. Verificar los resultados en la tabla inferior

**Qué hace:**
```sql
-- Actualiza Marco Andrés (ID: 1)
- Rating: 5.0 → 4.9
- Descripción completa profesional
- Link MQL5: https://www.mql5.com/es/users/marcotisma/news
- Especialidades actualizadas

-- Actualiza Jeremias (ID: 2)
- Estudiantes: 45 → 150
- Rating: 5.0 → 4.9
- Sesiones: 95 → 200
- Formación académica (UCEMA, Blas Pascal)
- Experiencia Darwinex
```

---

## 🤖 Opción 2: Actualización Automatizada con Script

**Ventajas:**
- Automatizable
- Reutilizable
- Incluye verificación de resultados
- Logs detallados

**Pasos:**

1. Asegurarte de que las variables de entorno estén configuradas:
   ```bash
   # En backend/.env
   SUPABASE_URL=tu_url_proyecto
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   ```

2. Desde la raíz del proyecto backend:
   ```bash
   cd backend
   npm install  # Si no lo has hecho
   npx ts-node src/scripts/update-mentors.ts
   ```

3. Esperar a que termine (debería tomar 2-3 segundos)

**Output esperado:**
```
🚀 Iniciando actualización de mentores...

📝 Actualizando Marco Andrés...
✅ Marco Andrés actualizado correctamente
   - Estudiantes: 50
   - Rating: 4.9
   - Sesiones: 100
   - Especialidades: 4

📝 Actualizando Jeremias...
✅ Jeremias actualizado correctamente
   - Estudiantes: 150
   - Rating: 4.9
   - Sesiones: 200
   - Especialidades: 3

📊 Verificando resultados...

✅ Mentores actualizados:
┌─────────┬──────────────────┬─────────────────────────────────────┬──────────────┬────────┬───────────┐
│ ID      │ Nombre           │ Título                              │ Estudiantes  │ Rating │ Sesiones  │
├─────────┼──────────────────┼─────────────────────────────────────┼──────────────┼────────┼───────────┤
│ 1       │ Marco Andrés     │ Trader & tutor                      │ 50           │ 4.9    │ 100       │
│ 2       │ Jeremias         │ Especialista en Trading Algorítmico │ 150          │ 4.9    │ 200       │
└─────────┴──────────────────┴─────────────────────────────────────┴──────────────┴────────┴───────────┘

✨ Actualización completada exitosamente!
```

---

## 🔄 Sincronización con PostgREST Cache

Después de actualizar los datos, es posible que necesites refrescar el cache de PostgREST:

### Método 1: SQL Notify
```sql
-- Ejecutar en SQL Editor después del UPDATE
NOTIFY pgrst, 'reload schema';
```

### Método 2: Reiniciar Proyecto (más confiable)
1. Dashboard → Settings → General
2. Click en **"Restart project"**
3. Esperar 30-60 segundos

---

## 📊 Datos Actualizados

### Marco Andrés
- **Estudiantes:** 50
- **Rating:** 4.9/5.0
- **Sesiones:** 100
- **Especialidades:**
  - Localizador de ventajas estadísticas
  - Métodos personalizados de optimización
  - Estrategias de volatilidad extrema
  - MQL5, fxDremma, EAbuilder
- **Link:** https://www.mql5.com/es/users/marcotisma/news

### Jeremias
- **Estudiantes:** 150
- **Rating:** 4.9/5.0
- **Sesiones:** 200
- **Especialidades:**
  - Backtesting y optimización (WFA)
  - Tests de robustez (Montecarlo)
  - Portafolios algorítmicos

---

## 🛠️ Troubleshooting

### Error: "No se encontró el mentor con ID X"
**Solución:** Verificar que los mentores existen en la base de datos:
```sql
SELECT * FROM public.mentors;
```

### Error: "permission denied for table mentors"
**Solución:** Asegurarte de usar el Service Role Key, no el Anon Key:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx  # Debe empezar con "eyJ"
```

### Los cambios no se reflejan en la API
**Solución:** Refrescar el cache de PostgREST (ver sección anterior)

---

## 📝 Notas Importantes

1. **Imágenes de Mentores:**
   - Las fotos están en Supabase Storage bucket `mentors`
   - URLs actuales:
     - Marco: `Martin.jpg`
     - Jeremias: `Jeremias.jpeg`
   - No requieren actualización en la BD

2. **Highlights (Especialidades):**
   - Se almacenan como JSONB array
   - Máximo recomendado: 4-5 items por mentor

3. **Rating:**
   - Escala: 0.0 a 5.0
   - Formato: DECIMAL(3,2)
   - Ejemplos válidos: 4.9, 5.0, 4.75

4. **Campos Opcionales:**
   - `phone`: puede ser NULL
   - `linkedin`: puede estar vacío ''
   - `email`: se usa para botón de contacto

---

## 🎯 Recomendación

**Para actualización única:** Usa SQL directo (Opción 1) - más rápido

**Para actualizaciones frecuentes:** Usa el script automatizado (Opción 2) - más confiable y con logs

---

## 📞 Soporte

Si encuentras algún problema:
1. Verificar que estés conectado a Supabase
2. Revisar que los IDs de mentores existan (1 y 2)
3. Confirmar que las variables de entorno estén configuradas
4. Revisar logs del backend para errores de RPC

