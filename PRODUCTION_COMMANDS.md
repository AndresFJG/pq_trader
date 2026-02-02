# 🛠️ Comandos Útiles - Producción

## 🚀 Deployment

### Railway (Backend)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Vincular proyecto
railway link

# Ver variables de entorno
railway vars

# Agregar variable
railway vars set JWT_SECRET=$(openssl rand -base64 32)

# Ver logs en tiempo real
railway logs

# Deploy manual
railway up

# Abrir dashboard
railway open
```

### Vercel (Frontend)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs

# Listar deployments
vercel ls

# Abrir dashboard
vercel open
```

---

## 🔧 Local Development

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Desarrollo con hot-reload
npm run dev

# Build TypeScript
npm run build

# Start producción (local test)
npm start

# Run tests
npm test

# Linter
npm run lint

# Crear usuario admin
npm run create:admin
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm start

# Linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🗄️ Database (Supabase)

### Migraciones

```sql
-- Aplicar migración principal
-- En Supabase SQL Editor, ejecutar:
\i backend/supabase_migrations/MASTER_MIGRATIONS.sql

-- Crear usuario admin
\i backend/supabase_migrations/006_create_admin_user.sql
```

### Queries útiles

```sql
-- Ver todos los usuarios
SELECT id, name, email, role, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

-- Ver cursos publicados
SELECT id, title, price, enrollment_count 
FROM courses 
WHERE is_published = true 
ORDER BY enrollment_count DESC;

-- Ver transacciones recientes
SELECT t.id, t.amount, t.status, u.email, t.created_at
FROM transactions t
JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC
LIMIT 20;

-- Ver enrollments activos
SELECT e.id, u.email, c.title, e.enrolled_at
FROM enrollments e
JOIN users u ON e.user_id = u.id
JOIN courses c ON e.course_id = c.id
WHERE e.status = 'active'
ORDER BY e.enrolled_at DESC;

-- Estadísticas generales
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM courses WHERE is_published = true) as published_courses,
  (SELECT COUNT(*) FROM enrollments WHERE status = 'active') as active_enrollments,
  (SELECT SUM(amount) FROM transactions WHERE status = 'completed') as total_revenue;
```

---

## 🔐 Generar Secrets

```bash
# JWT Secret (32 bytes en base64)
openssl rand -base64 32

# JWT Secret (hex)
openssl rand -hex 32

# UUID
uuidgen

# Random string (URL safe)
openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c32

# Strong password
openssl rand -base64 16
```

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl https://tu-backend.railway.app/health

# Detailed health
curl https://tu-backend.railway.app/api/health

# Frontend health
curl https://tu-dominio.vercel.app

# API test
curl https://tu-backend.railway.app/api/courses | jq
```

### Logs

```bash
# Railway logs (últimas 100 líneas)
railway logs --tail 100

# Railway logs (seguir en tiempo real)
railway logs -f

# Vercel logs (último deployment)
vercel logs

# Vercel logs (deployment específico)
vercel logs [deployment-url]
```

---

## 🧪 Testing

### Test Stripe Webhooks (Local)

```bash
# Instalar Stripe CLI
stripe login

# Reenviar webhooks a localhost
stripe listen --forward-to localhost:4000/api/stripe/webhook

# Trigger evento de prueba
stripe trigger checkout.session.completed
```

### Test PayPal Webhooks

```bash
# Usar PayPal Sandbox
# https://developer.paypal.com/dashboard/webhooks

# Simular evento
curl -X POST https://tu-backend.railway.app/api/paypal/webhook \
  -H "Content-Type: application/json" \
  -d @test-paypal-webhook.json
```

---

## 🔄 CI/CD (GitHub Actions)

### Crear workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 🐛 Debug

### Backend

```bash
# Ver variables de entorno (Railway)
railway vars

# Ejecutar comando en Railway
railway run node -v

# SSH a Railway (si disponible)
railway shell

# Ver build logs
railway logs --deployment [deployment-id]
```

### Frontend

```bash
# Build local con logs verbose
npm run build -- --verbose

# Analizar bundle size
npm run build && npx @next/bundle-analyzer
```

---

## 📦 Package Management

### Actualizar dependencias

```bash
# Ver outdated
npm outdated

# Update all (cuidado!)
npm update

# Update específico
npm update express

# Check vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🔒 Security

### Rotar JWT Secrets

```bash
# 1. Generar nuevo secret
NEW_SECRET=$(openssl rand -base64 32)

# 2. Agregar a Railway
railway vars set JWT_SECRET="$NEW_SECRET"

# 3. Redeploy
railway up

# 4. Invalidar sesiones antiguas (opcional)
# Implementar endpoint /api/auth/invalidate-all
```

### Check Security Headers

```bash
# Verificar headers de seguridad
curl -I https://tu-dominio.vercel.app | grep -E "X-|Content-Security"

# Con herramienta
npx helmet-csp-analyzer https://tu-dominio.vercel.app
```

---

## 📈 Performance

### Analizar bundle

```bash
cd frontend

# Next.js bundle analyzer
npm install @next/bundle-analyzer
ANALYZE=true npm run build

# Lighthouse audit
npx lighthouse https://tu-dominio.vercel.app --view
```

### Database performance

```sql
-- Ver queries lentas (Supabase)
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Ver índices no usados
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY tablename;
```

---

## 🎯 Useful One-Liners

```bash
# Contar líneas de código
find backend/src -name "*.ts" | xargs wc -l | tail -1

# Buscar TODO en código
grep -r "TODO\|FIXME\|XXX" backend/src frontend/src

# Ver archivos más grandes
find . -type f -size +1M -exec ls -lh {} \; | sort -k5 -hr

# Backup database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Test API con loop
for i in {1..10}; do curl -w "\n" https://tu-backend.railway.app/health; sleep 1; done
```

---

**Última actualización**: 2026-02-01
