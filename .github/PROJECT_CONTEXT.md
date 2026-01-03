# Contexto del Proyecto - PQ Trader

> **Uso:** Lee este archivo al inicio de cada sesión para recordar el contexto completo del proyecto.

---

## 🎯 VISIÓN DEL PROYECTO

**PQ Trader** es una plataforma profesional de educación en trading algorítmico que permite:

1. **Vender cursos** de trading (pago único o suscripción)
2. **Ofrecer mentorías** 1-a-1 con traders expertos
3. **Mostrar resultados reales** integrados con Darwinex
4. **Gestionar pagos recurrentes** con Stripe
5. **Administrar usuarios** con roles y permisos

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Landing  │  │Dashboard │  │  Admin   │              │
│  │  Page    │  │  User    │  │  Panel   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│         │              │              │                 │
│         └──────────────┼──────────────┘                 │
│                        │                                │
│                    [HTTP/REST]                          │
│                        │                                │
└────────────────────────┼────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│                 BACKEND (Node.js/Express)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Auth   │  │ Courses  │  │ Payments │              │
│  │          │  │Mentorship│  │ Darwinex │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│         │              │              │                 │
│         └──────────────┼──────────────┘                 │
│                        │                                │
└────────────────────────┼────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐    ┌─────▼─────┐   ┌─────▼─────┐
   │ MongoDB │    │  Stripe   │   │ Darwinex  │
   │         │    │  (Pagos)  │   │ (Trading) │
   └─────────┘    └───────────┘   └───────────┘
```

---

## 📦 STACK TECNOLÓGICO

### Frontend
```
Framework:     Next.js 14 (App Router)
Lenguaje:      TypeScript (strict mode)
Estilos:       Tailwind CSS
Componentes:   shadcn/ui
Formularios:   React Hook Form + Zod
Estado:        Zustand + React Context
HTTP:          Axios + SWR
Animaciones:   Framer Motion
```

### Backend
```
Runtime:       Node.js 20
Framework:     Express.js
Lenguaje:      TypeScript (strict mode)
Database:      MongoDB + Mongoose
Auth:          JWT + bcrypt
Validación:    Joi
Seguridad:     Helmet + CORS
Rate Limit:    express-rate-limit
Testing:       Jest + Supertest
```

### Integraciones
```
Pagos:         Stripe (Subscriptions + Webhooks)
Trading:       Darwinex API (Portfolio data)
Email:         SendGrid / Nodemailer
Storage:       Cloudinary (planeado)
Monitoring:    Sentry (planeado)
```

---

## 🗂️ ESTRUCTURA DE CARPETAS

```
pq_trader/
│
├── frontend/                       # Next.js 14
│   ├── src/
│   │   ├── app/                   # App Router
│   │   │   ├── (public)/         # Rutas públicas (landing, login)
│   │   │   ├── (dashboard)/      # Rutas protegidas (user dashboard)
│   │   │   ├── (admin)/          # Panel admin
│   │   │   └── api/              # API Routes (si aplica)
│   │   ├── components/
│   │   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   │   ├── layouts/          # Navbar, Footer, etc.
│   │   │   ├── sections/         # Secciones de páginas
│   │   │   ├── forms/            # Formularios reutilizables
│   │   │   └── trading/          # Componentes específicos de trading
│   │   ├── lib/
│   │   │   ├── utils.ts          # Utilidades (cn, formatters)
│   │   │   └── api.ts            # Configuración de Axios
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx       # Hook de autenticación
│   │   │   └── useCourses.ts     # Hooks de data fetching
│   │   └── types/
│   │       └── index.ts          # Types compartidos
│   └── public/                    # Assets estáticos
│
├── backend/                        # Node.js + Express
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── controllers/          # Lógica de negocio
│   │   │   ├── auth.controller.ts
│   │   │   ├── course.controller.ts
│   │   │   └── payment.controller.ts
│   │   ├── models/               # Modelos de MongoDB
│   │   │   ├── User.model.ts
│   │   │   ├── Course.model.ts
│   │   │   └── Booking.model.ts
│   │   ├── routes/               # Definición de rutas
│   │   │   ├── auth.routes.ts
│   │   │   └── course.routes.ts
│   │   ├── middleware/           # Middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rateLimiter.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── services/             # Servicios externos
│   │   │   ├── stripe.service.ts
│   │   │   ├── darwinex.service.ts
│   │   │   └── email.service.ts
│   │   └── types/                # Types del backend
│   └── tests/                    # Tests
│
├── docs/                          # Documentación
│   ├── API.md                    # Documentación de endpoints
│   ├── DEPLOYMENT.md             # Guía de despliegue
│   └── ARCHITECTURE.md           # Arquitectura detallada
│
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml            # GitHub Actions
│   ├── copilot-instructions.md   # Instrucciones para Copilot
│   ├── PROMPT_LIBRARY.md         # Biblioteca de prompts
│   └── PROJECT_CONTEXT.md        # Este archivo
│
└── scripts/
    └── setup.sh                  # Script de setup inicial
