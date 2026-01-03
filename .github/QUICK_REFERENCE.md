# Quick Reference - PQ Trader

> Comandos y snippets rápidos para uso diario

---

## 🚀 COMANDOS DE DESARROLLO

### Iniciar Proyecto
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Tests
```bash
# Backend
cd backend
npm test                    # Run tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage

# Frontend
cd frontend
npm test
npm run test:coverage
```

### Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run start
```

### Linting
```bash
npm run lint
npm run lint:fix
npm run format
```

---

## 📝 SNIPPETS COMUNES

### Nuevo Componente React
```typescript
'use client';

import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
}

export function ComponentName({ className }: ComponentNameProps) {
  return (
    <div className={cn('base-classes', className)}>
      Content
    </div>
  );
}
```

### Nuevo Controller (Backend)
```typescript
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Model from '../models/Model.model';

export const getResource = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const data = await Model.find();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### Nueva Ruta (Backend)
```typescript
import { Router } from 'express';
import { getResource } from '../controllers/resource.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', protect, getResource);

export default router;
```

### Custom Hook
```typescript
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<{ success: boolean; data: T }>(url);
        setData(response.data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

### Modelo MongoDB
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IModel extends Document {
  field1: string;
  field2: number;
  createdAt: Date;
}

const modelSchema = new Schema<IModel>(
  {
    field1: {
      type: String,
      required: true,
    },
    field2: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IModel>('Model', modelSchema);
```

---

## 🎯 TAREAS COMUNES

### Agregar nueva ruta protegida
```typescript
// 1. Controller
export const newAction = async (req: AuthRequest, res: Response) => {
  // ...
};

// 2. Route
router.post('/action', protect, authorize('admin'), newAction);

// 3. Frontend
const response = await api.post('/api/resource/action', data);
```

### Agregar validación
```typescript
// Backend (Joi)
const schema = Joi.object({
  field: Joi.string().required(),
});

// Frontend (Zod)
const schema = z.object({
  field: z.string().min(3),
});
```

### Agregar test
```typescript
// Backend
describe('Feature', () => {
  it('should work', async () => {
    const res = await request(app)
      .get('/api/resource')
      .expect(200);
    
    expect(res.body.success).toBe(true);
  });
});

// Frontend
test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Text')).toBeInTheDocument();
});
```

---

## 🔍 DEBUGGING

### Backend
```typescript
// Logs
console.log('Debug:', data);
console.error('Error:', error);

// Debug con VSCode
// F5 → Node.js
// Breakpoints en código
```

### Frontend
```typescript
// Console
console.log('Data:', data);

// React DevTools
// Inspeccionar componentes y estado

// Network tab
// Ver requests HTTP
```

### MongoDB
```bash
# Conectar a MongoDB local
mongosh

# Ver databases
show dbs

# Usar database
use pqtrader

# Ver collections
show collections

# Query
db.users.find({})
```

---

## 📊 FORMATO DE RESPUESTAS

### Éxito
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "error": "Mensaje de error"
}
```

### Lista paginada
```json
{
  "success": true,
  "count": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

---

## 🎨 CLASES DE TAILWIND

### Layout
```css
/* Container */
container mx-auto px-4

/* Flex */
flex items-center justify-between gap-4

/* Grid */
grid grid-cols-1 md:grid-cols-3 gap-8
```

### Colores Trading
```css
/* Ganancia */
text-profit bg-profit/10 border-profit

/* Pérdida */
text-loss bg-loss/10 border-loss

/* Neutral */
text-neutral bg-neutral/10
```

### Responsive
```css
/* Mobile first */
text-sm md:text-base lg:text-lg

/* Hide/Show */
hidden md:block
block md:hidden
```

---

## 🔐 AUTH FLOW

### Login
```typescript
// Frontend
const { user, login } = useAuth();
await login(email, password);

// Backend verifica y devuelve
{
  token: "jwt...",
  refreshToken: "refresh...",
  user: { ... }
}

// Frontend guarda en localStorage
localStorage.setItem('token', token);
```

### Protected Route
```typescript
// Frontend
if (!user) {
  redirect('/login');
}

// Backend
router.get('/', protect, handler);
```

---

## 💳 STRIPE FLOW

### Crear suscripción
```typescript
// 1. Frontend: Stripe Elements
const stripe = await loadStripe(publicKey);
const elements = stripe.elements();
const cardElement = elements.create('card');

// 2. Submit
const { token } = await stripe.createToken(cardElement);

// 3. Backend
const subscription = await stripeService.createSubscription(
  customerId,
  priceId
);

// 4. Webhook
stripe.webhooks.constructEvent(payload, signature, secret);
```

---

## 📁 PATHS ÚTILES

```
Frontend:
- Componentes:  frontend/src/components/
- Pages:        frontend/src/app/
- Utils:        frontend/src/lib/
- Hooks:        frontend/src/hooks/
- Types:        frontend/src/types/

Backend:
- Controllers:  backend/src/controllers/
- Models:       backend/src/models/
- Routes:       backend/src/routes/
- Middleware:   backend/src/middleware/
- Services:     backend/src/services/

Docs:
- API:          docs/API.md
- Deploy:       docs/DEPLOYMENT.md
- Prompts:      .github/PROMPT_LIBRARY.md
- Context:      .github/PROJECT_CONTEXT.md
```

---

## 🆘 TROUBLESHOOTING

### Port ocupado
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID xxxx /F

# Mac/Linux
lsof -i :4000
kill -9 PID
```

### MongoDB no conecta
```bash
# Verificar servicio
# Windows: services.msc
# Mac: brew services list
# Linux: sudo systemctl status mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/pqtrader
```

### JWT inválido
```typescript
// Verificar expiración
const decoded = jwt.verify(token, secret);

// Refrescar token
POST /api/auth/refresh
{ refreshToken: "..." }
```

### CORS error
```typescript
// Backend
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})

// Frontend axios
axios.defaults.withCredentials = true;
```

---

## 📞 CONTACTOS

**Documentación:**
- README.md
- .cursorrules
- docs/API.md

**AI Prompts:**
- .github/PROMPT_LIBRARY.md
- .github/PROJECT_CONTEXT.md

**Soporte:**
- Email: dev@pqtrader.com
- Issues: GitHub Issues

---

**Versión:** 1.0.0
