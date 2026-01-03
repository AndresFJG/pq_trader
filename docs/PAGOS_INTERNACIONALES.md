# Sistema de Pagos Internacionales - PQ Trader

## 🌍 Configuración Stripe para Pagos Globales

### 1. Obtener Credenciales de Stripe

1. Crea una cuenta en [Stripe](https://stripe.com)
2. Ve a **Developers > API Keys**
3. Copia las claves:
   - **Publishable key** (pk_test_...) → `.env.local` en frontend
   - **Secret key** (sk_test_...) → `.env` en backend

### 2. Configurar Webhooks

1. En Stripe Dashboard: **Developers > Webhooks**
2. Clic en "Add endpoint"
3. URL: `https://tu-dominio.com/api/payments/webhook`
4. Eventos a escuchar:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Copia el **Signing secret** (whsec_...) → `.env` en backend

### 3. Habilitar Métodos de Pago Internacionales

En Stripe Dashboard > **Settings > Payment methods**, activa:

✅ **Tarjetas de crédito/débito**
- Visa, Mastercard, American Express
- Disponible globalmente

✅ **PayPal**
- Disponible en 200+ países
- No requiere configuración adicional en Stripe

✅ **Google Pay / Apple Pay**
- Se activan automáticamente con tarjetas
- Requiere dominio verificado en producción

✅ **SEPA Direct Debit** (Europa)
- Solo para países de la Eurozona
- Procesamiento en 5-7 días hábiles

✅ **Más opciones regionales:**
- **Alipay** (China)
- **WeChat Pay** (China)
- **iDEAL** (Países Bajos)
- **Sofort** (Europa)
- **Boleto** (Brasil)
- **OXXO** (México)

### 4. Configurar Múltiples Monedas

En **Settings > Business settings > Customer payments**:

1. Activa **Dynamic currency conversion**
2. Habilita las monedas que quieres soportar:
   - EUR (Euro) - Europa
   - USD (US Dollar) - Estados Unidos, LATAM
   - GBP (British Pound) - Reino Unido
   - MXN (Mexican Peso) - México
   - ARS (Argentine Peso) - Argentina
   - COP (Colombian Peso) - Colombia
   - CLP (Chilean Peso) - Chile
   - BRL (Brazilian Real) - Brasil
   - PEN (Peruvian Sol) - Perú

### 5. Variables de Entorno

#### Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_tu_clave_publica_aqui
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

#### Backend (.env):
```env
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
FRONTEND_URL=https://tu-dominio.com
CORS_ORIGIN=https://tu-dominio.com
```

### 6. Monedas Soportadas Actualmente

| Moneda | Código | Países Principales |
|--------|--------|-------------------|
| Euro | EUR | España, Francia, Alemania, Italia |
| US Dollar | USD | USA, Ecuador, El Salvador |
| British Pound | GBP | Reino Unido |
| Mexican Peso | MXN | México |
| Argentine Peso | ARS | Argentina |
| Colombian Peso | COP | Colombia |
| Chilean Peso | CLP | Chile |

### 7. Métodos de Pago por Región

#### 🇪🇺 Europa:
- Tarjetas (Visa, Mastercard, Amex)
- SEPA Direct Debit
- Apple Pay / Google Pay
- iDEAL (Países Bajos)
- Sofort (Alemania, Austria)

#### 🇺🇸 Estados Unidos:
- Tarjetas (Visa, Mastercard, Amex, Discover)
- PayPal
- Apple Pay / Google Pay
- ACH Direct Debit

#### 🇲🇽 México:
- Tarjetas
- PayPal
- OXXO (efectivo)
- SPEI (transferencia)

#### 🇦🇷 Argentina:
- Tarjetas
- PayPal
- Mercado Pago (próximamente)

#### 🇧🇷 Brasil:
- Tarjetas
- PayPal
- Boleto Bancário
- PIX (próximamente)

#### 🇨🇳 China:
- Alipay
- WeChat Pay
- Union Pay

### 8. Comisiones de Stripe

#### Tarjetas Internacionales:
- **Tarjetas europeas:** 1.4% + 0.25€
- **Tarjetas no europeas:** 2.9% + 0.25€
- **PayPal:** 3.4% + 0.35€
- **SEPA:** 0.35€ por transacción

#### Conversión de Moneda:
- **Fee adicional:** +1% sobre el tipo de cambio

### 9. Testing

#### Tarjetas de Prueba:
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
Amex: 3782 822463 10005

Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos
```

#### Probar diferentes regiones:
- Cambia el país en el formulario
- El método de pago se adaptará automáticamente

### 10. Producción

#### Checklist antes de lanzar:

- [ ] Cambiar claves de test (pk_test_, sk_test_) por claves live (pk_live_, sk_live_)
- [ ] Configurar webhook en producción
- [ ] Verificar dominio para Apple Pay/Google Pay
- [ ] Activar 3D Secure (SCA) para Europa
- [ ] Configurar emails de confirmación
- [ ] Probar con tarjetas reales en modo test
- [ ] Revisar políticas de reembolso
- [ ] Configurar dashboard de analytics

### 11. Seguridad

✅ **Implementado:**
- SSL/TLS encryption
- PCI DSS Level 1 compliance (vía Stripe)
- Tokenización de tarjetas
- 3D Secure / SCA
- Detección de fraude automática
- Rate limiting

### 12. Soporte Multi-región

El sistema detecta automáticamente:
- 🌍 País del usuario
- 💱 Moneda preferida
- 💳 Métodos de pago disponibles
- 🏦 Regulaciones locales (SCA, PSD2, etc.)

### 13. Contacto y Ayuda

Para problemas con pagos:
- **Email:** soporte@pqtrader.com
- **Docs Stripe:** https://stripe.com/docs
- **Status Stripe:** https://status.stripe.com

---

## 🚀 ¡Listo para Recibir Pagos Globalmente!

Tu plataforma ahora puede aceptar pagos de cualquier parte del mundo con las mejores tasas de conversión y experiencia de usuario.
