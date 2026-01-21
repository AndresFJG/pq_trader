
# Plan de Limpieza y Reorganización - PQ Trader

## 📋 Archivos a Eliminar

### 1. Modelos MongoDB Obsoletos (Ya usamos Supabase)
- ❌ `backend/src/models/Booking.model.ts`
- ❌ `backend/src/models/Course.model.ts`
- ❌ `backend/src/models/Lesson.model.ts`
- ❌ `backend/src/models/Mentorship.model.ts`
- ❌ `backend/src/models/User.model.ts`
- ✅ **Mantener:** Solo interfaces TypeScript si son necesarias

### 2. Documentación Duplicada
- ❌ `DEPLOYMENT.md` (raíz) - Duplicado en docs/
- ❌ `REVIEW_REPORT.md` - Reporte temporal
- ❌ `NUEVAS_FUNCIONALIDADES.md` - Movido a docs/
- ✅ **Mantener:** README.md, QUICK_START.md, CONTRIBUTING.md

### 3. Archivos Temporales
- ❌ `PQ Trader nuevo contenido.pdf` - Archivo temporal
- ❌ `netlify.toml` - No se usa Netlify
- ❌ `package-lock.json` (raíz) - No hay package.json en raíz

### 4. Scripts Obsoletos
- ✅ Revisar `scripts/setup.sh` - Actualizar o eliminar

## 📁 Nueva Estructura Propuesta

```
pq_trader/
├── .github/                    # GitHub configs
│   ├── copilot-instructions.md
│   ├── PROJECT_CONTEXT.md
│   ├── PROMPT_LIBRARY.md
│   └── QUICK_REFERENCE.md
│
├── backend/
│   ├── database/
│   │   ├── schema-supabase.sql
│   │   └── SUPABASE_SETUP.md
│   ├── src/
│   │   ├── config/            # Configuraciones (Supabase, Stripe, etc.)
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── middleware/        # Middlewares (auth, error, rate-limit)
│   │   ├── routes/            # Rutas de API
│   │   ├── services/          # Servicios externos (Stripe, email)
│   │   ├── scripts/           # Scripts de utilidad (create-admin)
│   │   ├── types/            # TypeScript types compartidos
│   │   ├── utils/            # Utilidades (logger, validators)
│   │   └── index.ts          # Entry point
│   ├── supabase_migrations/   # SQL migrations
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── admin/        # Panel admin
│   │   │   ├── (public)/     # Páginas públicas
│   │   │   └── api/          # API routes (opcional)
│   │   ├── components/
│   │   │   ├── admin/        # Componentes admin
│   │   │   ├── layouts/      # Navbar, Footer
│   │   │   ├── modals/       # Modales
│   │   │   ├── sections/     # Secciones de landing
│   │   │   ├── trading/      # Componentes de trading
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilidades (i18n, utils, seo)
│   │   ├── services/         # API clients
│   │   └── types/            # TypeScript types
│   ├── .env.local.example
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                      # Documentación centralizada
│   ├── API.md
│   ├── CREATE_ADMIN.md
│   ├── DEPLOYMENT.md
│   ├── PAGOS_INTERNACIONALES.md
│   ├── PAYMENT_FIXES.md
│   └── SEO_IMPLEMENTATION.md
│
├── .cursorrules              # Reglas de Cursor
├── .gitignore
├── .prettierrc
├── CONTRIBUTING.md
├── LICENSE
├── README.md                 # Documentación principal
└── QUICK_START.md           # Guía rápida

```

## ✅ Acciones a Realizar

### Fase 1: Eliminar Archivos Obsoletos
1. Eliminar modelos MongoDB del backend
2. Eliminar archivos duplicados de documentación
3. Eliminar archivos temporales (PDF, netlify.toml)
4. Limpiar package-lock.json de raíz

### Fase 2: Reorganizar Documentación
1. Consolidar toda la documentación en `/docs/`
2. Actualizar referencias en README.md
3. Crear índice en docs/README.md

### Fase 3: Crear Types Compartidos
1. Crear `backend/src/types/` con interfaces de Supabase
2. Asegurar consistencia entre frontend y backend

### Fase 4: Optimizar Scripts
1. Revisar y actualizar `scripts/setup.sh`
2. Documentar scripts de backend (create-admin, etc.)

## 🎯 Beneficios

- ✅ Código más limpio y mantenible
- ✅ Estructura clara y escalable
- ✅ Sin código legacy de MongoDB
- ✅ Documentación centralizada
- ✅ Menos confusión para nuevos desarrolladores
- ✅ Menor tamaño de repositorio

## ⚠️ Precauciones

- Hacer backup antes de eliminar
- Verificar que no haya imports activos de modelos MongoDB
- Actualizar documentación después de cambios