```

---

## 🔑 MODELOS DE DATOS

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'user' | 'admin' | 'mentor'
  avatar?: string
  subscription?: {
    stripeCustomerId: string
    stripeSubscriptionId: string
    status: 'active' | 'canceled' | 'past_due' | 'trialing'
    plan: 'monthly' | 'annual'
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
  }
  enrolledCourses: ObjectId[] // ref: Course
}
```

### Course
```typescript
{
  title: string
  description: string
  price: number
  duration: number // horas
  level: 'beginner' | 'intermediate' | 'advanced'
  thumbnail: string
  instructor: ObjectId // ref: User
  enrolled: number
  rating: number
  topics: string[]
  lessons: ObjectId[] // ref: Lesson
  published: boolean
}
```

### Lesson
```typescript
{
  title: string
  description: string
  videoUrl?: string
  content: string
  duration: number // minutos
  order: number
  courseId: ObjectId // ref: Course
  published: boolean
}
```

### Mentorship
```typescript
{
  title: string
  description: string
  price: number
  duration: number // minutos
  mentor: ObjectId // ref: User
  availableSlots: [{
    startTime: Date
    endTime: Date
    isAvailable: boolean
  }]
}
```

### Booking
```typescript
{
  mentorshipId: ObjectId // ref: Mentorship
  userId: ObjectId // ref: User
  timeSlot: {
    startTime: Date
    endTime: Date
  }
  status: 'pending' | 'confirmed' | 'completed' | 'canceled'
  meetingLink?: string
  notes?: string
  paymentIntentId?: string
}
```

---

## 🔐 AUTENTICACIÓN Y ROLES

### Flujo de Autenticación
```
1. Usuario se registra → POST /api/auth/register
2. Se crea user en MongoDB con password hasheado (bcrypt)
3. Se genera JWT token + Refresh Token
4. Frontend guarda tokens en localStorage
5. Cada request incluye: Authorization: Bearer {token}
6. Middleware 'protect' verifica el token
7. Si token expira, usar refresh token
```

### Roles y Permisos
```
USER (role: 'user'):
- Ver cursos
- Inscribirse en cursos
- Reservar mentorías
- Ver su dashboard
- Gestionar su perfil

MENTOR (role: 'mentor'):
- Todo lo de USER +
- Crear cursos
- Ver estudiantes de sus cursos
- Gestionar mentorías
- Ver earnings

ADMIN (role: 'admin'):
- Todo lo de MENTOR +
- Crear/editar/eliminar cualquier curso
- Gestionar usuarios
- Ver analytics completo
- Acceso a panel admin
```

---

## 💳 FLUJO DE PAGOS (STRIPE)

### Suscripciones Mensuales/Anuales
```
1. Usuario selecciona plan
2. Frontend: Stripe Elements para tarjeta
3. POST /api/payments/create-subscription
   - Backend crea Customer en Stripe
   - Backend crea Subscription
   - Guarda stripeCustomerId y stripeSubscriptionId en User
4. Stripe procesa pago
5. Webhook: invoice.payment_succeeded
   - Backend actualiza subscription.status = 'active'
6. Usuario obtiene acceso a cursos
```

### Pagos Únicos (Cursos/Mentorías)
```
1. Usuario compra curso individual
2. POST /api/payments/create-intent
   - Backend crea PaymentIntent
3. Frontend confirma pago con Stripe.js
4. Webhook: payment_intent.succeeded
   - Backend inscribe usuario en curso
5. Enviar email de confirmación
```

