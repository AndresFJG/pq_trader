# 🚀 Despliegue Rápido con Railway

Esta guía te llevará desde cero hasta tener tu backend en producción en ~10 minutos.

---

## 📋 Pre-requisitos

- Cuenta de GitHub
- Código subido a GitHub
- Cuenta en Railway.app (gratis)
- Credenciales de Stripe y PayPal LIVE

---

## 🎯 Paso 1: Crear Cuenta en Railway

1. Ve a https://railway.app
2. Click "Start a New Project"
3. Login con GitHub
4. Autoriza Railway en GitHub

---

## 🚂 Paso 2: Deploy desde GitHub

### Opción A: Desde Dashboard de Railway

1. Click "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca tu repositorio `pq_trader`
4. Railway detectará automáticamente que es Node.js

### Opción B: Desde CLI (Recomendado)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ir a la carpeta del backend
cd backend

# Inicializar proyecto
railway init

# Link con tu proyecto de Railway
railway link

# Deploy
railway up
```

---

## ⚙️ Paso 3: Configurar Variables de Entorno

En Railway Dashboard → Variables:

```bash
# Server
NODE_ENV=production
PORT=4000

# Database (copiar de Supabase)
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
DB_DIALECT=postgres
DB_SSL=true

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# JWT (usar los mismos de desarrollo)
JWT_SECRET=tu-secret-de-64-caracteres-minimo
JWT_EXPIRE=1d
JWT_REFRESH_SECRET=tu-refresh-secret-de-64-caracteres-minimo
JWT_REFRESH_EXPIRE=7d

# Stripe LIVE
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXX

# PayPal LIVE
PAYPAL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
PAYPAL_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
PAYPAL_MODE=live

# Email (Gmail ejemplo)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password
EMAIL_FROM=noreply@pqtrader.com

# Frontend (actualizar después de deploy frontend)
FRONTEND_URL=https://tu-dominio.netlify.app

# CORS
CORS_ORIGIN=https://tu-dominio.netlify.app

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**💡 Tip:** Copia y pega todo de una vez en "Raw Editor"

---

## 🌐 Paso 4: Obtener URL del Backend

Railway te dará una URL automática:
```
https://pq-trader-production.up.railway.app
```

**Guardar esta URL** - la necesitarás para el frontend.

---

## 🔒 Paso 5: Configurar Dominio Personalizado (Opcional)

En Railway Dashboard:

1. Click en "Settings"
2. "Domains" → "Custom Domain"
3. Agregar: `api.tu-dominio.com`
4. Configurar DNS en tu proveedor:
   ```
   CNAME api → pq-trader-production.up.railway.app
   ```

SSL automático ✅

---

## 🪝 Paso 6: Configurar Webhooks

### Stripe Webhook

1. Ir a https://dashboard.stripe.com/webhooks
2. "Add endpoint"
3. URL: `https://tu-url-railway.up.railway.app/api/stripe/webhook`
4. Eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiar "Signing secret"
6. Actualizar en Railway: `STRIPE_WEBHOOK_SECRET`

### PayPal Webhook

1. Ir a https://developer.paypal.com/dashboard
2. Seleccionar app LIVE
3. "Add Webhook"
4. URL: `https://tu-url-railway.up.railway.app/api/paypal/webhook`
5. Eventos:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `BILLING.SUBSCRIPTION.CREATED`

---

## ✅ Paso 7: Verificar Deployment

### Test Health Checks

```bash
# Health check simple
curl https://tu-url-railway.up.railway.app/health

# Health check detallado
curl https://tu-url-railway.up.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "healthy",
  "services": {
    "database": { "status": "up" },
    "storage": { "status": "up" },
    "email": { "status": "up" }
  }
}
```

### Test API

```bash
# Login test
curl -X POST https://tu-url-railway.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pqtrader.com","password":"Admin123!"}'
```

---

## 📊 Paso 8: Monitoreo

Railway incluye:
- ✅ Logs en tiempo real
- ✅ Métricas de CPU/RAM
- ✅ Uptime monitoring
- ✅ Deploy history

Ver logs:
```bash
railway logs
```

---

## 🔄 Paso 9: CI/CD Automático

Railway detecta automáticamente pushes a GitHub:

```bash
git push origin main
```

→ Railway re-deploys automáticamente ✅

Para desactivar auto-deploy:
- Railway Dashboard → Settings → GitHub → Disable

---

## 💰 Costos

### Tier Gratuito (Hobby)
- $5 USD de crédito mensual
- 500 horas de ejecución
- 512 MB RAM
- **Suficiente para empezar** ✅

### Tier Pro ($20/mes)
- Recursos ilimitados
- Priority support
- Custom domains
- Team collaboration

---

## 🚨 Troubleshooting

### Error: "Port already in use"
- Railway asigna el puerto automáticamente
- Tu app debe usar `process.env.PORT`

### Error: "Database connection failed"
- Verificar `DATABASE_URL` en variables
- Verificar que `DB_SSL=true`

### Error: "Module not found"
```bash
# Verificar que package.json tenga:
"scripts": {
  "start": "node dist/index.js",
  "build": "tsc"
}
```

### Logs no aparecen
```bash
railway logs --tail
```

---

## 📱 Siguiente: Deploy del Frontend

Ver: [RAILWAY_FRONTEND.md](./RAILWAY_FRONTEND.md)

---

## 🆘 Soporte

- Railway Discord: https://discord.gg/railway
- Docs: https://docs.railway.app
- Status: https://status.railway.app

---

**Tiempo total: ~10 minutos** ⏱️
