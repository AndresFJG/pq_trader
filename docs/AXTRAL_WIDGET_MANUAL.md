# Manual de Uso - AxtralWidget

## 📋 Descripción General

El **AxtralWidget** es un componente de terceros desarrollado por AxtralQuant que permite integrar herramientas de trading cuantitativo directamente en la plataforma PQ Traders. Proporciona acceso a análisis técnico, desarrollo de estrategias y otras funcionalidades cuantitativas.

## 🔧 Componentes del Sistema

### Archivos Involucrados

1. **`frontend/src/components/widgets/AxtralWidget.tsx`**
   - Componente principal del widget
   - Maneja la carga del script externo
   - Configura la inicialización del widget
   - Gestiona estados de carga y errores

2. **`frontend/src/app/page.tsx`**
   - Importa y renderiza el widget en la página principal
   - Ubicado entre TrackRecords y Darwinex sections

## 📦 Estructura del Componente

### Código Completo

```tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export function AxtralWidget() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkWidget = () => {
      if (typeof (window as any).AxtralWidget !== 'undefined') {
        try {
          console.log('✅ AxtralWidget encontrado, inicializando...');
          (window as any).AxtralWidget.init({
            container: 'axtral-widget',
            partnerId: 'DEMO_PARTNER_123',
            partnerName: 'PQ Traders',
            width: '100%',
            height: '800px',
            theme: {
              logoUrl: 'https://pqtraders.com/icon.svg',
              primaryColor: '#4AA3F0',
              secondaryColor: '#60A5FA',
              backgroundColor: '#0B1520'
            },
            features: {
              showBranding: false
            }
          });
          setIsLoaded(true);
          console.log('✅ Widget inicializado correctamente');
        } catch (err: any) {
          console.error('❌ Error al inicializar widget:', err);
          setError(err.message);
        }
      } else {
        console.log('⏳ AxtralWidget no disponible aún, reintentando...');
        setTimeout(checkWidget, 500);
      }
    };

    const timer = setTimeout(checkWidget, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script 
        src="https://axtralquant.com/widget.js" 
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ Script widget.js cargado');
        }}
        onError={(e) => {
          console.error('❌ Error cargando widget.js:', e);
          setError('No se pudo cargar el widget');
        }}
      />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Herramientas de <span className="text-profit">Trading Cuantitativo</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Explora las mejores herramientas para análisis y desarrollo de estrategias
            </p>
          </div>
          
          <div id="axtral-widget" className="w-full min-h-[800px]"></div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-center">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}
          
          {!isLoaded && !error && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-profit mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando widget...</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
```

## ⚙️ Configuración del Widget

### Parámetros de Inicialización

#### 1. **`container`** (string, requerido)
- **Valor:** `'axtral-widget'`
- **Descripción:** ID del div HTML donde se renderizará el widget
- **Uso:** Debe coincidir con el `id` del div contenedor

#### 2. **`partnerId`** (string, requerido)
- **Valor:** `'DEMO_PARTNER_123'`
- **Descripción:** Identificador único del socio/partner
- **IMPORTANTE:** Cambiar por el ID real proporcionado por AxtralQuant en producción

#### 3. **`partnerName`** (string, requerido)
- **Valor:** `'PQ Traders'`
- **Descripción:** Nombre de la empresa/plataforma
- **Uso:** Se muestra dentro del widget para branding

#### 4. **`width`** (string)
- **Valor:** `'100%'`
- **Descripción:** Ancho del widget
- **Opciones:** Porcentaje ('100%'), píxeles ('800px'), 'auto'

#### 5. **`height`** (string)
- **Valor:** `'800px'`
- **Descripción:** Alto del widget
- **Recomendación:** Mínimo 600px para visualización correcta

### Configuración del Theme

```typescript
theme: {
  logoUrl: 'https://pqtraders.com/icon.svg',      // Logo de PQ Traders
  primaryColor: '#4AA3F0',                         // Color principal (azul)
  secondaryColor: '#60A5FA',                       // Color secundario (azul claro)
  backgroundColor: '#0B1520'                       // Fondo oscuro
}
```

