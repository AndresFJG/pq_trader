# PQ Trader - GitHub Copilot Instructions

## Contexto del Proyecto

PQ Trader es una plataforma de educación de trading algorítmico con las siguientes características:

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **Pagos:** Stripe (suscripciones recurrentes)
- **Trading Data:** Integración con Darwinex API
- **Autenticación:** JWT con refresh tokens
- **Seguridad:** Rate limiting, validación, CORS, Helmet

## Stack Completo

### Frontend
- React 18
- Next.js 14 con App Router
- TypeScript (modo strict)
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- Axios para HTTP
- SWR para data fetching
- Zustand para estado global
- Framer Motion para animaciones

### Backend
- Node.js 20
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT + bcrypt
- Joi para validación
- Helmet para seguridad
- express-rate-limit
- Stripe SDK
- Nodemailer

## Guías de Desarrollo

### Al crear componentes de React:
```typescript
// Server Component por defecto
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>
}

// Client Component solo cuando sea necesario
'use client';
export default function Interactive() {
  const [state, setState] = useState();
  return <div>{state}</div>
}
```

### Al crear rutas de API (Backend):
```typescript
// Controller
export const getResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await Model.find();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Route
router.get('/', protect, authorize('admin'), getResource);
```

### Validación:
```typescript
// Backend (Joi)
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Frontend (Zod + React Hook Form)
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Estilos:
```typescript
// Usar Tailwind + cn() utility
<div className={cn(
  "base-classes",
  condition && "conditional-classes"
)}>
```

## Patrones Importantes

1. **Manejo de errores consistente:** Siempre usar try-catch en el backend, siempre devolver `{ success: boolean, data?: any, error?: string }`

2. **Autenticación:** JWT en Authorization header, refresh tokens para renovación

3. **Rate Limiting:** Aplicado en rutas sensibles (auth, pagos)

4. **Validación:** Siempre validar inputs tanto en frontend como backend

5. **Types compartidos:** Definir types en `/shared/types` cuando se usen en ambos lados

6. **Trading Theme:** Usar colores específicos: verde (#00C853) para ganancias, rojo (#FF3B30) para pérdidas

7. **Responsive:** Todo debe ser mobile-first con Tailwind

8. **Performance:** 
   - Server Components por defecto
   - Lazy loading de componentes pesados
   - Optimización de imágenes con next/image

## Estructura de Archivos

```
pq_trader/
├── frontend/
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # Componentes reutilizables
│   │   ├── lib/          # Utilidades
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript types
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── models/       # Modelos de MongoDB
│   │   ├── routes/       # Rutas
│   │   ├── middleware/   # Middlewares
│   │   ├── services/     # Servicios externos
│   │   └── index.ts      # Entry point
│   └── package.json
├── docs/                 # Documentación
├── .cursorrules         # Reglas de Cursor
└── README.md
```

## Convenciones

### Commits
```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo
refactor: refactorización
test: agregar tests
chore: tareas de mantenimiento
```

### Nombres
- Componentes: PascalCase (UserProfile.tsx)
- Funciones: camelCase (getUserData)
- Constantes: UPPER_SNAKE_CASE (MAX_RETRIES)
- Types: PascalCase (UserData, ApiResponse)

### Imports
```typescript
// 1. Externos
import React from 'react';

// 2. Internos
import { Button } from '@/components/ui/button';

// 3. Utils/Hooks
import { cn } from '@/lib/utils';

// 4. Types
import type { User } from '@/types';
```

## Testing

```typescript
// Backend
describe('Auth Controller', () => {
  it('should register user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
  });
});

// Frontend
test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## Comandos Comunes

```bash
# Desarrollo
cd frontend && npm run dev
cd backend && npm run dev

# Tests
npm run test
npm run test:coverage

# Build
npm run build

# Lint
npm run lint
```

## Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Stripe API](https://stripe.com/docs/api)
- [MongoDB Docs](https://docs.mongodb.com/)

## Notas Importantes

- **NUNCA** commitear `.env` con credenciales reales
- **SIEMPRE** validar inputs tanto en frontend como backend
- **USAR** TypeScript strict mode, evitar `any`
- **IMPLEMENTAR** rate limiting en rutas de autenticación
- **DOCUMENTAR** funciones complejas
- **ESCRIBIR** tests para nuevas funcionalidades
- **MANTENER** consistencia en estructura de respuestas API

---

Este proyecto está diseñado para traders. Mantén la UX profesional, la seguridad alta, y el rendimiento óptimo.
