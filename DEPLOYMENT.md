# 🚀 Deployment Guide - PQ Trader

## Arquitectura de Producción

```
┌─────────────────┐
│   VERCEL        │  ← Frontend (Next.js 14)
│   (Frontend)    │     - SSR/SSG optimizado
└────────┬────────┘     - Edge Functions
         │
         │ HTTPS
         ↓
┌─────────────────┐
│   RAILWAY       │  ← Backend (Node.js + Express)
│   (Backend)     │     - API REST
└────────┬────────┘     - WebSockets (futuro)
         │
         ↓
┌─────────────────┐
│   SUPABASE      │  ← Database (PostgreSQL)
│   (Database)    │     - Storage
└─────────────────┘     - Auth (backup)
```

---

## 📋 Pre-requisitos

- [x] Cuenta en Vercel (free tier)
- [x] Cuenta en Railway ($5/mes crédito gratis)
- [x] Proyecto Supabase configurado
- [x] Stripe account (producción)
- [x] SendGrid API key
- [x] Dominio personalizado (opcional)

---

## 🎯 PASO 1: Deploy Backend en Railway

### 1.1 Conectar Repositorio

1. Ve a [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Selecciona el repositorio `pq_trader`
4. Railway detectará automáticamente el `backend/` folder

### 1.2 Configurar Variables de Entorno

En Railway Dashboard → Variables:

```bash
# Copiar desde backend/.env.production.example
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://tu-dominio.vercel.app

# Database
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# JWT (GENERAR NUEVOS SECRETS)
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Stripe (KEYS DE PRODUCCIÓN)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=noreply@tudominio.com

# ... resto de variables (ver .env.production.example)
```

### 1.3 Configurar Build

Railway debería auto-detectar:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `backend/`

Si no, configurar manualmente en Settings.

### 1.4 Deploy

1. Click "Deploy" en Railway
2. Esperar build (2-3 minutos)
3. Copiar la URL generada: `https://pqtrader-backend.up.railway.app`

### 1.5 Verificar Health Check

```bash
curl https://tu-backend.up.railway.app/health
# Respuesta esperada:
# {"status":"ok","timestamp":"2026-02-01T...","environment":"production"}
```

---

## 🌐 PASO 2: Deploy Frontend en Vercel

### 2.1 Conectar Repositorio

1. Ve a [Vercel.com](https://vercel.com)
2. "Add New Project" → "Import Git Repository"
3. Selecciona `pq_trader`
4. Framework Preset: **Next.js**
5. Root Directory: `frontend/`

### 2.2 Configurar Variables de Entorno

En Project Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### 2.3 Build Settings

Vercel auto-detecta Next.js, pero verifica:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.4 Deploy

1. Click "Deploy"
2. Esperar build (3-5 minutos)
3. Vercel genera URL: `https://pq-trader.vercel.app`

### 2.5 Configurar Dominio Personalizado (Opcional)

1. En Vercel → Settings → Domains
2. Agregar dominio: `www.tudominio.com`
3. Configurar DNS según instrucciones de Vercel

---

## 🔐 PASO 3: Configurar Webhooks

### 3.1 Stripe Webhook

1. Ir a [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. "Add endpoint"
3. URL: `https://tu-backend.up.railway.app/api/stripe/webhook`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiar **Signing secret** → Railway env: `STRIPE_WEBHOOK_SECRET`

### 3.2 PayPal Webhook

1. Ir a [PayPal Developer](https://developer.paypal.com/dashboard/webhooks)
2. "Create webhook"
3. URL: `https://tu-backend.up.railway.app/api/paypal/webhook`
4. Eventos:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
5. Copiar Webhook ID → Railway env: `PAYPAL_WEBHOOK_ID`

---

## ✅ PASO 4: Verificación Post-Deploy

### 4.1 Backend Health Checks

```bash
# Health check general
curl https://tu-backend.up.railway.app/health

# Detailed health
curl https://tu-backend.up.railway.app/api/health

# Test endpoint público
curl https://tu-backend.up.railway.app/api/courses
```

### 4.2 Frontend

1. Abrir `https://tu-dominio.vercel.app`
2. Verificar:
   - ✅ Página de inicio carga
   - ✅ Login/Register funciona
   - ✅ API calls al backend exitosas
   - ✅ Cookies HttpOnly funcionan

### 4.3 Test de Pago (Stripe Test Mode)

1. Usar tarjeta de prueba: `4242 4242 4242 4242`
2. Verificar webhook llega a Railway
3. Comprobar transacción en Supabase

---

## 🔧 PASO 5: Configuración CORS

Actualizar en Railway:

```bash
CORS_ORIGIN=https://tu-dominio.vercel.app,https://pq-trader.vercel.app
```

Si usas múltiples dominios, separar con comas.

---

## 📊 Monitoreo

### Railway Logs

```bash
# Ver logs en tiempo real
railway logs --tail 100
```

### Vercel Logs

Dashboard → Deployment → Runtime Logs

### Supabase

Dashboard → Logs → API/Auth logs

---

## 🚨 Troubleshooting

### Error: CORS blocked

**Solución**: Verificar `CORS_ORIGIN` en Railway incluye dominio de Vercel

### Error: Webhook signature invalid

**Solución**: Verificar `STRIPE_WEBHOOK_SECRET` esté correcto

### Error: Database connection timeout

**Solución**: 
1. Verificar `SUPABASE_URL` y `SUPABASE_ANON_KEY`
2. Revisar RLS policies en Supabase

### Error: Cookies no se guardan

**Solución**: 
1. Verificar `sameSite` y `secure` en auth.controller.ts
2. HTTPS debe estar habilitado (Vercel/Railway lo tienen por defecto)

---

## 🔒 Seguridad en Producción

### ✅ Checklist

- [x] Variables de entorno configuradas (no hardcoded)
- [x] JWT secrets generados aleatoriamente
- [x] HTTPS forzado (Vercel/Railway default)
- [x] HttpOnly cookies habilitadas
- [x] Rate limiting activo
- [x] Helmet security headers
- [x] CORS configurado correctamente
- [x] Webhook signatures validadas
- [x] Environment validation (Zod)

### Secrets Rotation

**Cada 90 días rotar**:
- JWT_SECRET
- JWT_REFRESH_SECRET
- Stripe webhook secrets (si se sospecha compromiso)

---

## 📈 Optimizaciones Post-Deploy

### 1. CDN (Vercel)
✅ Auto-configurado para assets estáticos

### 2. Database Indexes (Supabase)
```sql
-- Índices recomendados
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_courses_published ON courses(is_published);
```

### 3. Caching

Backend (agregar Redis):
```bash
railway add redis
```

### 4. Monitoring

Agregar Sentry:
```bash
# Frontend
npm install @sentry/nextjs

# Backend
npm install @sentry/node
```

---

## 💰 Costos Estimados

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| Vercel | Hobby (free) | $0 |
| Railway | Starter | ~$5 (500 horas gratis) |
| Supabase | Free tier | $0 (hasta 500MB DB) |
| **TOTAL** | | **~$5/mes** |

Para escalar:
- Vercel Pro: $20/mes (custom domains, más bandwidth)
- Railway: $20/mes (más recursos)
- Supabase Pro: $25/mes (más DB, backups)

---

## 🎉 Próximos Pasos

1. ✅ Deploy completado
2. 🔄 Configurar CI/CD (GitHub Actions)
3. 📊 Agregar analytics (Google Analytics / Plausible)
4. 🐛 Configurar Sentry para error tracking
5. 📧 Configurar email transaccional (SendGrid templates)
6. 🔔 Webhooks de notificaciones (Discord/Slack)

---

**Fecha**: 2026-02-01  
**Última actualización**: Deploy inicial  
**Autor**: PQ Trader Team
