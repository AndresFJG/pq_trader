# PQ Trader - Production Deployment Checklist

## ✅ Pre-Deploy Checklist

### 1. Código
- [x] Build sin errores TypeScript (`npm run build`)
- [x] Tests pasando (cuando se agreguen)
- [x] Linter sin errores (`npm run lint`)
- [x] Archivos innecesarios eliminados
- [x] Secretos en .env (no en código)

### 2. Backend (Railway)
- [ ] Variables de entorno configuradas (ver `.env.production.example`)
- [ ] JWT_SECRET generado con `openssl rand -base64 32`
- [ ] JWT_REFRESH_SECRET diferente al anterior
- [ ] CORS_ORIGIN apunta a dominio de Vercel
- [ ] Stripe keys de producción (sk_live_*)
- [ ] SendGrid API key configurada
- [ ] Supabase production keys

### 3. Frontend (Vercel)
- [ ] NEXT_PUBLIC_API_URL apunta a Railway backend
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_*)
- [ ] vercel.json configurado correctamente

### 4. Database (Supabase)
- [ ] Migraciones aplicadas (MASTER_MIGRATIONS.sql)
- [ ] RLS policies activadas
- [ ] Usuario admin creado
- [ ] Storage buckets configurados
- [ ] Backup automático habilitado

### 5. Webhooks
- [ ] Stripe webhook URL configurada: `https://backend/api/stripe/webhook`
- [ ] STRIPE_WEBHOOK_SECRET guardado en Railway
- [ ] PayPal webhook URL configurada: `https://backend/api/paypal/webhook`
- [ ] PAYPAL_WEBHOOK_ID guardado en Railway
- [ ] Eventos correctos suscritos

### 6. Security
- [x] HttpOnly cookies implementadas
- [x] Rate limiting activo
- [x] Helmet security headers
- [x] CORS configurado
- [x] Environment validation (Zod)
- [x] Webhook signature validation
- [ ] HTTPS forzado (auto en Vercel/Railway)
- [ ] Secrets rotation plan (90 días)

### 7. Monitoring
- [ ] Logs configurados en Railway
- [ ] Health checks funcionando (`/health`)
- [ ] Error tracking (Sentry - opcional)
- [ ] Uptime monitoring (UptimeRobot - opcional)

---

## 🚀 Deploy Commands

### Backend (Railway)
```bash
# Desde Railway Dashboard
1. Connect GitHub repo
2. Select 'backend' root directory
3. Add environment variables
4. Deploy
```

### Frontend (Vercel)
```bash
# Desde Vercel Dashboard
1. Import Git repository
2. Select 'frontend' root directory
3. Framework: Next.js
4. Add environment variables
5. Deploy
```

### Verificación
```bash
# Backend health
curl https://tu-backend.up.railway.app/health

# Frontend
curl https://tu-dominio.vercel.app

# API desde frontend
curl https://tu-dominio.vercel.app/api/courses
```

---

## 🔄 Post-Deploy

### Inmediato
- [ ] Verificar frontend carga correctamente
- [ ] Test login/register
- [ ] Test compra con Stripe (modo test primero)
- [ ] Verificar webhooks llegan (logs de Railway)
- [ ] Comprobar cookies HttpOnly funcionan

### Primeras 24h
- [ ] Monitorear logs de errores
- [ ] Verificar performance (Vercel Analytics)
- [ ] Test desde diferentes dispositivos
- [ ] Verificar emails se envían (SendGrid)

### Primera semana
- [ ] Analizar métricas de uso
- [ ] Optimizar queries lentas (si hay)
- [ ] Ajustar rate limits si necesario
- [ ] Configurar backups automáticos

---

## 📞 Rollback Plan

### Si algo falla:

**Frontend (Vercel)**:
1. Dashboard → Deployments
2. Click en deployment anterior exitoso
3. "Promote to Production"

**Backend (Railway)**:
1. Dashboard → Deployments
2. Seleccionar versión anterior
3. "Redeploy"

**Database (Supabase)**:
1. SQL Editor → Ejecutar backup SQL
2. Restaurar desde Dashboard

---

## 🎯 Success Metrics

Deployment exitoso si:
- ✅ Frontend carga en < 2s
- ✅ API responde en < 500ms
- ✅ 0 errores en logs primeras 24h
- ✅ Pagos de prueba funcionan
- ✅ Emails se envían correctamente
- ✅ Uptime > 99.9%

---

**Última actualización**: 2026-02-01
