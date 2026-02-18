# Deploy a Producción - Notificaciones Corregidas

## 📦 Pasos para Deployar a Producción

### 1. Commit y Push

```powershell
# Ya están staged, solo hacer commit
git commit -m "fix: corregir URLs duplicadas en notificaciones y mejorar accesibilidad"

# Push a la rama principal
git push origin production-clean
```

### 2. Deploy en Vercel

#### Opción A: Automático (si ya está configurado GitHub en Vercel)

Si tu repositorio está conectado a Vercel, el deploy se hará automáticamente después del push.

Verifica en: https://vercel.com/dashboard

#### Opción B: Manual (si cambiaste de cuenta)

```powershell
cd frontend
npx vercel --prod
```

Si no estás logueado con la cuenta correcta:

```powershell
# 1. Cerrar sesión actual
npx vercel logout

# 2. Iniciar sesión con la cuenta correcta
npx vercel login

# 3. Deploy
npx vercel --prod
```

### 3. Verificar Variables de Entorno en Vercel

**CRÍTICO:** Vercel debe tener estas variables configuradas:

```env
NEXT_PUBLIC_API_URL=https://pqtrader-backend.up.railway.app/api
NEXT_PUBLIC_SUPABASE_URL=https://nmkmhtfdpoutcvizoxrr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

#### Cómo verificar:

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto "pq-trader"
3. Settings → Environment Variables
4. Verifica que `NEXT_PUBLIC_API_URL` sea: `https://pqtrader-backend.up.railway.app/api`
5. **Asegúrate que tenga `/api` al final**

Si falta `/api`, agrégalo y redeploy.

---

## ⚠️ Nota Importante sobre Railway Backend

El backend de Railway debe estar configurado para CORS con el dominio de producción.

### Verificar backend/src/index.ts:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.pqtraders.com',
  'https://pqtraders.com'
];
```

---

## 🧪 Probar en Producción

Después del deploy:

1. Abre https://www.pqtraders.com/admin
2. Abre DevTools Console (F12)
3. Busca logs de `[NotificationService]` y `[AdminHeader]`
4. Verifica que las URLs sean:
   ```
   https://pqtrader-backend.up.railway.app/api/notifications/unread
   ```
   **NO debe ser:**
   ```
   https://pqtrader-backend.up.railway.app/api/api/notifications/unread
   ```

5. El botón de notificaciones NO debe tener punto rojo
6. Al hacer click debe mostrar: "No hay notificaciones nuevas"

---

## 🔧 Solución de Problemas

### Problema: Sigue mostrando notificaciones mockeadas en producción

**Posibles causas:**

1. **Deploy no se completó**
   - Verifica en Vercel Dashboard que el último deployment sea exitoso
   - Revisa los logs de build

2. **Variables de entorno incorrectas**
   - Verifica en Vercel → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` debe terminar en `/api`

3. **Cache del CDN de Vercel**
   - Espera 1-2 minutos después del deploy
   - Haz "Hard Refresh": Ctrl + Shift + R
   - O limpia cache: Ctrl + Shift + Delete

4. **Backend no actualizado**
   - Verifica que el backend en Railway esté corriendo
   - URL: https://pqtrader-backend.up.railway.app/health

### Problema: Error CORS en producción

**Solución:**

El backend debe permitir el dominio de producción. Verifica en `backend/src/index.ts`:

```typescript
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://www.pqtraders.com',
      'https://pqtraders.com'
    ];
    // ...
  }
};
```

Si falta el dominio, agrégalo y redeploy el backend en Railway.

---

## 📊 Checklist de Deployment

- [ ] Commit hecho: `fix: corregir URLs duplicadas en notificaciones`
- [ ] Push a GitHub/GitLab
- [ ] Deploy en Vercel completado
- [ ] Variables de entorno verificadas en Vercel
- [ ] `NEXT_PUBLIC_API_URL` incluye `/api` al final
- [ ] Backend Railway corriendo correctamente
- [ ] CORS configurado para dominio de producción
- [ ] Probado en https://www.pqtraders.com/admin
- [ ] Sin notificaciones mockeadas
- [ ] DevTools muestra URLs correctas (sin `/api/api/`)

---

## 🚀 Comandos Rápidos

```powershell
# Commit y push
git commit -m "fix: corregir URLs duplicadas en notificaciones y mejorar accesibilidad"
git push origin production-clean

# Deploy a Vercel (si es manual)
cd frontend
npx vercel --prod

# Verificar deployment
npx vercel inspect https://www.pqtraders.com
```

---

**Estado:** Listo para deployar  
**Fecha:** 18 de febrero de 2026