### Webhooks de Stripe
```
Eventos importantes:
- invoice.payment_succeeded    → Activar suscripción
- invoice.payment_failed       → Marcar como past_due
- customer.subscription.deleted → Cancelar acceso
- customer.subscription.updated → Actualizar plan
```

---

## 📊 INTEGRACIÓN DARWINEX

### Propósito
Mostrar portafolios de trading en tiempo real para demostrar expertise.

### Endpoints Usados
```
GET /darwins/{name}/performance
GET /darwins/{name}/stats
GET /darwins/{name}/historical
```

### Datos Mostrados
```typescript
{
  name: string           // PQT.Alpha
  return: number         // 24.5% anual
  drawdown: number       // -8.2%
  sharpeRatio: number    // 2.45
  winRate: number        // 68.4%
  trades: number         // 342
}
```

### Implementación
```
1. Backend: darwinex.service.ts
   - Hace requests a Darwinex API
   - Cachea resultados (5 minutos)
   
2. Frontend: Componente Darwinex
   - Muestra cards con métricas
   - Actualización en tiempo real
   - Colores: verde (profit), rojo (loss)
```

---

## 🛡️ SEGURIDAD

### Rate Limiting
```typescript
// General API
100 requests / 15 minutos

// Auth routes
5 login attempts / 15 minutos
3 registros / hora

// Payment routes
10 transactions / hora
```

### Headers de Seguridad (Helmet)
```
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Content-Security-Policy
```

### Validación
```
Frontend: Zod + React Hook Form
Backend: Joi middleware

Siempre validar en ambos lados
```

### CORS
```typescript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

---

## 🎨 DISEÑO Y UX

### Tema de Trading
```css
Colores principales:
--profit:     #00C853  /* Verde - ganancias */
--loss:       #FF3B30  /* Rojo - pérdidas */
--neutral:    #F59E0B  /* Amarillo - neutral */
--background: #0B0E11  /* Fondo oscuro */
--surface:    #161A1E  /* Tarjetas */
--text:       #E8E8E8  /* Texto principal */
--accent:     #00D4FF  /* Acento tech */
```

### Componentes Key
```
- TradingChart: Gráficos con recharts
- PriceCard: Muestra precios con formato
- PerformanceMetric: Métricas de trading
- CourseCard: Card de curso
- MentorshipCard: Card de mentoría
```

### Responsive
```
Mobile-first approach
Breakpoints Tailwind:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px
```

---

## 🧪 TESTING

### Backend
```bash
# Unit tests
npm test

# Coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Frontend
```bash
# Component tests
npm test

# E2E (Cypress - planeado)
npm run test:e2e
```

### Cobertura Objetivo
```
Backend: > 80%
Frontend: > 70%
```

---

## 📝 CONVENCIONES

### Commits (Conventional Commits)
```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo (no afecta código)
refactor: refactorización
test: agregar tests
chore: tareas de mantenimiento
perf: mejoras de performance
```

### Nombres de Archivos
```
Componentes:   PascalCase.tsx    (UserProfile.tsx)
Utilities:     camelCase.ts      (formatCurrency.ts)
Constants:     UPPER_SNAKE_CASE  (MAX_RETRY_ATTEMPTS)
Types:         PascalCase        (ApiResponse, User)
Hooks:         use + PascalCase  (useAuth, useCourses)
```

### Imports Order
```typescript
// 1. Externos
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Internos
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';

// 3. Utils/Hooks
import { cn, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

// 4. Types
import type { Course, User } from '@/types';

// 5. Styles (si aplica)
import styles from './styles.module.css';
```

---

## 🚀 COMANDOS COMUNES

### Development
```bash
# Frontend
cd frontend
npm run dev          # http://localhost:3000

# Backend
cd backend
npm run dev          # http://localhost:4000
```

