# Arquitectura de Validaciones - PQ Trader

## Estructura de Capas

La aplicación está organizada en capas separadas con responsabilidades bien definidas:

```
Frontend (UI Layer)
    ↓
API Routes (Entry Point)
    ↓
Validators (Input Validation)
    ↓
Controllers (Business Logic)
    ↓
Services (Data Access)
    ↓
Database (Supabase)
```

---

## 1. Frontend (`/frontend/src`)

### Responsabilidades:
- ✅ Solo UI y experiencia de usuario
- ✅ Validaciones básicas para mejorar UX (opcional)
- ✅ Manejo de estados de carga y errores visuales
- ❌ NO contiene lógica de negocio
- ❌ NO valida reglas de negocio complejas

### Ejemplo: `register/page.tsx`
```typescript
// ✅ Solo validaciones de UX (coincidencia de contraseñas, UI)
if (formData.password !== formData.confirmPassword) {
  toast.error('Las contraseñas no coinciden');
  return;
}

// ✅ Delega al hook de autenticación
await registerUser(formData.name, formData.email, formData.password);
```

---

## 2. API Routes (`/backend/src/routes`)

### Responsabilidades:
- ✅ Definir endpoints HTTP
- ✅ Aplicar middlewares en orden correcto
- ✅ Rate limiting
- ❌ NO contiene validaciones (usa middleware)
- ❌ NO contiene lógica de negocio

### Ejemplo: `auth.routes.ts`
```typescript
router.post('/register', 
  registerLimiter,        // 1. Rate limiting
  validate(registerSchema), // 2. Validación de datos
  register                 // 3. Controlador
);
```

---

## 3. Validators (`/backend/src/validators`)

### Responsabilidades:
- ✅ Validar formato de datos (Joi schemas)
- ✅ Validar tipos y restricciones
- ✅ Mensajes de error descriptivos
- ❌ NO accede a la base de datos
- ❌ NO contiene lógica de negocio

### Ejemplo: `auth.validator.ts`
```typescript
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required(),
});
```

---

## 4. Controllers (`/backend/src/controllers`)

### Responsabilidades:
- ✅ Orquestar la lógica de negocio
- ✅ Validar reglas de negocio (ej: usuario existe)
- ✅ Llamar a servicios
- ✅ Formatear respuestas HTTP
- ❌ NO accede directamente a la base de datos
- ❌ NO contiene SQL/queries

### Ejemplo: `auth.controller.ts`
```typescript
export const register = async (req: Request, res: Response) => {
  // ✅ Validación de negocio
  const userExists = await UserService.findByEmail(email);
  if (userExists) {
    return res.status(400).json({ error: 'Usuario ya existe' });
  }

  // ✅ Delega a servicio
  const user = await UserService.createUser({ name, email, password });

  // ✅ Genera token y responde
  const token = generateToken(user.id);
  res.status(201).json({ user, token });
};
```

---

## 5. Services (`/backend/src/services`)

### Responsabilidades:
- ✅ Acceso a la base de datos (Supabase)
- ✅ Queries y operaciones CRUD
- ✅ Transformación de datos
- ✅ Hasheo de contraseñas (bcrypt)
- ❌ NO contiene validaciones de input
- ❌ NO maneja respuestas HTTP

### Ejemplo: `user.service.ts`
```typescript
export class UserService {
  static async createUser(userData: CreateUserData) {
    // ✅ Hashear contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // ✅ Insertar en DB
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
```

---

## 6. Middleware (`/backend/src/middleware`)

### Tipos de Middleware:

#### `validate.middleware.ts` - Validación
```typescript
export const validate = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }
    next();
  };
};
```

#### `auth.middleware.ts` - Autenticación
```typescript
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Verifica token JWT
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  
  // Valida y decodifica
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await UserService.findById(decoded.id);
  next();
};
```

#### `rateLimiter.middleware.ts` - Rate Limiting
```typescript
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos, intenta de nuevo más tarde',
});
```

