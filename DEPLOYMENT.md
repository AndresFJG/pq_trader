# Guía de Despliegue a Netlify

## Configuración del Proyecto

Este proyecto está configurado para desplegarse en Netlify con Next.js 14.

### Variables de Entorno Requeridas

Configura estas variables en Netlify (Site settings → Environment variables):

```bash
# API Backend
NEXT_PUBLIC_API_URL=https://api.pqtrader.com/api

# Stripe (usa claves de producción)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_tu_clave_aqui

# Site URL
NEXT_PUBLIC_SITE_URL=https://pqtrader.com

# Google Analytics (opcional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Darwinex (opcional)
NEXT_PUBLIC_DARWINEX_API_KEY=tu_clave_darwinex
```

## Pasos para Desplegar

### 1. Preparar el Repositorio

```bash
# Asegúrate de tener todos los cambios commiteados
git add .
git commit -m "feat: configuración para Netlify"
git push origin main
```

### 2. Conectar con Netlify

1. Ve a [Netlify](https://app.netlify.com)
2. Click en "Add new site" → "Import an existing project"
3. Conecta tu repositorio de GitHub/GitLab
4. Selecciona el repositorio `pq_trader`

### 3. Configurar Build Settings

Netlify debería detectar automáticamente la configuración desde `netlify.toml`, pero verifica:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/.next`
- **Node version**: 20 (detectado desde `.nvmrc`)

### 4. Instalar el Plugin de Next.js

El plugin `@netlify/plugin-nextjs` ya está configurado en `netlify.toml` y se instalará automáticamente.

### 5. Configurar Variables de Entorno

En Netlify:
1. Ve a Site settings → Environment variables
2. Agrega todas las variables listadas arriba
3. Usa las claves de **producción** de Stripe

### 6. Configurar Dominio Personalizado

1. Site settings → Domain management
2. Add custom domain: `pqtrader.com`
3. Configurar DNS:
   - Apunta tu dominio a Netlify
   - Netlify proveerá los nameservers o registro A
4. Habilitar HTTPS automático (Netlify lo hace gratis con Let's Encrypt)

### 7. Deploy

```bash
# Deploy automático al hacer push a main
git push origin main

# O hacer deploy manual desde Netlify
# Deploys → Trigger deploy
```

## Configuración del Backend

El backend debe estar desplegado en:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS/Google Cloud

Asegúrate de que la URL del backend (`NEXT_PUBLIC_API_URL`) apunte a tu servidor de producción.

## Configuración de API Routes

El archivo `netlify.toml` redirige `/api/*` al backend configurado. Asegúrate de:

1. Tu backend acepta peticiones desde `https://pqtrader.com`
2. CORS está configurado correctamente
3. Las rutas de API del backend están disponibles

## Optimizaciones

### 1. Performance

- ✅ Static Site Generation (SSG) habilitado
- ✅ Image Optimization configurado
- ✅ Cache headers para assets estáticos
- ✅ Compresión automática por Netlify

### 2. SEO

- ✅ Metadata configurado en todas las páginas
- ✅ Sitemap generado en `/sitemap.xml`
- ✅ Robots.txt configurado en `/robots.txt`
- ✅ Open Graph tags

### 3. Seguridad

- ✅ Headers de seguridad configurados
- ✅ HTTPS forzado
- ✅ CSP headers
- ✅ Rate limiting (debe configurarse en el backend)

## Testing en Producción

Después del deploy, verifica:

1. ✅ La página principal carga correctamente
2. ✅ Las rutas funcionan (`/cursos`, `/mentorias`, `/alquileres`, etc.)
3. ✅ El checkout de Stripe funciona
4. ✅ Las llamadas al API backend funcionan
5. ✅ Las imágenes cargan correctamente
6. ✅ El sitio es responsive en mobile
7. ✅ SEO: verifica con Google Search Console

## Rollback

Si algo sale mal:

1. Ve a Netlify → Deploys
2. Encuentra el deploy anterior que funcionaba
3. Click en "Publish deploy" para hacer rollback

## Monitoring

### Netlify Analytics

Habilita Netlify Analytics para:
- Page views
- Unique visitors
- Top pages
- Bandwidth usage

### Google Analytics

Ya está configurado en el código. Solo necesitas:
1. Crear una propiedad GA4
2. Agregar el `NEXT_PUBLIC_GA_MEASUREMENT_ID` en variables de entorno

### Error Tracking

Considera integrar:
- Sentry para error tracking
- LogRocket para session replay
- Hotjar para analytics de usuario

## Comandos Útiles

```bash
# Ver logs de build
netlify logs

# Deploy preview (crea un preview URL)
netlify deploy

# Deploy a producción
netlify deploy --prod

# Abrir sitio en producción
netlify open:site

# Abrir admin de Netlify
netlify open:admin
```

## Problemas Comunes

### Build Falla

```bash
# Limpiar cache de Netlify
# Netlify UI → Site settings → Build & deploy → Clear cache and deploy site
```

### Variables de Entorno No Funcionan

- Verifica que empiecen con `NEXT_PUBLIC_`
- Redeploy después de agregar variables
- No uses comillas en los valores

### Rutas 404

- Verifica que `next.config.js` esté correctamente configurado
- El plugin de Next.js maneja automáticamente las rutas

### API No Funciona

- Verifica CORS en el backend
- Chequea que `NEXT_PUBLIC_API_URL` esté correcta
- Revisa los logs de Netlify Functions si usas serverless

## Costos

### Netlify Free Tier

- ✅ 100 GB bandwidth/mes
- ✅ 300 build minutes/mes
- ✅ HTTPS gratis
- ✅ Deploy preview ilimitados
- ✅ Formularios: 100 submissions/mes

Para más tráfico, considera el plan Pro ($19/mes).

## Próximos Pasos

1. Configurar CI/CD completo
2. Agregar tests automáticos antes del deploy
3. Configurar notificaciones de deploy (Slack, Discord)
4. Implementar feature flags
5. A/B testing con Netlify Edge Functions

---

**Documentación Oficial:**
- [Netlify Next.js](https://docs.netlify.com/frameworks/next-js/overview/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
