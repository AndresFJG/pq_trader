# 🚀 Guía de Inicio Rápido - Dashboard con Base de Datos

## ✅ Estado Actual

**Backend**: ✅ Conectado a Supabase  
**Frontend**: ✅ Dashboard completo creado  
**API**: ✅ Endpoints de cursos funcionando  
**Falta**: ⚠️ Crear tablas en Supabase

---

## 📋 Pasos para Activar Todo

### Paso 1: Crear Tablas en Supabase

1. **Ir a Supabase Dashboard**:
   ```
   https://supabase.com/dashboard
   ```

2. **Seleccionar tu proyecto**: `pqtrader`

3. **Ir a SQL Editor** (en el menú lateral)

4. **Ejecutar las migraciones en orden**:

   #### A) Crear tabla de Cursos
   - Click en "New Query"
   - Copiar y pegar TODO el contenido de:  
     `backend/supabase_migrations/001_create_courses.sql`
   - Click en "Run" (o F5)
   - Deberías ver: ✅ "Success. No rows returned"

   #### B) Crear tabla de Portafolios
   - Nueva query
   - Copiar contenido de: `002_create_portfolios.sql`
   - Run

   #### C) Crear tabla de Mentorías
   - Nueva query
   - Copiar contenido de: `003_create_mentorships.sql`
   - Run

   #### D) Crear tabla de Transacciones
   - Nueva query
   - Copiar contenido de: `004_create_transactions.sql`
   - Run

5. **Verificar que se crearon**:
   - Ir a "Table Editor" en Supabase
   - Deberías ver 4 tablas nuevas:
     - ✅ courses
     - ✅ portfolios
     - ✅ mentorships
     - ✅ transactions

---

### Paso 2: Verificar Backend

```bash
cd C:\Users\riosh\Desktop\pq_trader\backend
npm run test:db
```

**Deberías ver**:
```
✅ Courses table OK - 3 cursos encontrados
✅ Portfolios table OK - 4 portafolios encontrados
✅ Mentorships table OK - 3 mentorías encontradas
✅ Transactions table OK - 10 transacciones encontradas
```

Si ves errores, revisa que ejecutaste todas las migraciones.

---

### Paso 3: Iniciar Backend

```bash
cd C:\Users\riosh\Desktop\pq_trader\backend
npm run dev
```

**Deberías ver**:
```
info: ✅ Supabase Connected via HTTPS API (puerto 443)
info: 🚀 Server running on port 4000
```

**Dejar corriendo** en esta terminal.

---

### Paso 4: Iniciar Frontend

Abrir **NUEVA terminal**:

```bash
cd C:\Users\riosh\Desktop\pq_trader\frontend
npm run dev
```

**Deberías ver**:
```
- Local:   http://localhost:3001
```

---

### Paso 5: Probar el Dashboard

1. **Abrir navegador**:
   ```
   http://localhost:3001/admin/courses
   ```

2. **Deberías ver**:
   - 3 cursos en la tabla:
     - Trading para Principiantes ($99)
     - Análisis Técnico Avanzado ($299)
     - Estrategias de Swing Trading ($199)

3. **Probar funcionalidades**:

   #### Crear Curso
   - Click en botón verde "Crear Curso"
   - Completar formulario:
     ```
     Título: Mi Nuevo Curso de Prueba
     Descripción: Este es un curso de prueba para verificar que funciona
     Nivel: Principiante
     Precio: 150
     Duración: 6 semanas
     Estado: Publicado
     ```
   - Click "Crear Curso"
   - Deberías ver:
     - ✅ Notificación verde "Curso creado correctamente"
     - ✅ El nuevo curso aparece en la tabla

   #### Editar Curso
   - Click en "..." del curso que acabas de crear
   - Click "Editar"
   - Cambiar el precio a 200
   - Click "Actualizar"
   - Deberías ver:
     - ✅ Notificación "Curso actualizado correctamente"
     - ✅ El precio cambió en la tabla

   #### Eliminar Curso
   - Click en "..." → "Eliminar"
   - Confirmar en el diálogo
   - Deberías ver:
     - ✅ Notificación "Curso eliminado correctamente"
     - ✅ El curso desapareció de la tabla

   #### Buscar
   - Escribir "principiantes" en la barra de búsqueda
   - Deberías ver solo el curso "Trading para Principiantes"