#### `errorHandler.ts` - Manejo de Errores
```typescript
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err);
  
  // Maneja diferentes tipos de errores
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Registro duplicado' });
  }
  
  res.status(500).json({ error: 'Error del servidor' });
};
```

---

## Flujo Completo de Registro

1. **Frontend** (`register/page.tsx`)
   ```
   Usuario llena formulario → Validación UX → POST /api/auth/register
   ```

2. **Route** (`auth.routes.ts`)
   ```
   POST /register → registerLimiter → validate(registerSchema) → register()
   ```

3. **Validator** (`auth.validator.ts`)
   ```
   Valida: nombre (2-50), email válido, contraseña fuerte
   ```

4. **Controller** (`auth.controller.ts`)
   ```
   - Verifica si usuario existe
   - Llama a UserService.createUser()
   - Genera JWT token
   - Retorna respuesta
   ```

5. **Service** (`user.service.ts`)
   ```
   - Hashea contraseña con bcrypt
   - INSERT en tabla users (Supabase)
   - Retorna usuario creado
   ```

6. **Database** (Supabase)
   ```
   Guarda en PostgreSQL con todas las constraints
   ```

---

## Ventajas de esta Arquitectura

### ✅ Separación de Responsabilidades
- Cada capa tiene un propósito específico
- Fácil de mantener y testear

### ✅ Reutilización
- Validadores se usan en múltiples rutas
- Servicios se llaman desde varios controladores

### ✅ Seguridad en Capas
- Rate limiting → Previene ataques
- Validación → Previene datos maliciosos
- Auth middleware → Previene acceso no autorizado

### ✅ Escalabilidad
- Fácil agregar nuevas validaciones
- Fácil cambiar de DB sin afectar controllers

### ✅ Testing
- Cada capa se puede testear independientemente
- Mock de servicios para testear controllers

---

## Ubicación de Validaciones

| Tipo de Validación | Capa | Archivo | Ejemplo |
|-------------------|------|---------|---------|
| Formato de datos | Validator | `auth.validator.ts` | Email válido, contraseña 8+ chars |
| Reglas de negocio | Controller | `auth.controller.ts` | Usuario ya existe |
| Constraints DB | Service | `user.service.ts` | Email único |
| UX básica | Frontend | `register/page.tsx` | Contraseñas coinciden |

---

## Archivos Principales

```
backend/
├── src/
│   ├── routes/
│   │   └── auth.routes.ts          # Define endpoints
│   ├── validators/
│   │   ├── auth.validator.ts       # Schemas de validación
│   │   └── user.validator.ts       
│   ├── middleware/
│   │   ├── validate.middleware.ts  # Ejecuta validaciones
│   │   ├── auth.middleware.ts      # Protege rutas
│   │   ├── rateLimiter.middleware.ts
│   │   └── errorHandler.ts         # Manejo global de errores
│   ├── controllers/
│   │   └── auth.controller.ts      # Lógica de negocio
│   ├── services/
│   │   └── user.service.ts         # Acceso a datos
│   └── config/
│       └── supabase.ts             # Conexión DB

frontend/
└── src/
    ├── app/
    │   └── register/page.tsx       # Solo UI
    ├── hooks/
    │   └── useAuth.tsx             # Estado global
    └── services/
        └── api.ts                   # Cliente HTTP
```

---

## Convenciones

### ✅ DO (Hacer):
- Validar inputs en el validator
- Validar reglas de negocio en controller
- Manejar DB en services
- Usar try-catch en controllers
- Loggear errores

### ❌ DON'T (No hacer):
- Validar en frontend como única capa
- Acceder a DB desde controllers
- Lógica de negocio en services
- Queries SQL en controllers
- Hardcodear mensajes de error

---

Esta arquitectura garantiza que cada parte del sistema tenga una responsabilidad única y bien definida, facilitando el mantenimiento, testing y escalabilidad del proyecto.
