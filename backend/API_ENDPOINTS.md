# API Endpoints - PQ Trader Backend

## 🔐 Autenticación

### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Respuesta (201)**:
```json
{
  "success": true,
  "message": "Usuario registrado. Por favor verifica tu email.",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "isEmailVerified": false
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Respuesta (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "isEmailVerified": true,
      "subscriptionTier": "free",
      "subscriptionStatus": "inactive"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Verificar Email
```http
GET /api/auth/verify-email/:token
```

### Recuperar Contraseña
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "juan@example.com"
}
```

### Restablecer Contraseña
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "NewPassword123"
}
```

### Obtener Usuario Actual
```http
GET /api/auth/me
Authorization: Bearer {access_token}
```

### Actualizar Perfil
```http
PUT /api/auth/update-profile
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "email": "juanc@example.com"
}
```

### Cambiar Contraseña
```http
PUT /api/auth/change-password
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer {access_token}
```

### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

## 💳 Stripe

### Crear Customer
```http
POST /api/stripe/customer
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "email": "juan@example.com",
  "name": "Juan Pérez"
}
```

### Crear Suscripción
```http
POST /api/stripe/subscription
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "priceId": "price_1234567890"
}
```

**Respuesta (201)**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_1234567890",
    "clientSecret": "pi_xxx_secret_xxx",
    "status": "incomplete"
  }
}
```

### Crear Payment Intent (Pago Único)
```http
POST /api/stripe/payment-intent
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "amount": 99.99,
  "currency": "usd",
  "metadata": {
    "plan": "pro",
    "description": "Plan Pro - Mensual"
  }
}
```

### Cancelar Suscripción
```http
POST /api/stripe/subscription/cancel
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "immediately": false
}
```

### Reactivar Suscripción
```http
POST /api/stripe/subscription/reactivate
Authorization: Bearer {access_token}
```

### Crear Checkout Session
```http
POST /api/stripe/checkout-session
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "priceId": "price_1234567890",
  "successUrl": "https://pqtrader.com/success",
  "cancelUrl": "https://pqtrader.com/canceled"
}
```

**Respuesta (201)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_xxx",
    "url": "https://checkout.stripe.com/xxx"
  }
}
```

### Crear Billing Portal
```http
POST /api/stripe/billing-portal
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "returnUrl": "https://pqtrader.com/dashboard"
}
```

### Webhook de Stripe
```http
POST /api/stripe/webhook
Stripe-Signature: signature_here
Content-Type: application/json

{
  "type": "customer.subscription.updated",
  "data": { ... }
}
```

## 💰 PayPal

### Crear Orden
```http
POST /api/paypal/order
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "amount": 99.99,
  "currency": "USD",
  "plan": "pro"
}
```

**Respuesta (201)**:
```json
{
  "success": true,
  "data": {
    "orderId": "order_id_xxx",
    "status": "CREATED"
  }
}
```

### Capturar Orden
```http
POST /api/paypal/order/:orderId/capture
Authorization: Bearer {access_token}
```

### Obtener Detalles de Orden
```http
GET /api/paypal/order/:orderId
Authorization: Bearer {access_token}
```

### Reembolsar Pago (Admin)
```http
POST /api/paypal/refund/:captureId
Authorization: Bearer {admin_access_token}
Content-Type: application/json

{
  "amount": 50.00,
  "currency": "USD"
}
```

### Webhook de PayPal
```http
POST /api/paypal/webhook
Content-Type: application/json

{
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": { ... }
}
```

## 🏥 Health Check

### Verificar Estado del Servidor
```http
GET /health
```

**Respuesta (200)**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

---

## 📝 Notas de Seguridad

### Rate Limits
- **API General**: 100 req/15min
- **Auth (login)**: 5 req/15min
- **Registro**: 3 req/hora
- **Pagos**: 10 req/hora
- **Webhooks**: 100 req/min
- **Password Reset**: 3 req/hora

### Headers Requeridos
- **Authorization**: `Bearer {access_token}` (rutas protegidas)
- **Content-Type**: `application/json` (POST/PUT/PATCH)
- **Stripe-Signature**: Requerido para webhooks de Stripe

### Validaciones de Contraseña
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número

### Códigos de Error Comunes
- **400**: Bad Request (validación fallida)
- **401**: Unauthorized (sin token o token inválido)
- **403**: Forbidden (sin permisos)
- **404**: Not Found
- **423**: Locked (cuenta bloqueada por intentos fallidos)
- **429**: Too Many Requests (rate limit excedido)
- **500**: Internal Server Error

---

## 🧪 Testing con Thunder Client / Postman

### Variables de Entorno
```
baseUrl=http://localhost:4000
accessToken=your_jwt_token_here
refreshToken=your_refresh_token_here
```

### Secuencia de Testing Recomendada

1. **Health Check** → Verificar que el servidor está corriendo
2. **Register** → Crear usuario
3. **Login** → Obtener tokens
4. **Get Me** → Verificar autenticación
5. **Crear Suscripción Stripe** → Probar pagos
6. **Cancelar Suscripción** → Probar cancelación
7. **Logout** → Limpiar sesión

### Ejemplo de Colección Postman

```json
{
  "info": {
    "name": "PQ Trader API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [...]
    },
    {
      "name": "Stripe",
      "item": [...]
    },
    {
      "name": "PayPal",
      "item": [...]
    }
  ]
}
```

---

**Última actualización**: 18 de Enero de 2026
