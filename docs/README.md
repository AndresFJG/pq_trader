# Documentación PQ Trader

Bienvenido a la documentación técnica de PQ Trader. Aquí encontrarás toda la información necesaria para desarrollar, desplegar y mantener la plataforma.

## 📚 Índice de Documentación

### 🚀 Inicio Rápido
- [Quick Start](../QUICK_START.md) - Guía rápida para empezar
- [Getting Started](../GETTING_STARTED.md) - Guía de configuración detallada
- [Contributing](../CONTRIBUTING.md) - Guía de contribución

### 🔧 Desarrollo

#### Backend
- [API Documentation](API.md) - Especificación completa de la API REST
- [Create Admin User](CREATE_ADMIN.md) - Cómo crear un usuario administrador
- [Supabase Setup](../backend/database/SUPABASE_SETUP.md) - Configuración de base de datos

#### Frontend
- [SEO Implementation](SEO_IMPLEMENTATION.md) - Implementación de SEO

### 💳 Pagos
- [Payment Fixes](PAYMENT_FIXES.md) - Correcciones de sistema de pagos
- [Pagos Internacionales](PAGOS_INTERNACIONALES.md) - Configuración de pagos internacionales

### 🌐 Deployment
- [Deployment Guide](DEPLOYMENT.md) - Guía de despliegue en producción

### 📝 Nuevas Funcionalidades
- [Nuevas Funcionalidades](NUEVAS_FUNCIONALIDADES.md) - Registro de nuevas features

## 🏗️ Arquitectura del Proyecto

```
pq_trader/
├── backend/              # API REST (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/      # Configuraciones (Supabase, Stripe)
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── middleware/  # Middlewares (auth, error)
│   │   ├── routes/      # Rutas de API
│   │   ├── services/    # Servicios externos
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utilidades
│   └── supabase_migrations/ # SQL migrations
│
├── frontend/            # Next.js 14 (App Router)
│   └── src/
│       ├── app/        # Páginas y rutas
│       ├── components/ # Componentes React
│       ├── hooks/      # Custom hooks
│       ├── lib/        # Utilidades (i18n, utils)
│       └── services/   # API clients
│
└── docs/               # Documentación (estás aquí)
```

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT + bcrypt
- **Payments:** Stripe
- **Validation:** Joi
- **Security:** Helmet, express-rate-limit

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod
- **State:** Zustand
- **Data Fetching:** SWR
- **i18n:** Custom implementation (ES/EN)

### DevOps
- **Hosting:** Vercel (Frontend) + Railway (Backend)
- **Database:** Supabase
- **CI/CD:** GitHub Actions
- **Monitoring:** Logs + Error tracking

## 📖 Guías Rápidas

### Crear un Admin User
```bash
cd backend
npm run create:admin
```

### Ejecutar Migraciones SQL
```sql
-- En Supabase SQL Editor
\i backend/supabase_migrations/001_create_courses.sql
\i backend/supabase_migrations/002_create_portfolios.sql
\i backend/supabase_migrations/003_create_mentorships.sql
\i backend/supabase_migrations/004_create_transactions.sql
```

### Desarrollo Local
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 🔐 Variables de Entorno

### Backend (.env)
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=4000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📞 Soporte

Para preguntas o problemas:
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Email:** support@pqtrader.com
- **Discord:** [Join our community](https://discord.gg/pqtrader)

## 📄 License

MIT License - Ver [LICENSE](../LICENSE) para más detalles.

---

**Última actualización:** Enero 2026
