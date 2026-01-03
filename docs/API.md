# Documentación de API - PQ Trader

## Base URL

```
Desarrollo: http://localhost:4000/api
Producción: https://api.pqtrader.com/api
```

## Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Incluye el token en el header Authorization:

```
Authorization: Bearer {token}
```

---

## Endpoints

### Autenticación

#### Registrar Usuario

```http
POST /auth/register
```

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Iniciar Sesión

```http
POST /auth/login
```

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

#### Obtener Usuario Actual

```http
GET /auth/me
```

**Headers:** `Authorization: Bearer {token}`

#### Refrescar Token

```http
POST /auth/refresh
```

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

---

### Cursos

#### Listar Cursos

```http
GET /courses
```

**Query Parameters:**
- `level`: beginner | intermediate | advanced
- `sort`: -createdAt | price | -rating

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "...",
      "title": "Trading Algorítmico con Python",
      "description": "...",
      "price": 299,
      "duration": 40,
      "level": "beginner",
      "rating": 4.8,
      "enrolled": 245
    }
  ]
}
```

#### Obtener Curso

```http
GET /courses/:id
```

#### Crear Curso

```http
POST /courses
```

**Headers:** `Authorization: Bearer {token}` (Admin/Mentor only)

**Body:**
```json
{
  "title": "Nuevo Curso",
  "description": "Descripción del curso",
  "price": 299,
  "duration": 40,
  "level": "beginner",
  "topics": ["Python", "Backtesting", "Estrategias"]
}
```

#### Actualizar Curso

```http
PUT /courses/:id
```

**Headers:** `Authorization: Bearer {token}` (Admin/Mentor only)

#### Eliminar Curso

```http
DELETE /courses/:id
```

**Headers:** `Authorization: Bearer {token}` (Admin only)

#### Inscribirse en Curso

```http
POST /courses/:id/enroll
```

**Headers:** `Authorization: Bearer {token}`

---

### Mentorías

#### Listar Mentorías

```http
GET /mentorships
```

#### Reservar Mentoría

```http
POST /mentorships/book
```

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "mentorshipId": "...",
  "timeSlot": {
    "startTime": "2025-01-15T10:00:00Z",
    "endTime": "2025-01-15T11:00:00Z"
  },
  "notes": "Necesito ayuda con estrategias de momentum"
}
```

#### Mis Reservas

```http
GET /mentorships/my-bookings
```

**Headers:** `Authorization: Bearer {token}`

---

### Pagos

#### Crear Suscripción

```http
POST /payments/create-subscription
```

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "priceId": "price_monthly_subscription_id",
  "paymentMethodId": "pm_..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_...",
    "clientSecret": "pi_...secret",
    "status": "active"
  }
}
```

#### Cancelar Suscripción

```http
POST /payments/cancel-subscription
```

**Headers:** `Authorization: Bearer {token}`

#### Historial de Pagos

```http
GET /payments/history
```

**Headers:** `Authorization: Bearer {token}`

#### Webhook de Stripe

```http
POST /payments/webhook
```

**Headers:** `stripe-signature: {signature}`

---

### Darwinex

#### Obtener Portafolios

```http
GET /darwinex/portfolios
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "PQT.Alpha",
      "return": 24.5,
      "drawdown": -8.2,
      "sharpeRatio": 2.45,
      "winRate": 68.4,
      "trades": 342
    }
  ]
}
```

#### Obtener Performance

```http
GET /darwinex/performance/:darwinName
```

#### Obtener Estadísticas

```http
GET /darwinex/stats
```

---

## Códigos de Error

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- **General:** 100 requests por 15 minutos
- **Login:** 5 intentos por 15 minutos
- **Registro:** 3 registros por hora
- **Pagos:** 10 transacciones por hora

## Ejemplos de Uso

### JavaScript/Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Login
const login = async () => {
  const response = await api.post('/auth/login', {
    email: 'user@example.com',
    password: 'password123',
  });
  
  const { token } = response.data.data;
  
  // Set token for future requests
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Get courses
const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data.data;
};
```

### cURL

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get courses with auth
curl http://localhost:4000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

Para más información, contacta a dev@pqtrader.com