### Build
```bash
# Frontend
npm run build
npm run start

# Backend
npm run build
npm start
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Linting
```bash
npm run lint         # Check
npm run lint:fix     # Fix
npm run format       # Prettier
```

---

## 🔗 ENDPOINTS PRINCIPALES

### Autenticación
```
POST   /api/auth/register       # Registrar usuario
POST   /api/auth/login          # Login
GET    /api/auth/me             # Obtener usuario actual
POST   /api/auth/refresh        # Refrescar token
```

### Cursos
```
GET    /api/courses             # Listar cursos
GET    /api/courses/:id         # Obtener curso
POST   /api/courses             # Crear curso (admin)
PUT    /api/courses/:id         # Actualizar curso (admin)
DELETE /api/courses/:id         # Eliminar curso (admin)
POST   /api/courses/:id/enroll  # Inscribirse
```

### Mentorías
```
GET    /api/mentorships         # Listar mentorías
POST   /api/mentorships/book    # Reservar
GET    /api/mentorships/my-bookings # Mis reservas
```

### Pagos
```
POST   /api/payments/create-subscription   # Crear suscripción
POST   /api/payments/cancel-subscription   # Cancelar
POST   /api/payments/webhook               # Stripe webhook
GET    /api/payments/history               # Historial
```

### Darwinex
```
GET    /api/darwinex/portfolios  # Obtener portafolios
GET    /api/darwinex/performance/:name # Performance
GET    /api/darwinex/stats       # Estadísticas
```

---

## 🌍 VARIABLES DE ENTORNO

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_DARWINEX_API_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (.env)
```bash
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pqtrader

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRE=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_ANNUAL=price_...

# Darwinex
DARWINEX_API_KEY=...
DARWINEX_API_SECRET=...

# Email
SENDGRID_API_KEY=...
FROM_EMAIL=noreply@pqtrader.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación Oficial
- [Next.js 14 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Stripe API](https://stripe.com/docs/api)
- [MongoDB Docs](https://docs.mongodb.com/)

### Inspiración de Diseño
- [TradeBotAcademia](https://tradebotacademia.com/)
- [The Hub Trader](https://www.thehubtrader.com/)
- [Binance Academy](https://academy.binance.com/)
- [TradingView](https://www.tradingview.com/)

### Proyectos de Referencia
- Ver `.cursorrules` para convenciones
- Ver `CONTRIBUTING.md` para workflow
- Ver `docs/API.md` para endpoints completos

---

## ⚠️ NOTAS IMPORTANTES

### Seguridad
```
❌ NUNCA commitear archivos .env
❌ NUNCA usar 'any' en TypeScript
❌ NUNCA exponer API keys en frontend
✅ SIEMPRE validar inputs (frontend + backend)
✅ SIEMPRE usar rate limiting
✅ SIEMPRE hashear passwords con bcrypt
```

### Performance
```
✅ Usar Server Components por defecto (Next.js)
✅ Lazy load componentes pesados
✅ Optimizar imágenes (next/image)
✅ Cachear queries frecuentes
✅ Paginar resultados grandes
```

### UX
```
✅ Loading states en todas las operaciones async
✅ Error handling con mensajes claros
✅ Toast notifications para feedback
✅ Confirmaciones antes de acciones destructivas
✅ Diseño responsive mobile-first
```

---

## 🔄 WORKFLOW DE DESARROLLO

### 1. Nueva Feature
```
1. Crear rama: git checkout -b feature/nombre
2. Desarrollar con tests
3. Lint: npm run lint
4. Test: npm test
5. Commit: git commit -m "feat: descripción"
6. Push: git push origin feature/nombre
7. Crear Pull Request
8. Review + Merge
```

### 2. Bug Fix
```
1. Crear rama: git checkout -b fix/nombre
2. Reproducir bug
3. Corregir + test
4. Commit: git commit -m "fix: descripción"
5. Push + PR
```

### 3. Antes de Commit
```bash
# Verificar
npm run lint          # No errores
npm test              # Tests pasan
npm run build         # Build exitoso
```

---

## 🎯 PRÓXIMOS PASOS (ROADMAP)

### Fase 1 (Actual) ✅
- [x] Setup inicial
- [x] Autenticación
- [x] CRUD de cursos
- [x] Integración Stripe básica
- [x] Integración Darwinex

### Fase 2 (En progreso) 🚧
- [ ] Dashboard de usuario completo
- [ ] Sistema de mentorías completo
- [ ] Reviews y ratings
- [ ] Progreso de cursos

### Fase 3 (Planeado) 📋
- [ ] Sistema de certificados
- [ ] Notificaciones en tiempo real
- [ ] Chat con mentores
- [ ] App móvil (React Native)

---

**Última actualización:** Diciembre 2025
**Versión:** 1.0.0
**Mantenedor:** PQ Trader Team
