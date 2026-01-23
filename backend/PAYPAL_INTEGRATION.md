# Integración de PayPal con el Catálogo de Precios

## ✅ Estado Actual

PayPal está **completamente integrado** con el sistema centralizado de precios. Todos los productos tienen precios predefinidos y validados.

## 📋 Catálogo de Productos

### Cursos
- `course-python-trading` - €299
- `course-strategyquant` - €249
- `course-risk-management` - €199
- `course-technical-analysis` - €399
- `course-bundle-3` - €599

### Mentorías
- `mentorship-individual` - €70
- `mentorship-pack-5` - €320
- `mentorship-premium-club` - €400/mes

### Clubes y Suscripciones
- `club-strategyquant-monthly` - €150/mes
- `subscription-total-access` - €997/año

### Alquiler de Estrategias
- `strategy-individual-monthly` - €50/mes
- `strategy-individual-quarterly` - €130/3 meses
- `strategy-individual-semiannual` - €250/6 meses
- `strategy-portfolio-monthly` - €120/mes
- `strategy-portfolio-quarterly` - €320/3 meses
- `strategy-portfolio-semiannual` - €600/6 meses
- `strategy-darwinex-monthly` - €200/mes

## 🔧 Cómo Usar desde el Frontend

### Opción 1: Pago con Producto ID (RECOMENDADO)

```typescript
// Ejemplo: Comprar curso de Python
const response = await fetch(`${API_URL}/api/paypal/order`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    productId: 'course-python-trading', // ID del producto
    currency: 'EUR' // Opcional, por defecto EUR
  })
});

const data = await response.json();
// Redirigir al usuario a: data.data.approvalUrl
window.location.href = data.data.approvalUrl;
```

### Opción 2: Pago con Monto Personalizado

```typescript
// Para casos especiales (donaciones, pagos custom)
const response = await fetch(`${API_URL}/api/paypal/order`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    customAmount: 150.00,
    productName: 'Consultoría Especial',
    currency: 'EUR'
  })
});
```

## 🌍 Conversión de Monedas

El backend convierte automáticamente de EUR a otras monedas:

```typescript
// Frontend solicita en USD
{
  productId: 'course-python-trading', // €299 en EUR
  currency: 'USD' // Backend convierte a ~$326
}
```

**Tasas de cambio configuradas:**
- EUR: 1.00 (base)
- USD: 1.09
- GBP: 0.86
- MXN: 18.50
- BRL: 5.40
- ARS: 900.00
- COP: 4300.00

## 📝 Actualizar CheckoutForm

Modifica `frontend/src/components/checkout/CheckoutForm.tsx`:

```typescript
// ANTES (envía monto manualmente)
body: JSON.stringify({
  amount: Math.round(getConvertedPrice() * 100),
  currency: selectedCurrency,
  // ...
})

// DESPUÉS (envía productId)
body: JSON.stringify({
  productId: productId, // Ya está disponible en props
  currency: selectedCurrency,
})
```

## ✅ Ventajas de esta Integración

1. **Precios centralizados**: Un solo lugar para actualizar precios
2. **Validación automática**: Backend verifica que el precio sea correcto
3. **Conversión de monedas**: Automática según el catálogo
4. **Trazabilidad**: Logs detallados de cada transacción
5. **Anti-fraude**: No se pueden manipular precios desde el frontend
6. **Mantenibilidad**: Fácil agregar nuevos productos

## 🔒 Seguridad

- El frontend **solo envía el ID del producto**
- El backend **calcula el precio final** desde el catálogo
- **Imposible** manipular precios desde el cliente
- Validación con Joi en todas las solicitudes

## 📊 Ejemplo Completo

```typescript
// En CheckoutForm.tsx
const handlePayPalPayment = async () => {
  try {
    setLoading(true);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paypal/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        productId: productId, // 'course-python-trading'
        currency: selectedCurrency, // 'USD'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Redirigir a PayPal para aprobar el pago
      window.location.href = result.data.approvalUrl;
    } else {
      setError(result.error);
    }
  } catch (error) {
    console.error('PayPal payment error:', error);
    setError('Error al procesar el pago');
  } finally {
    setLoading(false);
  }
};
```

## 🎯 Próximos Pasos

1. ✅ Catálogo de precios creado
2. ✅ Backend actualizado con validación
3. ✅ Servicio PayPal real implementado
4. ⏳ Actualizar frontend para usar productId
5. ⏳ Implementar flujo de captura después de aprobación
6. ⏳ Actualizar suscripción del usuario en base de datos

---

**Nota**: Los precios en el catálogo están en EUR. El sistema convierte automáticamente a otras monedas cuando el usuario selecciona una diferente.
