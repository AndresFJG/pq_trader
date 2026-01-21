# 🚀 PQ Trader

**Plataforma profesional de educación en trading algorítmico con resultados verificados**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

## 📋 Descripción

PQ Trader es una plataforma educativa completa para traders que ofrece:

- 📚 **Cursos de trading algorítmico** con certificación
- 🎓 **Mentorías personalizadas** 1-on-1 y grupales  
- 📊 **Resultados verificados** integrados con Darwinex
- 💳 **Pagos seguros** con Stripe
- 🌐 **Soporte multiidioma** (ES/EN)

## 🎯 Características Principales

### Para Estudiantes
- ✅ Acceso a cursos estructurados de trading
- 🎓 Mentorías con traders profesionales
- 📈 Visualización de resultados reales verificados
- 💳 Suscripciones flexibles y pagos seguros
- 📱 Experiencia responsive en todos los dispositivos

### Para Administradores
- 👨‍💼 Panel de administración completo
- 📊 Dashboard con métricas en tiempo real
- 💵 Gestión de pagos y transacciones
- 📚 Gestión de cursos y mentorías
- 👥 Administración de usuarios

### Técnicas
- 🔐 Autenticación JWT con refresh tokens
- 🛡️ Rate limiting y seguridad avanzada
- 🗄️ Base de datos PostgreSQL (Supabase)
- ⚡ Next.js 14 con App Router
- 🎨 UI moderna con Tailwind CSS + shadcn/ui
- 🔄 Webhooks de Stripe

## 🏗️ Arquitectura

```
pq_trader/
├── backend/              # API REST (Node + Express + TypeScript)
│   ├── src/
│   │   ├── config/      # Configuraciones (Supabase, Stripe)
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── middleware/  # Auth, errors, rate-limit
│   │   ├── routes/      # Rutas de API
│   │   ├── services/    # Servicios externos
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utilidades
│   └── supabase_migrations/  # SQL migrations
│
├── frontend/            # Next.js 14 + TypeScript
│   └── src/
│       ├── app/        # App Router (páginas)
│       ├── components/ # Componentes React
│       ├── hooks/      # Custom hooks
│       ├── lib/        # i18n, utils, SEO
│       └── services/   # API clients
│
└── docs/               # Documentación técnica
```
├── frontend/                 # Next.js 14 + TypeScript
│   ├── src/
│   │   ├── app/             # App Router de Next.js
│   │   ├── components/      # Componentes reutilizables
│   │   ├── lib/             # Utilidades y configuración
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Estilos globales
│   ├── public/              # Assets estáticos
│   └── tests/               # Tests del frontend
│
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── models/          # Modelos de datos (MongoDB)
│   │   ├── routes/          # Definición de rutas
│   │   ├── middleware/      # Middlewares (auth, rate limit, etc.)
│   │   ├── services/        # Servicios externos (Stripe, Darwinex)
│   │   ├── config/          # Configuración
│   │   ├── utils/           # Utilidades
│   │   └── types/           # TypeScript types
│   └── tests/               # Tests del backend
│
├── shared/                   # Código compartido entre frontend/backend
│   └── types/               # Types compartidos
│
├── docs/                     # Documentación adicional
│   ├── API.md              # Documentación de API
│   ├── DEPLOYMENT.md       # Guía de despliegue
│   └── ARCHITECTURE.md     # Arquitectura detallada
│
└── scripts/                  # Scripts de utilidad
    ├── setup.sh            # Setup inicial
    └── seed.js             # Datos de prueba
```

## 🚀 Stack Tecnológico

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Estado:** React Context + Zustand
- **Formularios:** React Hook Form + Zod
- **Animaciones:** Framer Motion
- **Charts:** TradingView Widgets + Recharts
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** MongoDB + Mongoose
- **Autenticación:** JWT + bcrypt
- **Validación:** Joi / Zod
- **Rate Limiting:** express-rate-limit
- **Seguridad:** Helmet, CORS
- **Tests:** Jest + Supertest

### Integraciones
- **Pagos:** Stripe (Subscriptions + Webhooks)
- **Trading Data:** Darwinex API
- **Email:** SendGrid / Resend
- **Storage:** AWS S3 / Cloudinary

### DevOps
- **Testing:** Jest, React Testing Library
- **Linting:** ESLint + Prettier
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel (frontend) + Railway/DigitalOcean (backend)
- **Monitoreo:** Sentry

## 📦 Instalación

### Prerrequisitos

- Node.js 20.x o superior
- npm o yarn
- MongoDB (local o Atlas)
- Cuenta de Stripe (API keys)
- Cuenta de Darwinex (API credentials)

### Setup Rápido

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/pq_trader.git
cd pq_trader

# Instalar dependencias del frontend
cd frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en modo desarrollo
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Variables de Entorno

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_DARWINEX_API_KEY=...
```

