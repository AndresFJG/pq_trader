# 🔑 Obtener Credenciales de PayPal Sandbox

## ⚠️ Error Actual
```
invalid_client - Client Authentication failed
```

Esto significa que las credenciales de PayPal en tu `.env` no son válidas.

---

## 📋 Cómo Obtener Credenciales Reales (5 minutos)

### Paso 1: Acceder al PayPal Developer Dashboard

1. Ve a: https://developer.paypal.com/dashboard/
2. Inicia sesión con tu cuenta de PayPal
3. Si no tienes cuenta, créala (es gratis)

### Paso 2: Crear App de Sandbox

1. En el menú lateral, click en **"Apps & Credentials"**
2. Asegúrate de estar en la pestaña **"Sandbox"** (arriba)
3. Click en **"Create App"** (botón azul)

4. Completa el formulario:
   ```
   App Name: PQ Trader Test
   Sandbox Business Account: (selecciona o crea una)
   App Type: Merchant
   ```

5. Click **"Create App"**

### Paso 3: Copiar Credenciales

Verás una pantalla con tus credenciales:

```
Client ID: AabcDef123456...  (string largo)
Secret: EfgHij789012...      (string largo)
```

**IMPORTANTE:** 
- Estas son tus credenciales **reales de sandbox**
- NO son las credenciales de ejemplo que tienes ahora

### Paso 4: Actualizar .env

Abre tu archivo `.env` y reemplaza:

```bash
# PayPal Configuration (Sandbox)
PAYPAL_CLIENT_ID=TU_CLIENT_ID_REAL_AQUI
PAYPAL_CLIENT_SECRET=TU_SECRET_REAL_AQUI
PAYPAL_MODE=sandbox
```

---

## 🧪 Paso 5: Reiniciar Backend

```bash
# En terminal backend
# El servidor se reiniciará automáticamente con nodemon
```

---

## 🎯 Paso 6: Probar PayPal

1. Ve a tu frontend: http://localhost:3000
2. Intenta comprar un curso con PayPal
3. Deberías ser redirigido al sandbox de PayPal

---

## 💳 Cuentas de Prueba de PayPal Sandbox

PayPal automáticamente crea cuentas de prueba para ti:

### Ver Cuentas de Prueba:

1. En PayPal Developer Dashboard
2. Click en **"Sandbox"** → **"Accounts"** (menú lateral)
3. Verás dos cuentas:
   - **Business Account** (vendedor) - Ya configurada
   - **Personal Account** (comprador) - Para probar compras

### Usar Cuenta de Comprador:

Cuando pruebes un pago:
1. Serás redirigido al sandbox de PayPal
2. Inicia sesión con la **Personal Account**
3. Email: `sb-xxxxx@personal.example.com`
4. Password: (click en "···" para ver la password)

---

## 📸 Capturas de Referencia

### Dónde encontrar Client ID y Secret:

```
PayPal Developer Dashboard
  └─ Apps & Credentials
      └─ Sandbox (tab)
          └─ [Tu App]
              ├─ Client ID: Abc123...
              └─ Secret: (click "Show" para ver)
```

---

## ✅ Verificación

Después de actualizar las credenciales, deberías ver en los logs:

```bash
✅ PayPal configured in sandbox mode
```

Y al probar un pago:

```bash
✅ PayPal access token obtained
✅ PayPal order created successfully
```

---

## 🔧 Troubleshooting

### Error persiste después de actualizar credenciales

1. **Verifica que copiaste las credenciales completas**
   - Client ID suele tener ~80 caracteres
   - Secret suele tener ~80 caracteres

2. **Asegúrate de estar en modo Sandbox**
   ```bash
   PAYPAL_MODE=sandbox
   ```

3. **Reinicia el backend manualmente**
   ```bash
   Ctrl+C
   npm run dev
   ```

4. **Verifica que no haya espacios extra**
   ```bash
   # MAL (con espacios)
   PAYPAL_CLIENT_ID= AabcDef123...
   
   # BIEN (sin espacios)
   PAYPAL_CLIENT_ID=AabcDef123...
   ```

### No puedo acceder al Developer Dashboard

- Asegúrate de tener una cuenta de PayPal verificada
- Usa el mismo email con el que te registraste en PayPal

### La app no aparece en Apps & Credentials

- Verifica que estés en la pestaña **"Sandbox"** (no "Live")
- Espera unos segundos después de crear la app

---

## 🚀 Siguientes Pasos

Una vez que tengas PayPal funcionando en **Sandbox**:

### Para Producción (cuando estés listo):

1. Ve a la pestaña **"Live"** en PayPal Developer
2. Crea una nueva app (igual que en Sandbox)
3. Actualiza tu `.env` de producción con las credenciales de **Live**
4. Cambia `PAYPAL_MODE=live`

---

## 📚 Recursos Adicionales

- **PayPal Developer Docs:** https://developer.paypal.com/docs/
- **PayPal Sandbox Guide:** https://developer.paypal.com/tools/sandbox/
- **Testing Guide:** https://developer.paypal.com/api/rest/sandbox/

---

## ⚡ Resumen Rápido

```bash
# 1. Ir a: https://developer.paypal.com/dashboard/
# 2. Apps & Credentials → Sandbox → Create App
# 3. Copiar Client ID y Secret
# 4. Pegar en .env:

PAYPAL_CLIENT_ID=TU_CLIENT_ID_AQUI
PAYPAL_CLIENT_SECRET=TU_SECRET_AQUI
PAYPAL_MODE=sandbox

# 5. Reiniciar backend (se hace automáticamente con nodemon)
# 6. Probar compra desde el frontend
```

**¡Actualiza las credenciales y avísame cuando las tengas listas!** 🎉