---

### Paso 6: Verificar en Supabase

1. Ir a Supabase → Table Editor → courses
2. Deberías ver los cambios reflejados:
   - El curso que creaste
   - Los cambios que hiciste
   - El curso eliminado ya no está

---

## 🎯 Otras Páginas del Dashboard

### Usuarios
```
http://localhost:3001/admin/users
```
- Lista de usuarios de Supabase
- Activar/Desactivar
- Eliminar

### Dashboard Principal
```
http://localhost:3001/admin
```
- Estadísticas generales
- Próximamente: gráficas

### Mentorías, Portafolios, Transacciones
- Ya creadas visualmente
- Pendiente conectar con API (similar a cursos)

---

## 🐛 Troubleshooting

### Error: "Cannot connect to Supabase"
1. Verificar que `.env` tenga las credenciales correctas
2. Ejecutar `npm run test:db` para ver el error específico

### Error: "relation courses does not exist"
1. Verificar que ejecutaste la migración SQL en Supabase
2. Ir a Supabase → Table Editor → Ver si existe la tabla

### Error: "401 Unauthorized"
1. Verificar que el token JWT esté configurado
2. Revisar middleware de autenticación

### Frontend no muestra datos
1. Abrir DevTools (F12) → Console
2. Ver errores de red en tab "Network"
3. Verificar que backend esté corriendo en puerto 4000

### Backend no inicia
1. Verificar puerto 4000 no esté en uso:
   ```bash
   netstat -ano | findstr :4000
   ```
2. Matar proceso si es necesario:
   ```bash
   taskkill /PID <número> /F
   ```

---

## 📊 Datos de Prueba

Cada tabla viene con datos de ejemplo:

### Cursos (3)
- Trading para Principiantes - $99
- Análisis Técnico Avanzado - $299
- Estrategias de Swing Trading - $199

### Portafolios (4)
- Scalping EUR/USD - ROI: 23.5%
- Swing Trading S&P500 - ROI: -5.2%
- Day Trading Forex - ROI: 45.8%
- Crypto Portfolio - ROI: 156.3%

### Mentorías (3)
- Mentoría 1-on-1 - $500
- Grupo de Análisis - $150
- Workshop Avanzado - $800

### Transacciones (10)
- Generadas automáticamente con datos realistas

---

## 📝 Checklist de Verificación

Marca cada item cuando lo completes:

- [ ] Migración 001_create_courses.sql ejecutada
- [ ] Migración 002_create_portfolios.sql ejecutada
- [ ] Migración 003_create_mentorships.sql ejecutada
- [ ] Migración 004_create_transactions.sql ejecutada
- [ ] Comando `npm run test:db` pasa sin errores
- [ ] Backend corriendo en puerto 4000
- [ ] Frontend corriendo en puerto 3001
- [ ] Dashboard muestra 3 cursos
- [ ] Botón "Crear Curso" funciona
- [ ] Botón "Editar" funciona
- [ ] Botón "Eliminar" funciona
- [ ] Búsqueda funciona
- [ ] Notificaciones toast aparecen
- [ ] Cambios se ven en Supabase Table Editor

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu dashboard está **100% funcional** y conectado a la base de datos.

### Próximos pasos sugeridos:

1. **Conectar más páginas**:
   - Implementar mentorías (copiar lógica de cursos)
   - Implementar portafolios (solo lectura)
   - Implementar transacciones (solo lectura)

2. **Agregar autenticación**:
   - Proteger rutas `/admin`
   - Crear página de login
   - Verificar rol de admin

3. **Mejorar UX**:
   - Agregar paginación
   - Agregar filtros avanzados
   - Agregar exportación CSV

4. **Producción**:
   - Configurar RLS en Supabase
   - Desplegar backend en Railway/Render
   - Desplegar frontend en Vercel

---

**Última actualización**: 2026-01-20  
**Tiempo estimado**: 15-20 minutos para configuración completa

¿Necesitas ayuda? Revisa la documentación completa en:
- `docs/DASHBOARD_INTEGRATION.md`
- `backend/supabase_migrations/README.md`
