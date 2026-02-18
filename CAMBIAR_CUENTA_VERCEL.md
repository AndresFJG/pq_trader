# Cambiar Cuenta de Vercel - Guía Paso a Paso

## 1. Cerrar Sesión de la Cuenta Actual

```powershell
# Cerrar sesión de Vercel
npx vercel logout
```

Esto cerrará la sesión de la cuenta actual.

---

## 2. Iniciar Sesión con Nueva Cuenta

```powershell
# Iniciar sesión con nueva cuenta
npx vercel login
```

Se abrirá tu navegador para que inicies sesión:
- **GitHub** (recomendado)
- **GitLab**
- **Bitbucket**
- **Email**

---

## 3. Eliminar Configuración Anterior (Opcional)

Si existe una carpeta `.vercel` con configuración vieja:

```powershell
# En la carpeta frontend
cd frontend

# Eliminar configuración anterior (si existe)
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue
```

---

## 4. Configurar el Proyecto

```powershell
# Asegúrate de estar en la carpeta frontend
cd frontend

# Vincular con un nuevo proyecto
npx vercel link
```

Te preguntará:
1. **Set up and deploy?** → Yes
2. **Which scope?** → Selecciona tu cuenta nueva
3. **Link to existing project?** → No (crea uno nuevo) o Yes (si ya existe)
4. **Project name?** → `pq-trader` (o el nombre que prefieras)

---

## 5. Configurar Variables de Entorno

**Opción A - Desde la terminal:**

```powershell
# Agregar variables de entorno una por una
npx vercel env add NEXT_PUBLIC_API_URL production
# Pegar: tu URL de Railway del backend

npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Pegar: https://nmkmhtfdpoutcvizoxrr.supabase.co

npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Pegar: tu anon key
```

**Opción B - Desde el Dashboard de Vercel:**

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Settings → Environment Variables
4. Agrega:
   - `NEXT_PUBLIC_API_URL` → `https://pqtrader-backend.up.railway.app/api`
   - `NEXT_PUBLIC_SUPABASE_URL` → `https://nmkmhtfdpoutcvizoxrr.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `tu_anon_key`

---

## 6. Deployar a Producción

```powershell
# Deploy a producción
npx vercel --prod
```

O simplemente:

```powershell
# Deploy (automáticamente en producción si es main/master)
npx vercel
```

---

## 7. Verificar el Deploy

Una vez completado, verás:
```
✓ Deployment ready
https://pq-trader-xxxx.vercel.app
```

Abre la URL y verifica que todo funcione correctamente.

---

## 📝 Script Automatizado

También puedes ejecutar este script completo:

```powershell
# 1. Cerrar sesión actual
npx vercel logout

# 2. Iniciar sesión con nueva cuenta
npx vercel login

# 3. Ir a frontend
cd frontend

# 4. Limpiar configuración anterior
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue

# 5. Vincular proyecto
npx vercel link

# 6. Deploy a producción
npx vercel --prod
```

---

## ⚠️ Importante

### Variables de Entorno Necesarias:

```env
NEXT_PUBLIC_API_URL=https://pqtrader-backend.up.railway.app/api
NEXT_PUBLIC_SUPABASE_URL=https://nmkmhtfdpoutcvizoxrr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**NO olvides agregar estas variables** o la aplicación no funcionará en producción.

---

## 🔧 Solución de Problemas

### Error: "No token found"
→ Ejecuta `npx vercel login` de nuevo

### Error: "Project already exists"
→ Usa `npx vercel link` en lugar de crear uno nuevo

### Error: "Build failed"
→ Verifica que las variables de entorno estén configuradas

### Error: "Not logged in"
→ Ejecuta `npx vercel whoami` para verificar tu sesión

---

## 🎯 Flujo Recomendado (Primera Vez)

```powershell
# Paso 1: Logout
npx vercel logout

# Paso 2: Login con nueva cuenta
npx vercel login

# Paso 3: Ir a frontend
cd C:\Users\USER\Desktop\pq_trader\frontend

# Paso 4: Deploy directo (Vercel configurará todo automáticamente)
npx vercel --prod

# Se te preguntará:
# - Set up and deploy? → Y
# - Which scope? → Selecciona tu cuenta
# - Link to existing project? → N
# - What's your project's name? → pq-trader
# - In which directory is your code located? → ./
```

Vercel detectará automáticamente que es Next.js y configurará todo.

**Después del primer deploy, agrega las variables de entorno desde el dashboard.**

---

## 📞 Comandos Útiles

```powershell
# Ver quién está logueado
npx vercel whoami

# Ver lista de proyectos
npx vercel list

# Ver información del proyecto actual
npx vercel inspect

# Ver logs del deployment
npx vercel logs

# Eliminar un proyecto
npx vercel remove pq-trader
```

---

**Fecha**: 18 de febrero de 2026  
**Estado**: Listo para cambiar de cuenta Vercel