**Paleta de Colores PQ Traders:**
- Primary: `#4AA3F0` - Azul principal
- Secondary: `#60A5FA` - Azul claro
- Profit: `#00C853` - Verde (ganancias)
- Loss: `#FF3B30` - Rojo (pérdidas)
- Background: `#0B1520` - Fondo oscuro

### Configuración de Features

```typescript
features: {
  showBranding: false    // Oculta el branding de AxtralQuant
}
```

## 🔄 Flujo de Carga

### 1. Carga del Script

```tsx
<Script 
  src="https://axtralquant.com/widget.js" 
  strategy="afterInteractive"
  onLoad={handleLoad}
  onError={handleError}
/>
```

- **Strategy:** `afterInteractive` - Carga después de que la página sea interactiva
- **URL:** `https://axtralquant.com/widget.js` (script principal)
- **Eventos:** `onLoad` y `onError` para tracking

### 2. Inicialización del Widget

```typescript
const checkWidget = () => {
  if (typeof (window as any).AxtralWidget !== 'undefined') {
    (window as any).AxtralWidget.init({ /* config */ });
    setIsLoaded(true);
  } else {
    setTimeout(checkWidget, 500); // Reintenta cada 500ms
  }
};
```

- **Espera:** 1000ms iniciales antes del primer check
- **Retry:** Cada 500ms si el objeto no está disponible
- **Timeout:** No hay timeout máximo (reintentos indefinidos)

### 3. Estados del Componente

1. **Loading:** Spinner animado mientras carga
2. **Loaded:** Widget renderizado correctamente
3. **Error:** Mensaje de error si falla la carga

## 📊 Manejo de Estados

### Estados de React

```typescript
const [isLoaded, setIsLoaded] = useState(false);   // Widget inicializado
const [error, setError] = useState<string | null>(null);  // Error de carga
```

### Estados Visuales

#### Estado: Loading
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-profit">
  <p>Cargando widget...</p>
</div>
```

#### Estado: Error
```tsx
<div className="bg-red-500/10 border border-red-500">
  <p className="text-red-500">Error: {error}</p>
</div>
```

#### Estado: Loaded
```tsx
<div id="axtral-widget" className="w-full min-h-[800px]"></div>
```

## 🎯 Integración en la Página

### Ubicación en HomePage

```tsx
export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Courses />
      <TrackRecords />
      <AxtralWidget />    // ← Aquí se renderiza
      <Darwinex />
      <CTA />
      <Footer />
    </main>
  );
}
```

### Orden de Secciones
1. Hero (Banner principal)
2. Features (Características)
3. Courses (Cursos)
4. TrackRecords (Track records)
5. **AxtralWidget** ← Widget de herramientas
6. Darwinex (Información Darwinex)
7. CTA (Call to action)
8. Footer

## 🚀 Cómo Activar/Desactivar

### Para ACTIVAR el widget:

1. Importar en la página:
```tsx
import { AxtralWidget } from '@/components/widgets/AxtralWidget';
```

2. Renderizar en el JSX:
```tsx
<AxtralWidget />
```

### Para DESACTIVAR el widget:

1. Eliminar la importación:
```tsx
// import { AxtralWidget } from '@/components/widgets/AxtralWidget';
```

2. Eliminar el renderizado:
```tsx
// <AxtralWidget />
```

## 🐛 Debugging y Logs

### Logs de Consola

El widget emite varios logs para debugging:

```javascript
// ✅ Logs de éxito
✅ Script widget.js cargado
✅ AxtralWidget encontrado, inicializando...
✅ Widget inicializado correctamente

// ⏳ Logs de proceso
⏳ AxtralWidget no disponible aún, reintentando...

