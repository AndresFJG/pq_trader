# Guía de Contribución - PQ Trader

¡Gracias por tu interés en contribuir a PQ Trader! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Guía de Commits](#guía-de-commits)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## Código de Conducta

Este proyecto y todos los participantes deben adherirse a nuestro código de conducta. Esperamos:

- Respeto mutuo y profesionalismo
- Comunicación constructiva y educada
- Colaboración abierta y transparente
- Enfoque en lo mejor para el proyecto

## ¿Cómo Puedo Contribuir?

### Reportar Bugs

Si encuentras un bug, abre un issue incluyendo:

1. **Descripción clara del problema**
2. **Pasos para reproducir**
3. **Comportamiento esperado vs actual**
4. **Screenshots (si aplica)**
5. **Entorno:** OS, navegador, versión de Node.js

```markdown
**Descripción del Bug**
El botón de "Comprar Curso" no responde en móviles

**Pasos para Reproducir**
1. Abrir en móvil
2. Navegar a /cursos
3. Click en "Comprar Curso"

**Esperado:** Abrir modal de checkout
**Actual:** Nada sucede

**Entorno:**
- iOS 17
- Safari
- iPhone 14
```

### Sugerir Mejoras

Para sugerir una nueva funcionalidad:

1. **Verifica** que no exista un issue similar
2. **Describe** la funcionalidad claramente
3. **Explica** por qué sería útil
4. **Propón** una implementación (opcional)

## Proceso de Desarrollo

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
git clone https://github.com/tu-usuario/pq_trader.git
cd pq_trader

# Agregar remote del original
git remote add upstream https://github.com/pqtrader/pq_trader.git
```

### 2. Crear Rama

```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear rama para tu feature
git checkout -b feature/nombre-descriptivo
```

**Convención de nombres de ramas:**
- `feature/` - Nuevas funcionalidades
- `fix/` - Correcciones de bugs
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización de código
- `test/` - Agregar o mejorar tests
- `chore/` - Tareas de mantenimiento

### 3. Desarrollar

```bash
# Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# Iniciar en modo desarrollo
npm run dev
```

### 4. Tests

```bash
# Ejecutar tests antes de commit
npm run test

# Verificar coverage
npm run test:coverage

# Linting
npm run lint
```

### 5. Commit

```bash
# Agregar cambios
git add .

# Commit siguiendo convención
git commit -m "feat: agregar integración con Darwinex API"
```

### 6. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/nombre-descriptivo

# Crear Pull Request en GitHub
```

## Estándares de Código

### TypeScript

```typescript
// ✅ Correcto
interface UserData {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export async function getUser(id: string): Promise<UserData> {
  // ...
}

// ❌ Incorrecto
export async function getUser(id) {
  // Sin tipos
}
```

### React Components

```typescript
// ✅ Correcto - Server Component
interface CourseProps {
  courseId: string;
}

export default async function CoursePage({ courseId }: CourseProps) {
  const course = await getCourse(courseId);
  return <div>{course.title}</div>
}

// ✅ Correcto - Client Component
'use client';

export default function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Estilos

```typescript
// ✅ Usar Tailwind CSS
<div className="flex items-center gap-4 p-6 bg-gray-900 rounded-lg">
  <Button className="bg-primary hover:bg-primary/90">
    Comprar
  </Button>
</div>

// ❌ Evitar estilos inline
<div style={{ display: 'flex', padding: '24px' }}>
  ...
</div>
```

### Validación

```typescript
// ✅ Backend - Joi
const courseSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  price: Joi.number().positive().required(),
});

// ✅ Frontend - Zod + React Hook Form
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Manejo de Errores

```typescript
// ✅ Backend
try {
  const result = await someAsyncOperation();
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Error del servidor' 
  });
}

// ✅ Frontend
const { data, error, isLoading } = useSWR('/api/data', fetcher);

if (error) return <ErrorState message={error.message} />;
if (isLoading) return <LoadingState />;
```

## Guía de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/)

### Formato

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

- **feat:** Nueva funcionalidad
- **fix:** Corrección de bug
- **docs:** Cambios en documentación
- **style:** Formato, punto y coma, etc (no afecta el código)
- **refactor:** Refactorización de código
- **test:** Agregar o modificar tests
- **chore:** Tareas de mantenimiento
- **perf:** Mejoras de performance

### Ejemplos

```bash
# Feature simple
git commit -m "feat: agregar página de checkout"

# Fix con scope
git commit -m "fix(auth): corregir validación de tokens JWT"

# Con cuerpo
git commit -m "feat(payment): integrar webhook de Stripe

- Implementar manejo de eventos de Stripe
- Actualizar estado de suscripción del usuario
- Enviar email de confirmación"

# Breaking change
git commit -m "feat!: cambiar estructura de API de cursos

BREAKING CHANGE: El endpoint /api/courses ahora devuelve
un objeto paginado en lugar de un array"
```

## Pull Requests

### Checklist

Antes de crear un PR, verifica:

- [ ] Código sigue los estándares del proyecto
- [ ] Todos los tests pasan
- [ ] Agregaste tests para nuevas funcionalidades
- [ ] Documentación actualizada (si aplica)
- [ ] No hay conflictos con `main`
- [ ] Commits siguen la convención
- [ ] No hay console.logs olvidados
- [ ] Código linted y formateado

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios realizados

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo ha sido probado?
Describe los tests realizados

## Screenshots (si aplica)
Agrega capturas de pantalla

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado partes complejas
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests
- [ ] Todos los tests pasan localmente
```

### Revisión de Código

Los PRs serán revisados considerando:

1. **Funcionalidad:** ¿Hace lo que debe hacer?
2. **Tests:** ¿Tiene cobertura adecuada?
3. **Performance:** ¿Es eficiente?
4. **Seguridad:** ¿Introduce vulnerabilidades?
5. **Mantenibilidad:** ¿Es fácil de entender y mantener?
6. **Diseño:** ¿Sigue los patrones del proyecto?

## Testing

### Unit Tests

```typescript
// Backend
describe('CourseController', () => {
  it('should create a course', async () => {
    const course = await createCourse(mockData);
    expect(course).toHaveProperty('id');
  });
});

// Frontend
describe('CourseCard', () => {
  it('renders course information', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('Trading')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
describe('Payment Flow', () => {
  it('should complete checkout', async () => {
    const response = await request(app)
      .post('/api/payments/checkout')
      .send(checkoutData)
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

## Estructura del Proyecto

Cuando agregues archivos nuevos, sigue la estructura:

```
frontend/src/
├── app/
│   ├── (public)/          # Rutas públicas
│   ├── (dashboard)/       # Rutas protegidas
│   └── api/               # API routes
├── components/
│   ├── ui/                # Componentes base
│   ├── forms/             # Formularios
│   └── layouts/           # Layouts
├── lib/                   # Utilidades
└── hooks/                 # Custom hooks

backend/src/
├── controllers/           # Lógica de negocio
├── models/               # Modelos
├── routes/               # Rutas
├── middleware/           # Middlewares
└── services/             # Servicios externos
```

## Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Stripe API](https://stripe.com/docs/api)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Preguntas

Si tienes preguntas:

1. Revisa la [documentación](README.md)
2. Busca en [issues existentes](https://github.com/pqtrader/pq_trader/issues)
3. Abre un nuevo issue con la etiqueta `question`
4. Contacta al equipo: dev@pqtrader.com

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia MIT del proyecto.

---

¡Gracias por contribuir a PQ Trader! 🚀
