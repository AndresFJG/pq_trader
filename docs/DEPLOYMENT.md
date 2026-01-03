# Guía de Despliegue - PQ Trader

## Prerrequisitos

- Node.js 20.x
- MongoDB Atlas o instancia de MongoDB
- Cuenta de Stripe
- Cuenta de Darwinex
- Cuenta de SendGrid (para emails)

---

## Despliegue del Frontend (Vercel)

### 1. Preparación

```bash
cd frontend
npm run build
```

### 2. Configurar Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Variables de Entorno en Vercel

En el dashboard de Vercel, configurar:

```
NEXT_PUBLIC_API_URL=https://api.pqtrader.com/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_DARWINEX_API_KEY=...
NEXT_PUBLIC_SITE_URL=https://pqtrader.com
```

### 4. Configurar Dominio

- Agregar dominio personalizado en Vercel
- Configurar DNS records:
  - A record: `@` → Vercel IP
  - CNAME: `www` → `cname.vercel-dns.com`

---

## Despliegue del Backend

### Opción 1: Railway

#### 1. Crear Proyecto

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar proyecto
cd backend
railway init
```

#### 2. Configurar Variables de Entorno

En el dashboard de Railway:

```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DARWINEX_API_KEY=...
SENDGRID_API_KEY=...
FRONTEND_URL=https://pqtrader.com
CORS_ORIGIN=https://pqtrader.com
```

#### 3. Deploy

```bash
railway up
```

### Opción 2: DigitalOcean App Platform

#### 1. Conectar Repositorio

- Ir a DigitalOcean App Platform
- Conectar GitHub repository
- Seleccionar rama `main`

#### 2. Configurar Build

```yaml
name: pqtrader-backend
region: nyc
services:
  - name: api
    github:
      repo: tu-usuario/pq_trader
      branch: main
      deploy_on_push: true
    build_command: cd backend && npm install && npm run build
    run_command: cd backend && npm start
    environment_slug: node-js
    http_port: 4000
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: ${db.DATABASE_URL}
        type: SECRET
      # ... más variables de entorno
```

### Opción 3: Docker + VPS

#### 1. Crear Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
```

#### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      # ... más variables
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
```

#### 3. Deploy a VPS

```bash
# SSH al servidor
ssh root@your-server-ip

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clonar repositorio
git clone https://github.com/tu-usuario/pq_trader.git
cd pq_trader

# Configurar .env
cp backend/.env.example backend/.env
# Editar backend/.env con tus valores

# Iniciar servicios
docker-compose up -d
```

---

## Configurar MongoDB Atlas

### 1. Crear Cluster

- Ir a mongodb.com/cloud/atlas
- Crear nuevo cluster (M0 Free tier para empezar)
- Región: closest to your users

### 2. Configurar Acceso

- Database Access: Crear usuario con contraseña
- Network Access: Agregar IP (0.0.0.0/0 para permitir todas - no recomendado para producción)

### 3. Obtener Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/pqtrader?retryWrites=true&w=majority
```

---

## Configurar Stripe

### 1. Webhook Endpoint

En Stripe Dashboard → Developers → Webhooks:

- URL: `https://api.pqtrader.com/api/payments/webhook`
- Eventos a escuchar:
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`
  - `customer.subscription.updated`

### 2. Productos y Precios

Crear en Stripe Dashboard:

- Producto: "Suscripción Mensual PQ Trader"
  - Precio: $29/mes
  - Tipo: Recurrente
  
- Producto: "Suscripción Anual PQ Trader"
  - Precio: $290/año
  - Tipo: Recurrente

Copiar Price IDs y agregarlos a las variables de entorno.

---

## SSL/HTTPS

### Opción 1: Let's Encrypt (Certbot)

```bash
# Instalar certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d api.pqtrader.com

# Auto-renovación
sudo certbot renew --dry-run
```

### Opción 2: Cloudflare

- Agregar dominio a Cloudflare
- Configurar DNS
- SSL/TLS mode: Full (strict)
- Obtener certificado de Origin Server

---

## Monitoreo

### Sentry

```bash
# Instalar Sentry
npm install @sentry/node

# Configurar en index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://...@sentry.io/...',
  environment: process.env.NODE_ENV,
});
```

### PM2 (Process Manager)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start dist/index.js --name pqtrader-api

# Monitoreo
pm2 monit

# Logs
pm2 logs

# Auto-start en reboot
pm2 startup
pm2 save
```

---

## Backups

### MongoDB

```bash
# Backup manual
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)

# Backup automático (cron)
0 2 * * * mongodump --uri="..." --out=/backups/$(date +\%Y\%m\%d)
```

### Código

- Push a GitHub regularmente
- Tags de versiones: `git tag v1.0.0`
- GitHub Actions para CI/CD

---

## Checklist de Producción

- [ ] Variables de entorno configuradas
- [ ] HTTPS habilitado
- [ ] MongoDB Atlas con backups
- [ ] Stripe webhooks configurados
- [ ] Rate limiting activo
- [ ] CORS configurado correctamente
- [ ] Logs configurados
- [ ] Monitoreo activo (Sentry)
- [ ] DNS configurado
- [ ] SSL válido
- [ ] Tests pasando
- [ ] Documentación actualizada

---

## Actualizar Aplicación

```bash
# Frontend (Vercel)
git push origin main
# Vercel deploya automáticamente

# Backend
ssh root@your-server
cd pq_trader/backend
git pull
npm run build
pm2 restart pqtrader-api
```

---

## Troubleshooting

### Error de conexión a MongoDB

```bash
# Verificar conexión
node -e "require('mongoose').connect('tu-uri').then(() => console.log('OK'))"
```

### Puerto ocupado

```bash
# Linux/Mac
lsof -i :4000
kill -9 PID

# Windows
netstat -ano | findstr :4000
taskkill /PID xxxx /F
```

### Logs

```bash
# PM2
pm2 logs pqtrader-api

# Docker
docker logs pqtrader-backend

# Railway
railway logs
```

---

Para soporte: dev@pqtrader.com