#### Backend (.env)
```bash
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pqtrader

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRE=1d
JWT_REFRESH_SECRET=otro_secreto_para_refresh
JWT_REFRESH_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MENSUAL=price_...
STRIPE_PRICE_ID_ANUAL=price_...

# Darwinex
DARWINEX_API_KEY=...
DARWINEX_API_SECRET=...
DARWINEX_BASE_URL=https://api.darwinex.com

# Email
SENDGRID_API_KEY=...
FROM_EMAIL=noreply@pqtrader.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔧 Comandos Disponibles

### Frontend
```bash
npm run dev          # Modo desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run test         # Tests
npm run test:watch   # Tests en modo watch
```

### Backend
```bash
npm run dev          # Modo desarrollo con nodemon
npm run build        # Compilar TypeScript
npm run start        # Servidor de producción
npm run lint         # Linting
npm run test         # Tests unitarios
npm run test:e2e     # Tests de integración
npm run seed         # Cargar datos de prueba
```

## 🧪 Testing

```bash
# Backend - Tests unitarios
cd backend
npm run test

# Backend - Tests con coverage
npm run test:coverage

# Frontend - Tests de componentes
cd frontend
npm run test

# E2E Tests
npm run test:e2e
```

## 📚 Documentación API

### Autenticación

```
POST   /api/auth/register        # Registrar usuario
POST   /api/auth/login           # Iniciar sesión
POST   /api/auth/refresh         # Refrescar token
POST   /api/auth/logout          # Cerrar sesión
POST   /api/auth/forgot-password # Recuperar contraseña
POST   /api/auth/reset-password  # Restablecer contraseña
```

### Usuarios

```
GET    /api/users/profile        # Obtener perfil
PUT    /api/users/profile        # Actualizar perfil
GET    /api/users/:id            # Obtener usuario (admin)
GET    /api/users                # Listar usuarios (admin)
DELETE /api/users/:id            # Eliminar usuario (admin)
```

### Cursos

```
GET    /api/courses              # Listar cursos
GET    /api/courses/:id          # Obtener curso
POST   /api/courses              # Crear curso (admin)
PUT    /api/courses/:id          # Actualizar curso (admin)
DELETE /api/courses/:id          # Eliminar curso (admin)
POST   /api/courses/:id/enroll   # Inscribirse en curso
```

### Mentorías

```
GET    /api/mentorias            # Listar mentorías
POST   /api/mentorias/reservar   # Reservar mentoría
GET    /api/mentorias/mis-reservas # Mis reservas
DELETE /api/mentorias/:id        # Cancelar reserva
```

### Pagos

```
POST   /api/payments/create-subscription    # Crear suscripción
POST   /api/payments/cancel-subscription    # Cancelar suscripción
POST   /api/payments/webhook                # Webhook de Stripe
GET    /api/payments/history                # Historial de pagos
```

### Darwinex

```
GET    /api/darwinex/portfolios  # Obtener portafolios
GET    /api/darwinex/performance # Datos de rendimiento
GET    /api/darwinex/stats       # Estadísticas
```

Ver documentación completa en [docs/API.md](docs/API.md)

## 🎨 Diseño y UX

El diseño de PQ Trader está inspirado en:
- **TradeBotAcademia:** Estructura de cursos y landing page
- **The Hub Trader:** Sistema de mentorías y navegación
- **Trading View:** Elementos visuales y gráficos
- **Binance Academy:** Diseño moderno y profesional

### Paleta de Colores
```css
/* Trading Theme */
--primary: #00C853;      /* Verde trading (ganancias) */
--danger: #FF3B30;       /* Rojo trading (pérdidas) */
--background: #0B0E11;   /* Fondo oscuro */
--surface: #161A1E;      /* Superficie */
--text: #E8E8E8;         /* Texto principal */
--text-muted: #9CA3AF;   /* Texto secundario */
--accent: #00D4FF;       /* Acento tecnológico */
```

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación:**
   - JWT con tokens de corta duración
   - Refresh tokens en httpOnly cookies
   - Bcrypt con salt rounds = 12

2. **Rate Limiting:**
   - 100 requests por 15 minutos (general)
   - 5 requests por 15 minutos (login)
   - 3 requests por hora (registro)

3. **Validación:**
   - Validación de inputs con Joi/Zod
   - Sanitización de datos
   - Prevención de XSS y SQL Injection

4. **Headers de Seguridad:**
   - Helmet.js configurado
   - CORS restrictivo
   - CSP (Content Security Policy)

5. **Base de Datos:**
   - Mongoose con schemas estrictos
   - Encriptación de datos sensibles
   - Backup automático

## 🚀 Despliegue

### Frontend (Vercel)
```bash
# Configurar Vercel CLI
npm i -g vercel

# Desplegar
cd frontend
vercel --prod
```

### Backend (Railway/DigitalOcean)
```bash
# Dockerfile incluido en /backend
docker build -t pqtrader-backend .
docker run -p 4000:4000 pqtrader-backend
```

Ver guía completa en [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

### Proceso de Desarrollo

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- TypeScript strict mode
- ESLint + Prettier configurados
- Tests para nuevas features
- Commits siguiendo Conventional Commits

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para más detalles.

## 👥 Autor

**PQ Trader Team**
- Website: [https://pqtrader.com](https://pqtrader.com)
- Email: info@pqtrader.com

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el excelente framework
- [Stripe](https://stripe.com/) por el sistema de pagos
- [Darwinex](https://www.darwinex.com/) por la API de trading
- Comunidad de trading algorítmico

---

⭐️ Si este proyecto te resultó útil, ¡dale una estrella en GitHub!

**Nota Legal:** El trading conlleva riesgos elevados. Operar con responsabilidad y solo con capital que estés dispuesto a arriesgar.
