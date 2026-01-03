# PQ Trader - Prompt Library

Esta es una biblioteca de prompts para tareas comunes en PQ Trader. Úsalos como plantillas para mantener consistencia y acelerar el desarrollo.

---

## 📋 ÍNDICE

1. [Crear Nuevo Componente](#crear-nuevo-componente)
2. [Crear Nueva Ruta de API](#crear-nueva-ruta-de-api)
3. [Agregar Modelo de MongoDB](#agregar-modelo-de-mongodb)
4. [Implementar Feature Completa](#implementar-feature-completa)
5. [Agregar Tests](#agregar-tests)
6. [Corregir Bug](#corregir-bug)
7. [Optimizar Performance](#optimizar-performance)
8. [Agregar Validación](#agregar-validacion)
9. [Integrar Servicio Externo](#integrar-servicio-externo)
10. [Documentar Endpoint](#documentar-endpoint)

---

## 🎨 CREAR NUEVO COMPONENTE

```
Necesito crear un nuevo componente de React para PQ Trader.

CONTEXTO:
- Frontend: Next.js 14 con App Router, TypeScript, Tailwind CSS, shadcn/ui
- Tema: Diseño oscuro para trading
- Colores: Verde (#00C853) ganancias, Rojo (#FF3B30) pérdidas

REQUISITOS:
- Nombre: [NombreDelComponente]
- Ubicación: frontend/src/components/[carpeta]/[nombre].tsx
- Descripción: [Descripción de qué hace el componente]
- Props necesarias: [listar props]
- Estado local: [¿necesita useState/useEffect?]
- Tipo: [Server Component / Client Component]

DEBE INCLUIR:
- TypeScript con tipos explícitos
- Tailwind CSS para estilos
- Responsive (mobile-first)
- Manejo de estados de carga y error
- Accesibilidad (aria-labels)

EJEMPLO DE USO:
[Mostrar cómo se usaría el componente]
```

**Ejemplo concreto:**
```
Necesito crear un componente CourseEnrollButton que permita inscribirse en un curso.

CONTEXTO: PQ Trader - plataforma de trading education

REQUISITOS:
- Nombre: CourseEnrollButton
- Ubicación: frontend/src/components/courses/CourseEnrollButton.tsx
- Props: courseId: string, courseName: string, isEnrolled?: boolean
- Client Component (necesita onClick handler)
- Debe mostrar "Inscrito" si ya está inscrito, o "Inscribirse" si no

DEBE INCLUIR:
- Loading state mientras procesa
- Toast notification al completar
- Deshabilitar botón si está cargando
- Verificar autenticación (useAuth)
```

---

## 🔧 CREAR NUEVA RUTA DE API

```
Necesito crear un nuevo endpoint en el backend de PQ Trader.

CONTEXTO:
- Backend: Node.js + Express + TypeScript + MongoDB
- Patrón: Controller → Route → Middleware
- Respuesta: { success: boolean, data?: any, error?: string }

ENDPOINT:
- Método: [GET/POST/PUT/DELETE]
- Ruta: /api/[recurso]/[acción]
- Descripción: [Qué hace este endpoint]

REQUISITOS:
- Autenticación: [público / protect / protect + authorize('admin')]
- Rate limiting: [sí/no, qué limiter usar]
- Validación: [qué campos validar con Joi]
- Modelo: [qué modelo de MongoDB usar]

LÓGICA:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

RESPUESTA EXITOSA:
[Ejemplo de respuesta JSON]

RESPUESTA DE ERROR:
[Casos de error a manejar]
```

**Ejemplo concreto:**
```
Crear endpoint para obtener lecciones de un curso.

ENDPOINT:
- Método: GET
- Ruta: /api/courses/:courseId/lessons
- Descripción: Obtiene todas las lecciones de un curso específico

REQUISITOS:
- Autenticación: protect (usuario debe estar autenticado)
- Verificar que el usuario esté inscrito en el curso
- Rate limiting: apiLimiter
- Validación: courseId debe ser ObjectId válido
- Modelo: Lesson

LÓGICA:
1. Verificar que el curso existe
2. Verificar que el usuario está inscrito
3. Obtener lecciones ordenadas por 'order'
4. Si no está inscrito, solo mostrar primera lección (preview)

RESPUESTA:
{ success: true, data: [{ id, title, description, duration, order }] }
```

---

## 💾 AGREGAR MODELO DE MONGODB

```
Necesito crear un nuevo modelo de MongoDB para PQ Trader.

CONTEXTO:
- Backend: Mongoose con TypeScript
- Ubicación: backend/src/models/[Nombre].model.ts
- Convención: Export interface y model

MODELO:
- Nombre: [NombreDelModelo]
- Descripción: [Para qué se usa]

CAMPOS:
1. [campo1]: [tipo] - [descripción] - [requerido/opcional] - [validaciones]
2. [campo2]: [tipo] - [descripción]
...

RELACIONES:
- [Relación con otro modelo, si aplica]

MÉTODOS/HOOKS:
- [pre/post hooks si son necesarios]
- [métodos personalizados]

ÍNDICES:
- [Si necesita índices especiales]
```

**Ejemplo concreto:**
```
Crear modelo Progress para tracking de progreso en cursos.

MODELO: Progress
DESCRIPCIÓN: Rastrea el progreso de un usuario en un curso

CAMPOS:
1. userId: ObjectId (ref: User) - ID del usuario - requerido
2. courseId: ObjectId (ref: Course) - ID del curso - requerido
3. completedLessons: Array<ObjectId> (ref: Lesson) - Lecciones completadas
4. progressPercentage: Number (0-100) - Porcentaje de avance - default: 0
5. lastAccessedAt: Date - Última vez que accedió - default: Date.now
6. startedAt: Date - Cuándo comenzó el curso - default: Date.now
7. completedAt: Date - Cuándo completó el curso - opcional

MÉTODOS:
- calculateProgress(): void - Recalcula progressPercentage basado en completedLessons

ÍNDICES:
- Compuesto en userId + courseId (único)
```

---

## 🚀 IMPLEMENTAR FEATURE COMPLETA

```
Necesito implementar una feature completa en PQ Trader (frontend + backend).

FEATURE: [Nombre de la funcionalidad]
DESCRIPCIÓN: [Qué hace la feature]

ALCANCE:
- Frontend: [qué componentes/páginas crear]
- Backend: [qué endpoints crear]
- Database: [qué modelos crear/modificar]
- Integraciones: [servicios externos si aplica]

USER STORY:
Como [tipo de usuario]
Quiero [acción]
Para [objetivo]

CRITERIOS DE ACEPTACIÓN:
1. [Criterio 1]
2. [Criterio 2]
3. [Criterio 3]

FLUJO DE USUARIO:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

CONSIDERACIONES:
- Seguridad: [aspectos de seguridad]
- Performance: [optimizaciones necesarias]
- UX: [consideraciones de experiencia de usuario]
```

**Ejemplo concreto:**
```
FEATURE: Sistema de Reviews de Cursos

DESCRIPCIÓN: Permitir a usuarios dejar reseñas y calificaciones en cursos completados

ALCANCE:
- Frontend: 
  * Componente ReviewForm
  * Componente ReviewsList
  * Modal para escribir review
  * Actualizar CourseCard con rating promedio
  
- Backend:
  * Modelo Review
  * POST /api/courses/:id/reviews (crear review)
  * GET /api/courses/:id/reviews (obtener reviews)
  * DELETE /api/reviews/:id (eliminar propia review)
  
- Database:
  * Modelo Review (user, course, rating, comment, createdAt)
  * Actualizar Course.rating cuando se crea review

USER STORY:
Como estudiante que completó un curso
Quiero dejar una reseña y calificación
Para ayudar a otros estudiantes a decidir

CRITERIOS DE ACEPTACIÓN:
1. Solo usuarios que completaron el curso pueden dejar review
2. Un usuario solo puede dejar una review por curso
3. Rating de 1 a 5 estrellas
4. Comentario opcional de máximo 500 caracteres
5. Se actualiza el rating promedio del curso automáticamente
6. Usuario puede editar/eliminar su propia review

FLUJO:
1. Usuario completa curso
2. Se muestra botón "Dejar Reseña"
3. Modal con formulario (rating + comentario)
4. Submit → POST /api/courses/:id/reviews
5. Review aparece en lista de reviews
6. Rating promedio del curso se actualiza

CONSIDERACIONES:
- Seguridad: Verificar que usuario completó el curso
- Performance: Paginar reviews (10 por página)
- UX: Animación al dar estrellas, confirmación antes de eliminar
```

---

## 🧪 AGREGAR TESTS

```
Necesito crear tests para [componente/endpoint/función] en PQ Trader.

TIPO: [Unit Test / Integration Test / E2E Test]
ARCHIVO A TESTEAR: [ruta del archivo]
UBICACIÓN DEL TEST: [ruta del archivo de test]

CASOS DE PRUEBA:
1. [Caso 1 - qué debe verificar]
2. [Caso 2 - qué debe verificar]
3. [Caso 3 - manejo de errores]
4. [Caso 4 - edge cases]

MOCKS NECESARIOS:
- [Qué servicios/funciones mockear]

SETUP:
- [Configuración necesaria antes de los tests]

COBERTURA ESPERADA:
- [% de cobertura deseado]
```

**Ejemplo concreto:**
```
Tests para auth.controller.ts - función login

TIPO: Unit Test
ARCHIVO: backend/src/controllers/auth.controller.ts
UBICACIÓN: backend/src/controllers/__tests__/auth.controller.test.ts

CASOS DE PRUEBA:
1. Login exitoso con credenciales válidas
   - Debe retornar token y refreshToken
   - Debe retornar datos del usuario
   
2. Login fallido con email incorrecto
   - Debe retornar 401
   - Error: "Credenciales inválidas"
   
3. Login fallido con password incorrecta
   - Debe retornar 401
   - Error: "Credenciales inválidas"
   
4. Login sin email o password
   - Debe retornar 400
   - Error: "Por favor proporciona email y contraseña"

MOCKS:
- User.findOne()
- user.matchPassword()
- jwt.sign()

SETUP:
- Crear usuario de prueba en beforeEach
- Limpiar database en afterEach
```

---

## 🐛 CORREGIR BUG

```
Hay un bug en PQ Trader que necesito corregir.

BUG: [Descripción breve del bug]
SEVERIDAD: [Crítico / Alto / Medio / Bajo]
UBICACIÓN: [Archivo(s) afectado(s)]

COMPORTAMIENTO ACTUAL:
[Qué está pasando ahora]

COMPORTAMIENTO ESPERADO:
[Qué debería pasar]

PASOS PARA REPRODUCIR:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

ERROR/LOG:
```
[Mensaje de error si lo hay]
```

HIPÓTESIS:
[Qué creo que está causando el bug]

ARCHIVOS A REVISAR:
- [archivo1.ts]
- [archivo2.tsx]

PRIORIDAD: [Alta / Media / Baja]
```

**Ejemplo concreto:**
```
BUG: No se actualizan los enrolled count al inscribirse en curso
SEVERIDAD: Medio
UBICACIÓN: backend/src/controllers/course.controller.ts

COMPORTAMIENTO ACTUAL:
Cuando un usuario se inscribe en un curso, el campo 'enrolled' no incrementa

COMPORTAMIENTO ESPERADO:
El contador 'enrolled' debe incrementar en +1 cada vez que alguien se inscribe

PASOS PARA REPRODUCIR:
1. Login como usuario
2. POST /api/courses/:id/enroll
3. GET /api/courses/:id
4. El campo 'enrolled' sigue igual

ERROR/LOG:
No hay error, simplemente no se actualiza el campo

HIPÓTESIS:
La función enrollCourse agrega el curso al usuario pero no incrementa el contador

ARCHIVOS A REVISAR:
- backend/src/controllers/course.controller.ts (función enrollCourse)
- backend/src/models/Course.model.ts

PRIORIDAD: Media
```

---

## ⚡ OPTIMIZAR PERFORMANCE

```
Necesito optimizar el performance de [componente/endpoint/query] en PQ Trader.

PROBLEMA:
[Qué está lento o consumiendo muchos recursos]

MÉTRICAS ACTUALES:
- Tiempo de carga: [X segundos/ms]
- Uso de memoria: [X MB]
- Queries a DB: [X queries]

OBJETIVO:
- Tiempo de carga: [< X segundos/ms]
- Reducir queries en: [X%]

ÁREA A OPTIMIZAR:
[Frontend / Backend / Database / API calls]

TÉCNICAS POSIBLES:
- [ ] Caching
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Database indexing
- [ ] Query optimization
- [ ] Pagination
- [ ] Memoization
- [ ] Image optimization

PRIORIDAD: [Alta / Media / Baja]
```

**Ejemplo concreto:**
```
Optimizar carga de lista de cursos en homepage

PROBLEMA:
La página principal tarda 3+ segundos en cargar porque hace muchas queries

MÉTRICAS ACTUALES:
- Tiempo de carga: 3.2 segundos
- Queries a DB: 1 + N (N = número de cursos) para instructores
- Sin caché

OBJETIVO:
- Tiempo de carga: < 1 segundo
- Reducir queries a 1 sola

ÁREA: Backend + Frontend

TÉCNICAS:
- [x] Usar .populate() para instructores (1 query en lugar de N)
- [x] Agregar caché en Redis (5 minutos)
- [x] Paginar resultados (10 cursos por página)
- [x] Implementar ISR en Next.js (revalidate: 60)
- [x] Lazy load de imágenes de cursos

PRIORIDAD: Alta (es la landing page)
```

---

## ✅ AGREGAR VALIDACIÓN

```
Necesito agregar validación a [formulario/endpoint/modelo] en PQ Trader.

UBICACIÓN:
- Frontend: [componente/formulario]
- Backend: [middleware/controller]

CAMPOS A VALIDAR:
1. [campo1]:
   - Tipo: [string/number/email/etc]
   - Requerido: [sí/no]
   - Reglas: [min, max, pattern, etc]
   - Mensaje de error: [mensaje personalizado]

2. [campo2]:
   ...

VALIDACIÓN FRONTEND (Zod):
- Validación en tiempo real: [sí/no]
- Mostrar errores debajo del campo

VALIDACIÓN BACKEND (Joi):
- Retornar todos los errores a la vez
- Status 400 con lista de errores
```

**Ejemplo concreto:**
```
Agregar validación a formulario de crear curso

UBICACIÓN:
- Frontend: frontend/src/app/(dashboard)/admin/courses/new/page.tsx
- Backend: backend/src/middleware/validation.middleware.ts

CAMPOS:
1. title:
   - Tipo: string
   - Requerido: sí
   - Min: 3 caracteres
   - Max: 100 caracteres
   - Error: "El título debe tener entre 3 y 100 caracteres"

2. description:
   - Tipo: string
   - Requerido: sí
   - Min: 10 caracteres
   - Error: "La descripción debe tener al menos 10 caracteres"

3. price:
   - Tipo: number
   - Requerido: sí
   - Min: 0
   - Error: "El precio debe ser mayor o igual a 0"

4. duration:
   - Tipo: number (horas)
   - Requerido: sí
   - Min: 1
   - Max: 500
   - Error: "La duración debe estar entre 1 y 500 horas"

5. level:
   - Tipo: enum
   - Opciones: beginner, intermediate, advanced
   - Requerido: sí
   - Error: "Selecciona un nivel válido"

FRONTEND:
- React Hook Form + Zod
- Validación en onChange
- Deshabilitar submit si hay errores

BACKEND:
- Joi schema en validation.middleware.ts
- Aplicar en ruta POST /api/courses
```

---

## 🔌 INTEGRAR SERVICIO EXTERNO

```
Necesito integrar un servicio externo en PQ Trader.

SERVICIO: [Nombre del servicio]
PROPÓSITO: [Para qué se usará]

AUTENTICACIÓN:
- Tipo: [API Key / OAuth / Bearer Token]
- Variables de entorno necesarias: [listar]

ENDPOINTS A USAR:
1. [endpoint1] - [qué hace]
2. [endpoint2] - [qué hace]

SERVICIO EN BACKEND:
- Ubicación: backend/src/services/[nombre].service.ts
- Clase: [NombreService]
- Métodos necesarios: [listar métodos]

MANEJO DE ERRORES:
- [Cómo manejar errores de la API]
- [Rate limits del servicio]
- [Fallbacks si no está disponible]

TESTING:
- [Cómo mockear en tests]
```

**Ejemplo concreto:**
```
Integrar Coinbase Commerce para pagos en cripto

SERVICIO: Coinbase Commerce
PROPÓSITO: Aceptar pagos en criptomonedas (BTC, ETH, USDC)

AUTENTICACIÓN:
- Tipo: API Key
- Variables: COINBASE_API_KEY, COINBASE_WEBHOOK_SECRET

ENDPOINTS:
1. POST /charges - Crear cargo de pago
2. GET /charges/:id - Verificar estado de pago
3. Webhook - Recibir notificaciones de pago

SERVICIO:
- Ubicación: backend/src/services/coinbase.service.ts
- Clase: CoinbaseService
- Métodos:
  * createCharge(amount, currency, description)
  * getCharge(chargeId)
  * verifyWebhook(payload, signature)

MANEJO DE ERRORES:
- Timeout después de 30 segundos
- Retry 3 veces si falla
- Fallback a Stripe si Coinbase no disponible
- Log todos los errores en Sentry

TESTING:
- Mockear axios calls
- Usar charges de prueba de Coinbase
```

---

## 📝 DOCUMENTAR ENDPOINT

```
Necesito documentar el endpoint [ruta] en PQ Trader.

ENDPOINT: [método] [ruta]
DESCRIPCIÓN: [Qué hace]

AUTENTICACIÓN: [Requerida / No requerida]
ROLES PERMITIDOS: [user / admin / mentor]

PARÁMETROS DE RUTA:
- [param1]: [descripción]

QUERY PARAMETERS:
- [param1]: [tipo] - [descripción] - [opcional/requerido]

BODY:
```json
{
  "campo1": "tipo - descripción",
  "campo2": "tipo - descripción"
}
```

RESPUESTA EXITOSA (200/201):
```json
{
  "success": true,
  "data": {}
}
```

RESPUESTAS DE ERROR:
- 400: [descripción]
- 401: [descripción]
- 404: [descripción]

EJEMPLO DE USO:
```bash
curl -X [MÉTODO] http://localhost:4000/api/[ruta] \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"campo": "valor"}'
```

AGREGAR A: docs/API.md
```

---

## 💡 TIPS DE USO

### Para usar estos prompts:

1. **Copia el template** que necesites
2. **Rellena los campos** entre corchetes [...]
3. **Pégalo en el chat** con el contexto necesario
4. El asistente generará el código siguiendo los patrones del proyecto

### Personalización:

Puedes combinar prompts. Por ejemplo:
- "Crear nueva feature" + "Agregar tests" = Feature completa con tests
- "Crear endpoint" + "Documentar endpoint" = API completa y documentada

### Mantener contexto:

Siempre incluye al inicio:
```
Proyecto: PQ Trader
Stack: [Frontend/Backend]
Referencia: Ver .cursorrules y README.md para convenciones
```

---

## 📚 RECURSOS RÁPIDOS

**Convenciones del proyecto:**
- Ver `.cursorrules`
- Ver `CONTRIBUTING.md`

**Arquitectura:**
- Ver `README.md` sección "Arquitectura"
- Ver `docs/ARCHITECTURE.md`

**API existente:**
- Ver `docs/API.md`

**Despliegue:**
- Ver `docs/DEPLOYMENT.md`

---

**Actualización:** Diciembre 2025
**Versión:** 1.0.0
