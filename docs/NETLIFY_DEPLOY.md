# 🌐 Despliegue Frontend con Netlify

Guía para desplegar el frontend de Next.js en ~5 minutos.

---

## 📋 Pre-requisitos

- Backend ya desplegado en Railway
- URL del backend (ej: `https://pq-trader.up.railway.app`)
- Cuenta en Netlify (gratis)
- Código en GitHub

---

## 🚀 Paso 1: Deploy Automático

### Opción A: Desde Netlify Dashboard (Más fácil)

1. Ir a https://app.netlify.com
2. Login con GitHub
3. "Add new site" → "Import an existing project"
4. Seleccionar repositorio `pq_trader`
5. Configurar build:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/.next
   ```
6. Click "Deploy site"

### Opción B: Desde CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Ir a carpeta frontend
cd frontend

# Deploy
netlify deploy --prod
```

---

## ⚙️ Paso 2: Variables de Entorno

En Netlify Dashboard → Site settings → Environment variables:

```bash
# API Backend (URL de Railway)
NEXT_PUBLIC_API_URL=https://tu-backend-railway.up.railway.app/api

# Stripe Public Key (LIVE)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_51XXXXXXXXXXXXXXXXXXXXXXXXXX

# Environment
NEXT_PUBLIC_ENV=production

# Optional: Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_PORTFOLIO_RENTAL=true
```

**⚠️ Importante:** Después de agregar variables, hacer re-deploy:
```bash
netlify deploy --prod
```

O desde dashboard: "Deploys" → "Trigger deploy"

---

## 🌐 Paso 3: Dominio Personalizado

### Dominio de Netlify (Automático)
```
https://tu-sitio-123456.netlify.app
```

### Dominio Propio

1. Netlify Dashboard → "Domain settings"
2. "Add custom domain"
3. Agregar: `www.tu-dominio.com`
4. Netlify te dará instrucciones DNS:

```
# En tu proveedor de dominio:
A record: @ → 75.2.60.5
CNAME: www → tu-sitio.netlify.app
```

SSL automático ✅ (gratis con Let's Encrypt)

---

## 🔒 Paso 4: Configurar Redirects (Next.js)

Crear archivo `frontend/public/_redirects`:

```
# SPA fallback
/*    /index.html   200

# Force HTTPS
http://* https://:splat 301!

# API proxy (opcional)
/api/*  https://tu-backend-railway.up.railway.app/api/:splat  200
```

**O** crear `frontend/netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "https://tu-backend-railway.up.railway.app/api/:splat"
  status = 200
  force = false

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

---

## ⚡ Paso 5: Optimizaciones

### Cache de Assets

Netlify hace esto automáticamente:
- ✅ CDN global
- ✅ Cache de imágenes
- ✅ Brotli compression
- ✅ HTTP/2

### Build Optimization

En `frontend/next.config.js`:

```javascript
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Optimización de imágenes
  images: {
    domains: ['nmkmhtfdpoutcvizoxrr.supabase.co'], // Supabase Storage
    formats: ['image/avif', 'image/webp'],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
        ],
      },
    ];
  },
};
```

---

## 🎯 Paso 6: Verificar Deployment

### Test Frontend
```bash
# Abrir en navegador
https://tu-sitio.netlify.app

# Verificar que carga correctamente
# Verificar console (F12) - no debe haber errores
```

### Test Integración con Backend

1. Ir a página de login
2. Intentar login con: `admin@pqtrader.com` / `Admin123!`
3. Verificar que funcione
4. Abrir Network tab (F12) → Ver que llama a tu API de Railway

---

## 🔄 Paso 7: CI/CD Automático

Netlify auto-deploys en cada push:

```bash
git push origin main
```

→ Netlify rebuilds automáticamente ✅

Para branch previews:
```bash
git checkout -b feature/nueva-funcionalidad
git push origin feature/nueva-funcionalidad
```

→ Netlify crea preview URL automáticamente

---

## 📊 Paso 8: Monitoreo

### Netlify Analytics (Gratis)

- Pageviews
- Unique visitors
- Top pages
- Bandwidth usage

### Deploy Notifications

Configurar en Settings → Build & deploy → Deploy notifications:
- Email
- Slack
- Discord

---

## 💰 Costos

### Tier Gratuito
- 100 GB bandwidth/mes
- 300 build minutes/mes
- 1 concurrent build
- **Suficiente para empezar** ✅

### Tier Pro ($19/mes)
- 1 TB bandwidth
- Unlimited builds
- Analytics avanzados
- Background functions

---

## 🚨 Troubleshooting

### Error: "Module not found"
```bash
# Limpiar cache y rebuilds
rm -rf .next node_modules
npm install
npm run build
```

### Error: "API calls failing"
- Verificar `NEXT_PUBLIC_API_URL` en variables
- Verificar CORS en backend (debe incluir tu dominio Netlify)

### Build timeout
- Reducir bundle size
- Usar dynamic imports:
  ```javascript
  const Component = dynamic(() => import('./Component'));
  ```

### Images not loading
- Verificar `next.config.js` tiene el dominio de Supabase
- Verificar URLs de imágenes son absolutas

---

## 🔗 Actualizar CORS en Backend

Después de tener tu URL de Netlify, actualizar en Railway:

```bash
# Variables de entorno Railway:
CORS_ORIGIN=https://tu-sitio.netlify.app
FRONTEND_URL=https://tu-sitio.netlify.app
```

Re-deploy backend para aplicar cambios.

---

## 📱 Siguientes Pasos

1. ✅ Configurar analytics (Google Analytics, etc.)
2. ✅ Agregar sitemap.xml
3. ✅ Configurar SEO meta tags
4. ✅ Test en dispositivos móviles
5. ✅ Lighthouse audit (Performance, SEO, Accessibility)

---

## 🆘 Soporte

- Netlify Support: https://answers.netlify.com
- Docs: https://docs.netlify.com
- Status: https://www.netlifystatus.com

---

## 🎉 Listo!

Tu aplicación está en producción:
- ✅ Backend: Railway
- ✅ Frontend: Netlify
- ✅ Database: Supabase
- ✅ Storage: Supabase Storage
- ✅ SSL: Automático
- ✅ CDN: Global

**Tiempo total: ~5 minutos** ⏱️
