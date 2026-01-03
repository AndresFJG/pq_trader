# SEO Implementation Guide - PQ Trader

## ✅ Implementaciones Completadas

### 1. **Metadata en Todas las Páginas**
- ✅ Layout principal con Open Graph y Twitter Cards
- ✅ Página principal (Home)
- ✅ Página de Cursos con keywords específicos
- ✅ Página de Mentorías con keywords de asesoría
- ✅ Página de Portafolios con keywords de venta/alquiler
- ✅ Página de Blog con keywords de contenido

### 2. **Archivos SEO Técnicos**
- ✅ `sitemap.ts` - Genera sitemap.xml automáticamente
- ✅ `robots.ts` - Controla el crawling de bots
- ✅ `seo.tsx` - Librería para Structured Data (JSON-LD)

### 3. **Structured Data (Schema.org)**
- ✅ Organization Schema
- ✅ Product Schema
- ✅ Course Schema  
- ✅ Breadcrumb Schema
- ✅ Integrado en página principal

---

## 🔧 Tareas Pendientes (Completar Manualmente)

### 1. **Google Search Console**
```
1. Ir a: https://search.google.com/search-console
2. Agregar propiedad: pqtrader.com
3. Verificar dominio con DNS o HTML tag
4. Copiar el código de verificación
5. Pegar en: frontend/src/app/layout.tsx
   Línea 73: google: 'tu-codigo-aqui'
```

### 2. **Crear Imágenes Open Graph**
Dimensiones: 1200x630px
```
Crear en Canva o Figma:
- /public/og-image.jpg (Home)
- /public/og-cursos.jpg (Cursos)
- /public/og-mentorias.jpg (Mentorías)
- /public/og-portafolios.jpg (Portafolios)
- /public/og-blog.jpg (Blog)
- /public/logo.png (Logo para Schema)
```

### 3. **Actualizar Redes Sociales**
En `frontend/src/lib/seo.tsx` línea 50:
```typescript
sameAs: [
  'https://twitter.com/tu-handle',      // ← Actualizar
  'https://linkedin.com/company/...',   // ← Actualizar
  'https://instagram.com/...',          // ← Actualizar
  'https://youtube.com/@...',           // ← Actualizar
],
```

### 4. **Configurar Google Analytics**
```html
<!-- Agregar en frontend/src/app/layout.tsx antes de </body> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 5. **Crear favicon.ico**
```
1. Diseñar favicon 32x32px
2. Generar en: https://favicon.io
3. Guardar en: /public/favicon.ico
4. Guardar apple-touch-icon.png (180x180px)
```

### 6. **Actualizar URL Base**
Cambiar en múltiples archivos cuando tengas dominio real:
- `frontend/src/app/layout.tsx` línea 9
- `frontend/src/app/sitemap.ts` línea 4
- `frontend/src/app/robots.ts` línea 23
- `frontend/src/lib/seo.tsx` línea 48

---

## 📊 Testing SEO

### Herramientas para Probar:
1. **Google Rich Results Test**
   https://search.google.com/test/rich-results
   - Pegar URL de tu sitio
   - Verificar structured data

2. **Open Graph Debugger**
   https://www.opengraph.xyz
   - Ver preview de redes sociales

3. **PageSpeed Insights**
   https://pagespeed.web.dev
   - Verificar performance

4. **Schema Markup Validator**
   https://validator.schema.org
   - Validar JSON-LD

---

## 🚀 Próximos Pasos SEO

### Contenido
- [ ] Escribir 10 artículos de blog (500+ palabras c/u)
- [ ] Agregar FAQs con Schema FAQ
- [ ] Crear videos para YouTube (embeds)
- [ ] Testimonios de alumnos con Schema Review

### Technical SEO
- [ ] Comprimir imágenes (WebP format)
- [ ] Lazy loading de imágenes
- [ ] Preload fonts críticos
- [ ] Minificar CSS/JS

### Link Building
- [ ] Guest posts en blogs de trading
- [ ] Directorio de cursos online
- [ ] Colaboraciones con influencers
- [ ] Press releases

---

## 📈 KPIs a Monitorear

```
Objetivo Mes 1:
- 100 visitas orgánicas
- 5 keywords en top 20 Google
- 50 suscriptores newsletter

Objetivo Mes 3:
- 500 visitas orgánicas
- 20 keywords en top 20
- 200 suscriptores

Objetivo Mes 6:
- 2000 visitas orgánicas
- 50 keywords en top 10
- 1000 suscriptores
```

---

## 🔍 Keywords Target (Principal)

### Alta Prioridad
1. **trading algorítmico** (1,600 búsquedas/mes)
2. **cursos de trading** (8,100 búsquedas/mes)
3. **mentoría trading** (590 búsquedas/mes)
4. **robots de trading** (1,300 búsquedas/mes)
5. **python trading** (880 búsquedas/mes)

### Long-tail Keywords
- "mejor curso trading algorítmico españa"
- "cómo aprender trading desde cero"
- "mentor trading algorítmico personalizado"
- "comprar robot trading verificado"
- "curso python para trading cuantitativo"

---

## ✅ Checklist Final

- [x] Metadata en todas las páginas
- [x] Sitemap.xml generado
- [x] Robots.txt configurado
- [x] Structured Data (Schema.org)
- [x] Open Graph tags
- [x] Twitter Cards
- [ ] Google Search Console verificado
- [ ] Google Analytics instalado
- [ ] Imágenes OG creadas
- [ ] Favicon agregado
- [ ] URL canónicas actualizadas
- [ ] 404 page personalizada
- [ ] Breadcrumbs en páginas internas

---

## 📞 Soporte

Si necesitas ayuda con cualquiera de estos pasos, pregúntame y te guío paso a paso.

**Siguiente paso sugerido:** Crear imágenes Open Graph en Canva (30 minutos).