// ❌ Logs de error
❌ Error cargando widget.js: [error]
❌ Error al inicializar widget: [error]
```

### Problemas Comunes

#### 1. Widget no carga (pantalla de loading infinita)

**Causa:** Script externo bloqueado o no disponible

**Solución:**
- Verificar que `https://axtralquant.com/widget.js` sea accesible
- Revisar bloqueadores de contenido (AdBlock, uBlock)
- Verificar CORS en el navegador
- Comprobar firewall/proxy corporativo

#### 2. Error de inicialización

**Causa:** Configuración incorrecta o partnerId inválido

**Solución:**
- Verificar que `partnerId` sea válido
- Contactar con AxtralQuant para validar credenciales
- Revisar parámetros de configuración

#### 3. Widget se renderiza pero está vacío

**Causa:** Contenedor con tamaño incorrecto o API Key inválida

**Solución:**
- Verificar que el div tenga `min-h-[800px]`
- Comprobar theme y configuración de features
- Validar API credentials con AxtralQuant

## 🔐 Consideraciones de Seguridad

### 1. Script Externo
- **Origen:** `https://axtralquant.com/widget.js`
- **Confianza:** Terceros (AxtralQuant)
- **Recomendación:** Validar integridad con Subresource Integrity (SRI) si está disponible

### 2. API Keys
```typescript
partnerId: 'DEMO_PARTNER_123'  // ⚠️ CAMBIAR EN PRODUCCIÓN
```

**IMPORTANTE:**
- El `partnerId` actual es de DEMO
- En producción, usar el ID real proporcionado por AxtralQuant
- No commitear API Keys reales en el repositorio
- Usar variables de entorno si es posible

### 3. Variables de Entorno (Recomendación)

```typescript
// .env.local
NEXT_PUBLIC_AXTRAL_PARTNER_ID=tu_partner_id_real

// AxtralWidget.tsx
partnerId: process.env.NEXT_PUBLIC_AXTRAL_PARTNER_ID || 'DEMO_PARTNER_123'
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile (< 768px) */
min-h-[400px]  /* Altura mínima reducida */

/* Tablet (768px - 1024px) */
min-h-[600px]

/* Desktop (> 1024px) */
min-h-[800px]  /* Altura completa */
```

### Contenedor Responsive

```tsx
<div className="container mx-auto max-w-6xl">
  {/* Widget responsive */}
</div>
```

## 🎨 Personalización

### Cambiar Colores

```typescript
theme: {
  primaryColor: '#TU_COLOR',      // Color principal
  secondaryColor: '#TU_COLOR',    // Color secundario
  backgroundColor: '#TU_COLOR'    // Fondo del widget
}
```

### Cambiar Tamaño

```typescript
width: '100%',      // O '800px', '80vw', etc.
height: '600px'     // Ajustar según necesidades
```

### Mostrar/Ocultar Branding

```typescript
features: {
  showBranding: true    // Muestra branding de AxtralQuant
}
```

## 📝 Notas Adicionales

### Performance
- Script cargado con `strategy="afterInteractive"` para no bloquear renderizado inicial
- Retry logic para manejar cargas lentas
- No afecta el First Contentful Paint (FCP)

### Compatibilidad
- Requiere JavaScript habilitado
- Compatible con Next.js 14+ (App Router)
- Funciona en todos los navegadores modernos

### Alternativas
Si el widget de AxtralQuant no cumple los requisitos, considerar:
- TradingView widgets
- Desarrollo de widget propio
- Integración con otras plataformas cuantitativas

## 📞 Soporte

### Contacto AxtralQuant
Para problemas técnicos o cambio de configuración:
- Website: https://axtralquant.com
- Contactar con el equipo de soporte de AxtralQuant

### Mantenimiento Interno
Para modificaciones del componente:
1. Editar `frontend/src/components/widgets/AxtralWidget.tsx`
2. Probar en desarrollo
3. Verificar logs en consola
4. Deploy a producción

---

**Última actualización:** Febrero 2026  
**Versión del componente:** 1.0.0  
**Estado:** Documentado y listo para remoción/reactivación
