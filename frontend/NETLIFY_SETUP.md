# Configuración de Netlify para PQ Trader

## Variables de Entorno Requeridas

Configura las siguientes variables de entorno en Netlify Dashboard:

### Navegación en Netlify:
1. Ve a tu sitio en Netlify
2. Click en **Site settings**
3. Click en **Environment variables** (o **Build & deploy** > **Environment**)
4. Click en **Add a variable** o **Add environment variable**

### Variables Requeridas:

```bash
# API Backend URL - IMPORTANTE: Usa tu URL de backend en producción
NEXT_PUBLIC_API_URL=https://api.pqtrader.com/api

# Stripe Public Key - Usa tu clave pública de Stripe
# Para desarrollo: pk_test_...
# Para producción: pk_live_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Site URL - URL de tu sitio en Netlify
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app

# Opcional: Darwinex API Key
NEXT_PUBLIC_DARWINEX_API_KEY=your_darwinex_key_here

# Opcional: Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Desactivar telemetría de Next.js (opcional, mejora velocidad de build)
NEXT_TELEMETRY_DISABLED=1
```

## Configuración de Build en Netlify

Si no se configuró automáticamente con `netlify.toml`:

### Build settings:
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/.next`
- **Node version:** `20`

### Deploy settings:
- **Branch to deploy:** `main` (o tu rama principal)
- **Production branch:** `main`

## Solución de Problemas Comunes

### Error: "Page not found" en rutas dinámicas
✅ Ya configurado en `netlify.toml` con el plugin `@netlify/plugin-nextjs`

### Error: "Failed to compile" - useAuth not found
✅ Verifica que `NEXT_PUBLIC_API_URL` esté configurada
✅ El AuthProvider está correctamente configurado en el layout

### Error: Build timeout
- Incrementa el tiempo de build en Site Settings > Build & deploy > Build settings
- O contacta soporte de Netlify para aumentar el límite

### Error: API calls failing in production
- Verifica que `NEXT_PUBLIC_API_URL` apunte a tu backend en producción
- Asegúrate de que el backend tenga CORS configurado para tu dominio de Netlify
- Verifica que el backend esté ejecutándose y accesible

### Error: Environment variables not working
- Las variables **DEBEN** comenzar con `NEXT_PUBLIC_` para ser accesibles en el cliente
- Después de agregar variables, haz un **Clear cache and deploy site**

## Verificación Post-Deploy

1. **Check build logs:** Revisa los logs de build en Netlify para errores
2. **Test environment variables:** 
   ```bash
   # En la consola del navegador (F12):
   console.log(process.env.NEXT_PUBLIC_API_URL)
   ```
3. **Test API connection:** Intenta hacer login para verificar la conexión con el backend
4. **Check 404 errors:** Navega a diferentes rutas para asegurar que el routing funcione

## Re-deploy Forzado

Si necesitas forzar un nuevo deploy después de cambiar variables:

1. En Netlify Dashboard, ve a **Deploys**
2. Click en **Trigger deploy**
3. Selecciona **Clear cache and deploy site**

## Notas Importantes

⚠️ **NUNCA** commits las variables de entorno reales al repositorio
⚠️ Usa claves de **test** de Stripe en desarrollo/staging
⚠️ El backend debe permitir CORS desde tu dominio de Netlify
⚠️ Cambia las URLs de ejemplo por tus URLs reales

## Contacto Backend

El backend debe estar configurado para aceptar requests desde:
- `https://your-site.netlify.app`
- `https://pqtrader.com` (si usas dominio custom)

Verifica el archivo `backend/src/index.ts` en la sección de CORS.
