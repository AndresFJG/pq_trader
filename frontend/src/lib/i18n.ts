// Multi-language support configuration
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

export const locales = ['es', 'en'] as const;
export type Locale = typeof locales[number];

export const translations = {
  es: {
    common: {
      courses: 'Cursos',
      mentorships: 'Mentorías',
      portfolios: 'Portafolios',
      rentals: 'Alquileres',
      blog: 'Blog',
      login: 'Iniciar Sesión',
      register: 'Comenzar Ahora',
      learnMore: 'Saber Más',
      buyNow: 'Comprar Ahora',
      getStarted: 'Empezar',
      viewAll: 'Ver Todos',
      readMore: 'Leer Más',
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      back: 'Volver',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      backToTop: 'Volver arriba',
      contactWhatsApp: 'Contactar por WhatsApp',
      viewCourse: 'Ver Curso',
      bookMentorship: 'Reservar Mentoría',
      startFreeTrial: 'Comenzar Gratis',
      talkToSales: 'Hablar con Ventas',
      noCreditCard: 'Sin tarjeta de crédito requerida',
      cancelAnytime: 'Cancela cuando quieras',
    },
    nav: {
      home: 'Inicio',
      courses: 'Cursos',
      mentorships: 'Mentorías',
      strategyquant: 'StrategyQuant',
      portfolios: 'Portafolios',
      rentals: 'Alquileres',
      blog: 'Blog',
      features: 'Funcionalidades',
      about: 'Nosotros',
      contact: 'Contacto',
    },
    hero: {
      badge: '🚀 Resultados reales verificados por Darwinex',
      title: 'Aprende Trading',
      titleHighlight: 'Algorítmico',
      titleSuffix: 'con Expertos',
      subtitle: 'Domina el trading algorítmico desde cero. Cursos prácticos, mentorías personalizadas y estrategias probadas con resultados reales.',
      cta: 'Ver Cursos',
      ctaSecondary: 'Reservar Mentoría',
      stats: {
        students: 'Estudiantes',
        rating: 'Rating Promedio',
        courses: 'Cursos',
      },
      portfolio: 'Portafolio Live',
      winRate: 'Win Rate',
      sharpeRatio: 'Sharpe Ratio',
    },
    courses: {
      title: 'Cursos',
      titleHighlight: 'Destacados',
      subtitle: 'Aprende con contenido estructurado y práctico',
      level: {
        beginner: 'Principiante',
        intermediate: 'Intermedio',
        advanced: 'Avanzado',
      },
      list: {
        basicAlgo: {
          title: 'Curso Básico de Trading Algorítmico',
          description: 'Este curso está diseñado para guiarte desde los fundamentos del mercado hasta la puesta en marcha de sistemas automáticos. Aprenderás a eliminar el factor emocional, validar tus estrategias con rigor estadístico y dominar las herramientas profesionales que utilizan los traders cuantitativos.',
          module1: 'Módulo 1: Fundamentos del enfoque cuantitativo y microestructura.',
          module2: 'Módulo 2: Operativa técnica y gestión de plataforma (MT5).',
          module3: 'Módulo 3: Construcción lógica de estrategias y gestión de riesgo.',
          module4: 'Módulo 4: Evaluación estadística y análisis de métricas de rendimiento.',
          module5: 'Módulo 5: Pruebas de robustez y validación de datos no vistos.',
          module6: 'Módulo 6: Implementación en real, monitoreo y mejora continua.',
        },
        strategyquant: {
          title: 'StrategyQuant Masterclass',
          description: 'Aprende a crear estrategias de trading algorítmico sin necesidad de programar. En este curso introductorio conocerás StrategyQuant desde cero: su interfaz, lógica de generación de estrategias, evaluación de resultados y exportación a plataformas de trading.',
          module1: 'Módulo 1: Fundamentos y Flujo de Trabajo - Introducción al ecosistema de StrategyQuant.',
          module2: 'Módulo 2: Configuración y Gestión de Datos - Manejo de la interfaz y datos históricos.',
          module3: 'Módulo 3: Motor de Generación - Bloques lógicos, indicadores y reglas.',
          module4: 'Módulo 4: Evaluación y Robustez - Funciones del retester y optimizador.',
          module5: 'Módulo 5: Exportación e Implementación - Paso al mercado real.',
        },
        fxdreema: {
          title: 'FXDreema Masterclass',
          description: 'Transforma tus ideas en sistemas de trading automatizados profesionales sin necesidad de programar código complejo. Este curso integral te guía paso a paso a través de tres niveles clave para dominar fxDreema.',
          module1: 'Fundamentos y Lógica: Aprende los conceptos básicos de programación, tipos de variables (Bool, Double, Int) y el desarrollo de indicadores personalizados mediante señales de buffer.',
          module2: 'Mecánicas Operativas: Domina el funcionamiento de fxDreema a través de sus eventos (On Tick, On Trade, On Timer) y el uso de bloques esenciales como filtros de tiempo, acciones de trading y gestión de riesgos (Trailing Stop y Breakeven).',
          module3: 'Estrategias Avanzadas: Diseña estrategias compuestas (Trend Follow, Scalping, Grid) con un enfoque en el mercado real, considerando factores críticos como el spread, el slippage y la optimización para obtener un edge estadístico sólido.',
          objective: 'Al finalizar, serás capaz de construir, conectar y optimizar EAs robustos listos para operar con fundamentos técnicos y realistas en el mercado en vivo.',
        },
        advancedData: {
          title: 'De la teoría al mercado real: Datos, Optimización y Robustez',
          description: 'Evoluciona del simple desarrollo de algoritmos hacia la arquitectura de sistemas validados bajo procesos de rigor estadístico y robustez técnica. Este curso avanzado está diseñado para traders que buscan profesionalizar sus sistemas mediante el rigor estadístico y la validación de datos.',
          module1: 'Optimización Profesional y WFA: Domina el Walk Forward Analysis para validar tus estrategias y evitar el overfitting (sobreoptimización), asegurando que tu sistema funcione fuera del histórico.',
          module2: 'Calidad de Datos y Robustez: Aprende a trabajar con datos de alta precisión y utiliza Tests de Montecarlo para medir la probabilidad de éxito y la resistencia de tu edge estadístico.',
          module3: 'Gestión de Portafolios: Utiliza herramientas como QuantAnalyzer para combinar sistemas, analizar correlaciones y construir carteras diversificadas que minimicen el riesgo.',
          module4: 'Implementación en Vivo: Todo lo necesario para el salto al mercado real: configuración de VPS, auditoría de cuentas y análisis de performance en tiempo real.',
          objective: 'Desarrollar un criterio analítico avanzado para validar la viabilidad de estrategias algorítmicas, mitigando el sesgo de sobreajuste (overfitting) y optimizando la gestión de carteras bajo estándares profesionales.',
        },
      },
    },
    mentorships: {
      title: 'Mentorías Personalizadas',
      subtitle: 'Aprende directamente de traders profesionales',
      individual: 'Sesión Individual',
      pack: 'Pack 4 Sesiones',
      club: 'Club Premium',
      from: 'Desde',
      perSession: 'por sesión',
      perMonth: 'por mes',
    },
    footer: {
      description: 'Aprende trading algorítmico con expertos y resultados reales.',
      products: 'Productos',
      company: 'Compañía',
      legal: 'Legal',
      aboutUs: 'Sobre Nosotros',
      contact: 'Contacto',
      faqs: 'FAQs',
      terms: 'Términos y Condiciones',
      riskDisclosure: 'Divulgación de Riesgos',
      privacy: 'Política de Privacidad',
      cookies: 'Cookies',
      regulatoryNotice: 'Aviso Regulatorio Importante',
      regulatoryText: 'PQ Trader NO está registrado como CTA ante la CFTC/NFA. Los servicios ofrecidos son exclusivamente educativos y no constituyen asesoramiento de inversión. El trading conlleva riesgos elevados de pérdida.',
      regulatoryDisclaimer: 'CFDs prohibidos para residentes de EE.UU. • Solo para fines educativos • Opere con responsabilidad',
      rights: '© 2026 PQ Trader. Todos los derechos reservados.',
    },
    chat: {
      title: 'Asistente Virtual',
      subtitle: 'Respuesta instantánea',
      placeholder: 'Escribe tu pregunta...',
      online: 'Online',
      available: 'Disponible 24/7',
      instant: 'Respuestas instantáneas',
    },
    testimonials: {
      title: 'Lo Que Dicen Nuestros Alumnos',
      subtitle: 'Más de 1,000 traders satisfechos',
    },
    cta: {
      title: '¿Listo para transformar tu trading?',
      subtitle: 'Únete a cientos de traders que ya están automatizando sus estrategias y obteniendo resultados consistentes. Comienza tu prueba gratuita hoy.',
      start: 'Comenzar Gratis',
      sales: 'Hablar con Ventas',
      noCreditCard: '✓ Sin tarjeta de crédito requerida',
      cancelAnytime: '✓ Cancela cuando quieras',
    },
    features: {
      title: '¿Por qué elegir',
      titleHighlight: 'PQ Trader',
      subtitle: 'Todo lo que necesitas para dominar el trading algorítmico en un solo lugar',
      list: {
        courses: {
          title: 'Cursos Completos',
          description: 'Desde principiante hasta avanzado, aprende a tu propio ritmo con material estructurado.',
        },
        mentorships: {
          title: 'Mentorías 1-a-1',
          description: 'Sesiones personalizadas con traders experimentados para resolver tus dudas específicas.',
        },
        results: {
          title: 'Resultados Reales',
          description: 'Visualiza nuestros portafolios en tiempo real integrados con Darwinex.',
        },
        payment: {
          title: 'Pago Seguro',
          description: 'Pagos protegidos con Stripe. Cancela tu suscripción cuando quieras.',
        },
        access: {
          title: 'Acceso Inmediato',
          description: 'Comienza a aprender inmediatamente después de tu suscripción.',
        },
        certificates: {
          title: 'Certificados',
          description: 'Obtén certificados al completar cursos y demuestra tus habilidades.',
        },
      },
    },
    darwinex: {
      title: 'Resultados',
      titleHighlight: 'Verificados',
      subtitle: 'Nuestros portafolios en vivo integrados con Darwinex. Transparencia total.',
      annualReturn: 'Retorno Anual',
      drawdown: 'Drawdown',
      sharpeRatio: 'Sharpe Ratio',
      winRate: 'Win Rate',
      trades: 'Trades',
      live: 'EN VIVO',
      tradingNow: 'Operando ahora',
    },
    trackRecords: {
      title: 'Track Records',
      subtitle: 'Historial de rendimiento real',
      period: 'Período',
      totalReturn: 'Retorno Total',
      maxDrawdown: 'Drawdown Máximo',
      sharpeRatio: 'Sharpe Ratio',
      winRate: 'Win Rate',
      monthly: 'Retornos Mensuales',
      yearly: 'Retornos Anuales',
    },
    checkout: {
      title: 'Checkout',
      paymentInfo: 'Información de Pago',
      completeData: 'Completa tus datos para finalizar la compra',
      orderSummary: 'Resumen del Pedido',
      productDetails: 'Detalles del Producto',
      paymentMethod: 'Método de Pago',
      paymentCurrency: 'Moneda de Pago',
      detected: 'Detectado',
      detectingLocation: 'Detectando tu ubicación...',
      card: 'Tarjeta',
      paypal: 'PayPal',
      googlePay: 'Google Pay',
      applePay: 'Apple Pay',
      sepa: 'SEPA',
      personalInfo: 'Información Personal',
      fullName: 'Nombre Completo',
      email: 'Email',
      phone: 'Teléfono',
      country: 'País',
      cardInfo: 'Información de Tarjeta',
      cardNumber: 'Número de Tarjeta',
      expiry: 'Vencimiento',
      cvv: 'CVV',
      paypalInfo: 'Información de PayPal',
      paypalEmail: 'Email de PayPal',
      bankingInfo: 'Información Bancaria',
      iban: 'IBAN',
      billingAddress: 'Dirección de Facturación',
      address: 'Dirección',
      city: 'Ciudad',
      postalCode: 'Código Postal',
      processing: 'Procesando...',
      pay: 'Pagar',
      sslSecure: 'SSL Seguro',
      encrypted: 'Encriptado',
      required: '*',
    },
    whatsapp: {
      message: 'Hola, me gustaría obtener más información sobre los cursos de PQ Trader.',
    },
    cookies: {
      title: 'Usamos Cookies',
      description: 'Utilizamos cookies para mejorar tu experiencia. Puedes personalizar tus preferencias o aceptar todas.',
      acceptAll: 'Aceptar Todas',
      acceptNecessary: 'Solo Necesarias',
      customize: 'Personalizar',
      savePreferences: 'Guardar Preferencias',
      necessary: 'Cookies Necesarias',
      necessaryDesc: 'Esenciales para el funcionamiento del sitio',
      analytics: 'Cookies de Análisis',
      analyticsDesc: 'Nos ayudan a mejorar el sitio con estadísticas anónimas',
      marketing: 'Cookies de Marketing',
      marketingDesc: 'Personalizan anuncios según tus intereses',
      learnMore: 'Aprende más sobre nuestra',
      privacyPolicy: 'Política de Privacidad',
    },
    privacyPolicy: {
      title: 'Política de Privacidad',
      subtitle: 'Cómo recopilamos, usamos y protegemos tu información personal',
      lastUpdated: 'Última actualización',
      january: 'enero de',
      intro: {
        title: 'Introducción',
        p1: 'En PQ Trader, valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal cuando utilizas nuestra plataforma de educación en trading algorítmico.',
        p2: 'Al acceder o utilizar nuestros servicios, aceptas las prácticas descritas en esta política. Si no estás de acuerdo con algún aspecto de esta política, te recomendamos no utilizar nuestros servicios.',
      },
      dataCollection: {
        title: 'Información que Recopilamos',
        personal: {
          title: '1. Información Personal',
          name: 'Nombre completo',
          email: 'Dirección de correo electrónico',
          phone: 'Número de teléfono',
          address: 'Dirección postal',
          payment: 'Información de pago (procesada de forma segura por terceros)',
        },
        usage: {
          title: '2. Información de Uso',
          ip: 'Dirección IP',
          browser: 'Tipo de navegador',
          device: 'Información del dispositivo',
          navigation: 'Páginas visitadas y tiempo de navegación',
          interactions: 'Interacciones con la plataforma',
        },
      },
      dataUsage: {
        title: 'Cómo Usamos tu Información',
        services: 'Proporcionar, mantener y mejorar nuestros servicios',
        communication: 'Comunicarnos contigo sobre tu cuenta y servicios',
        improvements: 'Analizar el uso de la plataforma para mejoras',
        security: 'Detectar, prevenir y abordar problemas técnicos y de seguridad',
        legal: 'Cumplir con obligaciones legales',
        marketing: 'Enviar información sobre nuevos cursos, promociones y actualizaciones (solo con tu consentimiento)',
      },
      cookies: {
        title: 'Uso de Cookies',
        description: 'Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra plataforma.',
        types: {
          title: 'Tipos de Cookies que Utilizamos:',
          necessary: 'Cookies Necesarias:',
          necessaryDesc: 'Esenciales para el funcionamiento básico del sitio (sesión de usuario, preferencias de idioma)',
          analytics: 'Cookies de Análisis:',
          analyticsDesc: 'Nos ayudan a entender cómo interactúas con nuestra plataforma (Google Analytics)',
          marketing: 'Cookies de Marketing:',
          marketingDesc: 'Permiten mostrar anuncios relevantes basados en tus intereses',
        },
      },
      sharing: {
        title: 'Compartir Información',
        intro: 'No vendemos tu información personal. Solo compartimos información en los siguientes casos:',
        providers: 'Proveedores de servicios de confianza que nos ayudan a operar la plataforma',
        payment: 'Procesadores de pago (Stripe, PayPal) para transacciones seguras',
        analytics: 'Servicios de análisis (Google Analytics) para mejorar nuestros servicios',
        legal: 'Cuando sea requerido por ley o para proteger nuestros derechos legales',
      },
      security: {
        title: 'Seguridad de tus Datos',
        description: 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:',
        encryption: 'Encriptación SSL/TLS para todas las transmisiones de datos',
        access: 'Controles de acceso estrictos a información personal',
        monitoring: 'Monitoreo continuo de sistemas para detectar vulnerabilidades',
        updates: 'Actualizaciones regulares de seguridad y auditorías',
      },
      rights: {
        title: 'Tus Derechos',
        access: 'Acceso: Solicitar una copia de tus datos personales',
        correction: 'Rectificación: Corregir información inexacta o incompleta',
        deletion: 'Eliminación: Solicitar la eliminación de tus datos ("derecho al olvido")',
        portability: 'Portabilidad: Recibir tus datos en formato estructurado',
        restriction: 'Restricción: Limitar el procesamiento de tus datos',
        objection: 'Objeción: Oponerte al procesamiento de tus datos',
        withdraw: 'Retirada de consentimiento: Retirar tu consentimiento en cualquier momento',
      },
      retention: {
        title: 'Retención de Datos',
        description: 'Conservamos tu información personal solo mientras sea necesario para los fines descritos en esta política, o según lo requiera la ley. Los datos de cuenta activa se mantienen mientras uses nuestros servicios. Después de la cancelación, conservamos cierta información durante el período requerido por ley (generalmente 5-7 años para registros financieros).',
      },
      international: {
        title: 'Transferencias Internacionales',
        description: 'Tus datos pueden ser transferidos y procesados en países fuera de tu residencia. Nos aseguramos de que estas transferencias cumplan con las leyes de protección de datos aplicables mediante cláusulas contractuales estándar y otras salvaguardas apropiadas.',
      },
      minors: {
        title: 'Menores de Edad',
        description: 'Nuestros servicios están destinados a personas mayores de 18 años. No recopilamos intencionalmente información de menores de edad. Si descubrimos que hemos recopilado datos de un menor, eliminaremos dicha información de inmediato.',
      },
      changes: {
        title: 'Cambios en esta Política',
        description: 'Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos por correo electrónico o mediante un aviso prominente en nuestra plataforma. Te recomendamos revisar esta política periódicamente.',
      },
      contact: {
        title: 'Contacto',
        description: 'Si tienes preguntas, inquietudes o deseas ejercer tus derechos sobre tus datos personales, puedes contactarnos en:',
        support: 'Soporte',
      },
    },
    cookiesPolicy: {
      title: 'Política de Cookies',
      subtitle: 'Cómo utilizamos cookies y tecnologías similares',
      what: {
        title: '¿Qué son las Cookies?',
        p1: 'Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.',
        p2: 'Las cookies nos ayudan a mejorar tu experiencia recordando tus preferencias, analizando cómo utilizas nuestra plataforma y personalizando el contenido que ves.',
      },
      types: {
        title: 'Tipos de Cookies que Utilizamos',
        necessary: {
          title: 'Cookies Necesarias (Obligatorias)',
          description: 'Estas cookies son esenciales para que puedas navegar por el sitio web y utilizar sus funciones. Sin estas cookies, servicios como el carrito de compras o la facturación electrónica no pueden funcionar.',
          purpose: 'Autenticación, seguridad, preferencias de idioma',
          duration: 'Sesión o hasta 1 año',
        },
        analytics: {
          title: 'Cookies de Análisis (Opcionales)',
          description: 'Estas cookies recopilan información sobre cómo utilizas el sitio web, como las páginas que visitas más a menudo y si recibes mensajes de error. Toda la información recopilada es anónima y se utiliza únicamente para mejorar nuestros servicios.',
          purpose: 'Análisis de tráfico, comportamiento del usuario, métricas de rendimiento',
          duration: 'Hasta 2 años',
        },
        marketing: {
          title: 'Cookies de Marketing (Opcionales)',
          description: 'Estas cookies se utilizan para rastrear a los visitantes en los sitios web. La intención es mostrar anuncios que sean relevantes y atractivos para el usuario individual.',
          purpose: 'Publicidad personalizada, remarketing, seguimiento de conversiones',
          duration: 'Hasta 2 años',
        },
      },
      purpose: 'Propósito',
      duration: 'Duración',
      examples: 'Ejemplos',
      provider: 'Proveedor',
      thirdParty: {
        title: 'Cookies de Terceros',
        description: 'Utilizamos servicios de terceros que establecen sus propias cookies. Estas empresas tienen sus propias políticas de privacidad:',
        googleAnalytics: 'Análisis de tráfico y comportamiento del usuario',
        googleAds: 'Publicidad y remarketing',
        facebook: 'Seguimiento de conversiones y publicidad',
        stripe: 'Procesamiento seguro de pagos',
        paypal: 'Procesamiento de pagos con PayPal',
      },
      manage: {
        title: 'Cómo Gestionar las Cookies',
        description: 'Tienes el control total sobre qué cookies aceptas. Puedes gestionar tus preferencias de dos formas:',
        ourSettings: '1. A través de Nuestro Panel de Preferencias',
        ourSettingsDesc: 'Haz clic en el botón a continuación para abrir el panel de configuración de cookies y personalizar tus preferencias:',
        button: 'Gestionar Preferencias de Cookies',
        browserSettings: '2. A través de tu Navegador',
        instructions: 'Ver instrucciones',
        warning: 'Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio web y tu experiencia de usuario.',
      },
      updates: {
        title: 'Actualizaciones de esta Política',
        description: 'Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en las cookies que utilizamos o por otras razones operativas, legales o regulatorias. Te recomendamos revisar esta política periódicamente.',
      },
      moreInfo: {
        title: 'Más Información',
        description: 'Si tienes preguntas sobre nuestro uso de cookies, puedes contactarnos:',
        privacyPolicy: 'Ver Política de Privacidad completa',
      },
    },
    regional: {
      title: 'Aviso Regulatorio',
      cfdWarning: 'Advertencia CFD',
      cfdContent: 'Los CFDs son instrumentos complejos con alto riesgo de pérdida rápida debido al apalancamiento. Entre el 74-89% de inversores minoristas pierden dinero operando CFDs. Considere si comprende cómo funcionan los CFDs y si puede permitirse el alto riesgo de perder su dinero.',
    },
    payments: {
      title: 'Métodos de Pago Disponibles',
      selectMethod: 'Selecciona tu método de pago preferido',
      card: 'Tarjeta de Crédito/Débito',
      cardDesc: 'Visa, Mastercard, American Express',
      paypal: 'PayPal',
      paypalDesc: 'Pago seguro con tu cuenta PayPal',
      mercadopago: 'Mercado Pago',
      mercadopagoDesc: 'Disponible en América Latina',
      pix: 'PIX',
      pixDesc: 'Transferencia instantánea (Brasil)',
      sepa: 'Transferencia SEPA',
      sepaDesc: 'Transferencia bancaria (Europa)',
      instant: 'Instantáneo',
      businessDays: 'días hábiles',
      select: 'Seleccionar',
    },
    coursesPage: {
      badge: 'Catálogo Completo',
      title: 'Cursos de Trading',
      titleHighlight: 'Algorítmico',
      subtitle: 'Aprende de traders profesionales. Desde lo básico hasta estrategias avanzadas de trading cuantitativo.',
      stats: {
        activeCourses: 'Cursos Activos',
        totalStudents: 'Estudiantes Activos',
        avgRating: 'Satisfacción',
        contentHours: 'Horas de Contenido',
      },
      card: {
        students: 'estudiantes',
        hours: 'horas',
        details: 'Ver Detalles',
        buyNow: 'Comprar Ahora',
        oneTimePayment: 'pago único',
        viewCourse: 'Ver Curso',
      },
      filters: {
        level: 'Nivel',
        topic: 'Tema',
        all: 'Todos',
      },
      noResults: 'No se encontraron cursos con los filtros seleccionados.',
      clearFilters: 'Limpiar Filtros',
      cta: {
        title: '¿No encuentras lo que buscas?',
        subtitle: 'Reserva una mentoría personalizada 1-a-1 con nuestros expertos',
        viewMentorships: 'Ver Mentorías',
      },
      courseContent: 'Contenido del Curso',
      duration: 'Duración',
      certificate: 'Certificado',
      included: 'Incluido',
      instructor: 'Instructor',
      professionalTrader: 'Trader Profesional & Educador',
      topicsAndTechnologies: 'Tecnologías y Temas',
      includedBenefits: 'Beneficios Incluidos',
      oneTimePaymentAccess: 'Pago único - Acceso de por vida',
      enrollNow: 'Inscribirme Ahora',
    },
    mentorshipsPage: {
      badge: 'Aprendizaje Personalizado',
      title: 'Programas de',
      titleHighlight: 'Mentoría',
      subtitle: 'Aprende directamente de traders profesionales. Elige entre sesiones individuales personalizadas o talleres grupales.',
      benefits: {
        videoHD: 'Videollamadas HD',
        continuousSupport: 'Soporte Continuo',
        flexibleSchedule: 'Horarios Flexibles',
        certificate: 'Certificado',
      },
      individual: {
        title: 'Mentorías',
        titleHighlight: 'Individuales 1-a-1',
        subtitle: 'Atención personalizada con tu mentor. Elige el plan que mejor se adapte a tus objetivos',
        topicsTitle: 'Temas de Mentoría Disponibles:',
        topics: {
          trading: 'Trading en General',
          fxdreema: 'fxDreema',
          sqx: 'StrategyQuant (SQX)',
          mt45: 'MetaTrader 4/5',
          python: 'Python',
          pinescript: 'PineScript & TradingView',
          mql5: 'MQL5',
          performance: 'Revisión de Performance',
          darwinex: 'Darwinex & Darwinex Zero',
        },
      },
      groupSessions: {
        title: 'Mentorías',
        titleHighlight: 'Grupales',
        subtitle: 'Sesiones interactivas en grupo. Aprende con otros traders y comparte experiencias.',
        level: 'Nivel',
        duration: 'Duración',
        spotsLeft: 'lugares disponibles',
        spotsOf: 'de',
        topicsTitle: 'Temas a tratar:',
        soldOut: 'Agotado',
        reserveButton: 'Reservar Plaza',
        whyGroup: '¿Por qué elegir mentorías grupales?',
        whyGroupBenefits: {
          networking: {
            title: 'Networking',
            desc: 'Conoce a otros traders y crea tu red profesional',
          },
          affordable: {
            title: 'Precio Accesible',
            desc: 'Hasta 70% más económico que sesiones individuales',
          },
          recordings: {
            title: 'Grabaciones',
            desc: 'Acceso de por vida a todas las grabaciones',
          },
        },
      },
      howItWorks: {
        title: '¿Cómo Funciona?',
        subtitle: 'Proceso simple y directo para comenzar tu mentoría',
        steps: {
          step1: {
            title: 'Elige tu Mentor',
            desc: 'Selecciona el profesional que mejor se adapte a tus objetivos y nivel',
          },
          step2: {
            title: 'Reserva Fecha',
            desc: 'Elige el horario que más te convenga. Disponibilidad flexible',
          },
          step3: {
            title: 'Prepara tu Sesión',
            desc: 'Envía tus dudas, código o proyecto previo para aprovechar al máximo',
          },
          step4: {
            title: 'Aprende y Crece',
            desc: 'Sesión en vivo 1-a-1 con feedback personalizado y plan de acción',
          },
        },
      },
      faqs: {
        title: 'Preguntas Frecuentes',
        items: {
          q1: {
            q: '¿Necesito tener conocimientos previos?',
            a: 'No necesariamente. Tenemos mentores especializados en todos los niveles, desde principiantes hasta traders avanzados. Durante la primera sesión evaluaremos tu nivel y diseñaremos un plan personalizado.',
          },
          q2: {
            q: '¿Las sesiones son grabadas?',
            a: 'Sí, todas las sesiones se graban automáticamente y quedan disponibles para que puedas repasarlas cuando quieras. El material es tuyo para siempre.',
          },
          q3: {
            q: '¿Qué plataformas y herramientas aprenderé?',
            a: 'Depende de tu mentor y especialización. Python, TradingView, MetaTrader, QuantConnect, Interactive Brokers API, y más. Todo se adapta a tus objetivos.',
          },
          q4: {
            q: '¿Puedo cambiar de mentor?',
            a: 'Absolutamente. Si sientes que otro mentor se ajusta mejor a tus necesidades, puedes cambiar sin costo adicional.',
          },
          q5: {
            q: '¿Hay garantía de resultados?',
            a: 'El trading tiene riesgos inherentes y no podemos garantizar rentabilidad. Lo que sí garantizamos es enseñarte las mejores prácticas, herramientas y estrategias utilizadas por profesionales.',
          },
          q6: {
            q: '¿Recibiré certificado?',
            a: 'Sí, al completar el programa de mentoría mensual recibirás un certificado verificable que avala tus conocimientos en trading algorítmico.',
          },
        },
      },
      cta: {
        title: '¿Listo para dar el siguiente paso?',
        subtitle: 'Únete a más de 5,000 estudiantes que ya están operando de manera profesional',
        startButton: 'Comenzar Mentoría',
        callButton: 'Agendar Llamada Gratis',
      },
      labels: {
        experience: 'Experiencia',
        students: 'Estudiantes',
        rating: 'Calificación',
        sessions: 'Sesiones',
        session: 'Sesión',
        priceFrom: 'Desde',
        specialties: 'Especialidades',
        achievements: 'Logros',
        viewProfile: 'Ver Perfil',
        bookSession: 'Reservar Sesión',
      },
      mentors: {
        title: 'Nuestros',
        titleHighlight: 'Profesionales',
        subtitle: 'Aprende de los mejores. Todos nuestros mentores tienen experiencia real en mercados y han gestionado millones de dólares.',
      },
    },
    loginPage: {
      badge: 'Acceso a Plataforma',
      welcome: 'Bienvenido a',
      title: 'Iniciar Sesión',
      subtitle: 'Accede a tu cuenta para continuar con tu aprendizaje y gestionar tus estrategias de trading.',
      description: 'Ingresa tus credenciales para acceder',
      form: {
        email: 'Correo Electrónico',
        emailPlaceholder: 'tu@email.com',
        password: 'Contraseña',
        passwordPlaceholder: 'Ingresa tu contraseña',
        forgotPassword: '¿Olvidaste tu contraseña?',
        rememberMe: 'Recordarme',
        submit: 'Iniciar Sesión',
        loading: 'Iniciando sesión...',
      },
      benefits: {
        courses: {
          title: 'Acceso a Cursos',
          desc: 'Más de 30 horas de contenido premium de trading algorítmico',
        },
        portfolio: {
          title: 'Gestión de Portfolio',
          desc: 'Administra y sigue el desempeño de tus estrategias en tiempo real',
        },
        community: {
          title: 'Comunidad Exclusiva',
          desc: 'Conecta con traders profesionales y comparte conocimiento',
        },
      },
      noAccount: '¿No tienes una cuenta?',
      signUp: 'Regístrate aquí',
    },
    registerPage: {
      badge: 'Únete Hoy',
      welcome: 'Únete a',
      title: 'Crear Cuenta',
      subtitle: 'Comienza tu viaje en el trading algorítmico con acceso a cursos profesionales, mentorías y estrategias verificadas.',
      description: 'Crea tu cuenta gratis en segundos',
      form: {
        name: 'Nombre Completo',
        namePlaceholder: 'Juan Pérez',
        email: 'Correo Electrónico',
        emailPlaceholder: 'tu@email.com',
        password: 'Contraseña',
        passwordPlaceholder: 'Mínimo 8 caracteres',
        passwordHint: 'Usa al menos 8 caracteres con letras y números',
        confirmPassword: 'Confirmar Contraseña',
        confirmPasswordPlaceholder: 'Ingresa tu contraseña nuevamente',
        acceptTerms: 'Acepto los',
        terms: 'Términos de Servicio',
        and: 'y la',
        privacy: 'Política de Privacidad',
        submit: 'Crear Cuenta',
        loading: 'Creando cuenta...',
        passwordMismatch: 'Las contraseñas no coinciden',
        acceptTermsRequired: 'Debes aceptar los términos y condiciones',
      },
      benefits: {
        secure: {
          title: 'Registro Seguro',
          desc: 'Tus datos están protegidos con encriptación de nivel bancario',
        },
        instant: {
          title: 'Acceso Instantáneo',
          desc: 'Comienza a aprender inmediatamente después de registrarte',
        },
        support: {
          title: 'Soporte 24/7',
          desc: 'Equipo disponible para ayudarte en cualquier momento',
        },
      },
      stats: {
        students: '+5,000 traders',
        studentsText: 'ya confían en PQ Trader para su formación',
      },
      haveAccount: '¿Ya tienes una cuenta?',
      signIn: 'Inicia sesión',
    },
    strategyquantPage: {
      hero: {
        badge: 'Herramienta Profesional',
        title: 'Domina',
        titleHighlight: 'StrategyQuant X',
        subtitle: 'La plataforma de trading algorítmico más avanzada para crear, probar y optimizar estrategias ganadoras sin programar.',
        cta: 'Ver Curso',
      },
      features: {
        title: 'Características Principales',
        ai: {
          title: 'Inteligencia Artificial',
          description: 'Genera estrategias automaticamente usando algoritmos genéticos avanzados',
        },
        noCoding: {
          title: 'Sin Programar',
          description: 'Crea estrategias complejas sin escribir una sola línea de código',
        },
        robustness: {
          title: 'Tests de Robustez',
          description: 'Valida tus estrategias con Walk-Forward, Monte Carlo y más',
        },
        multiMarket: {
          title: 'Multi-Mercado',
          description: 'Opera en Forex, Futuros, Acciones y Criptomonedas',
        },
        optimization: {
          title: 'Optimización Avanzada',
          description: 'Encuentra los mejores parámetros con optimización multidimensional',
        },
        portfolios: {
          title: 'Gestión de Portfolios',
          description: 'Combina múltiples estrategias para reducir riesgo y maximizar retornos',
        },
      },
      process: {
        title: 'Proceso de Creación',
        step1: {
          title: 'Generación',
          description: 'La IA genera miles de estrategias basadas en tus criterios',
        },
        step2: {
          title: 'Validación',
          description: 'Filtra y valida usando tests de robustez avanzados',
        },
        step3: {
          title: 'Exportación',
          description: 'Exporta a MT4/MT5, NinjaTrader, TradingView y más',
        },
        step4: {
          title: 'Gestión',
          description: 'Monitorea y gestiona tus estrategias en vivo',
        },
      },
      benefits: {
        title: '¿Por qué StrategyQuant X?',
        subtitle: 'La herramienta preferida por traders profesionales',
      },
    },
    portafoliosPage: {
      hero: {
        badge: 'Trading Algorítmico',
        title: 'Portafolios de',
        titleHighlight: 'Trading Cuantitativo',
        subtitle: 'Estrategias profesionales probadas con resultados reales. Sigue nuestros portafolios o aprende a crear los tuyos.',
      },
      stats: {
        totalReturn: 'Retorno Total',
        sharpeRatio: 'Ratio Sharpe',
        maxDrawdown: 'Máximo Drawdown',
        winRate: 'Tasa de Acierto',
      },
      performance: {
        title: 'Performance Mensual',
        year: 'Año',
        month: 'Mes',
        return: 'Retorno',
      },
      benefits: {
        title: '¿Por qué nuestros portafolios?',
        subtitle: 'Transparencia y resultados verificables',
      },
      globalStats: {
        title: 'Estadísticas Globales',
        subtitle: 'Resumen del desempeño de todos nuestros sistemas',
        avgReturn: 'Retorno Promedio',
        lastYear: 'Último año',
        sharpe: 'Sharpe Ratio',
        average: 'Promedio',
        maxDD: 'Max Drawdown',
        winRate: 'Win Rate',
      },
      transparency: {
        title: 'Transparencia Total',
        text1: 'Todos los track records mostrados están verificados por Darwinex, una plataforma regulada por la FCA (Financial Conduct Authority) del Reino Unido.',
        text2: 'Los resultados pasados no garantizan rendimientos futuros. El trading implica riesgos y puede resultar en pérdidas de capital.',
      },
      access: {
        title: 'Accede a Nuestros',
        titleHighlight: 'Portafolios',
        subtitle: 'Sistemas de trading algorítmico con historial verificado. Elige el plan que se ajuste a tu capital.',
        verifiedDarwinex: 'Verificado Darwinex',
        compatibleMT: 'Compatible MetaTrader',
        fundingReady: 'Apto Fondeo',
      },
      purchase: {
        button: 'Comprar',
      },
      pricing: {
        rentLabel: 'Precio Alquiler (1 año)',
        buyLabel: 'Precio Compra (Indefinido)',
        rentButton: 'Alquilar',
      },
      features: {
        monthlyOptimization: 'Optimización mensual',
        riskManagement: 'Gestión de riesgo',
        support247: 'Soporte 24/7',
        profitability: 'Rentabilidad',
        drawdown: 'Drawdown',
      },
      additional: {
        title: 'Apto para Darwinex y Cuentas de Fondeo',
        subtitle: 'Todos nuestros portafolios están optimizados para operar en cuentas reales verificadas.',
        optimization: 'Optimización mensual incluida en alquiler',
      },
    },
    alquileresPage: {
      hero: {
        badge: 'Acceso Premium',
        title: 'Alquiler de',
        titleHighlight: 'Estrategias',
        subtitle: 'Accede a nuestras mejores estrategias de trading algorítmico sin desarrollarlas tú mismo.',
        cta: 'Ver Planes',
      },
      plans: {
        title: 'Planes de Alquiler',
        subtitle: 'Elige el plan que mejor se adapte a tus necesidades',
        individual: {
          name: 'Individual',
          price: '50',
          period: 'mes',
          description: 'Perfecta para comenzar con alquileres',
          features: [
            '1 estrategia a tu elección',
            'Actualizaciones incluidas',
            'Soporte por email',
            'Documentación completa',
            'Sin permanencia',
          ],
          cta: 'Alquilar Ahora',
        },
        portfolioFondeo: {
          name: 'Portfolio Fondeo',
          price: '120',
          period: 'mes',
          description: 'Para traders que buscan diversificación',
          popular: 'Más Popular',
          features: [
            '7 estrategias incluidas',
            'Portfolio optimizado',
            'Soporte prioritario',
            'Actualizaciones automáticas',
            'Configuración asistida',
            'Análisis de riesgo',
          ],
          cta: 'Alquilar Portfolio',
          savings: 'Ahorra €230/mes',
        },
        portfolioDarwinex: {
          name: 'Portfolio Darwinex',
          price: '200',
          period: 'mes',
          description: 'Máxima diversificación y rendimiento',
          features: [
            '15 estrategias premium',
            'Portfolio elite',
            'Soporte dedicado 24/7',
            'Rebalanceo mensual',
            'Acceso a nuevas estrategias',
            'Sesión de configuración 1-a-1',
            'Reportes mensuales',
          ],
          cta: 'Alquilar Portfolio Elite',
          savings: 'Ahorra €550/mes',
        },
      },
      benefits: {
        title: 'Beneficios del Alquiler',
        subtitle: 'Todo lo que necesitas para operar con confianza',
        benefit1: {
          title: 'Track Record Verificado',
          description: 'Todos los sistemas tienen resultados reales verificables en Darwinex',
        },
        benefit2: {
          title: 'Actualizaciones Continuas',
          description: 'Los robots se optimizan constantamente según condiciones de mercado',
        },
        benefit3: {
          title: 'Optimizado para Fondeo',
          description: 'Configuraciones específicas para pasar challenges de fondeo',
        },
        benefit4: {
          title: 'Soporte Profesional',
          description: 'Equipo técnico disponible 24/7 para resolver cualquier duda',
        },
      },
      whyRent: {
        title: '¿Por qué alquilar en lugar de comprar?',
      },
      stats: {
        title: 'Estadísticas de Rendimiento',
        subtitle: 'Resultados verificados de nuestros sistemas de trading',
        fromMonth: 'Desde /mes',
        verified: 'Verificado',
        support: 'Soporte',
        winRate: 'Win Rate',
      },
      pricing: {
        bestValue: 'Mejor valor',
        selectPeriod: 'Selecciona un periodo arriba para continuar',
      },
      cta: {
        title: '¿Necesitas ayuda para elegir?',
        subtitle: 'Agenda una consulta gratuita con nuestros expertos',
        button: 'Hablar con un Experto',
      },
    },
    blogPage: {
      hero: {
        badge: 'Recursos Educativos',
        title: 'Blog de',
        titleHighlight: 'Trading Algorítmico',
        subtitle: 'Aprende sobre trading cuantitativo, herramientas, estrategias y mejores prácticas.',
      },
      categories: {
        all: 'Todos',
        beginners: 'Principiantes',
        ml: 'Machine Learning',
        risk: 'Gestión de Riesgo',
        tools: 'Herramientas',
        apis: 'APIs y Automatización',
      },
      filters: {
        search: 'Buscar artículos...',
        category: 'Categoría',
      },
      post: {
        readMore: 'Leer más',
        readTime: 'min de lectura',
        by: 'Por',
      },
      featured: {
        title: 'Destacado',
        subtitle: 'El artículo más popular de la semana',
      },
      latest: {
        title: 'Últimos Artículos',
      },
      posts: {
        post1: {
          title: 'Cómo Empezar con Trading Algorítmico en 2025',
          excerpt: 'Guía completa para principiantes que quieren adentrarse en el mundo del trading algorítmico.',
          author: 'Carlos Martínez',
        },
        post2: {
          title: 'Python vs R: ¿Cuál es Mejor para Trading?',
          excerpt: 'Comparativa detallada entre Python y R para análisis cuantitativo y desarrollo de estrategias.',
          author: 'Ana García',
        },
        post3: {
          title: 'Machine Learning en Trading: Casos Reales',
          excerpt: 'Exploramos 5 casos de uso reales de ML en trading algorítmico con ejemplos de código.',
          author: 'Roberto Silva',
        },
        post4: {
          title: 'Gestión de Riesgo: El Pilar del Trading Exitoso',
          excerpt: 'Por qué el 90% de los traders fallan por mala gestión de riesgo y cómo evitarlo.',
          author: 'Laura Fernández',
        },
        post5: {
          title: 'Backtesting: Errores Comunes y Cómo Evitarlos',
          excerpt: 'Los 7 errores más comunes al hacer backtesting que pueden arruinar tus resultados.',
          author: 'Miguel Torres',
        },
        post6: {
          title: 'APIs de Brokers: Guía de Integración',
          excerpt: 'Cómo conectar tu estrategia a Interactive Brokers, Alpaca y Binance.',
          author: 'David López',
        },
        skoolPost: {
          title: 'Únete a Nuestra Comunidad en Skool',
          excerpt: 'Descubre nuestra plataforma educativa completa con cursos, recursos, mentorías y una comunidad activa de traders algorítmicos.',
          author: 'Equipo PQ Trader',
        },
      },
      skool: {
        title: 'Comunidad Skool: Trading Algorítmico',
        subtitle: 'Estructura operativa completa para traders cuantitativos',
        pillars: {
          academic: {
            title: '1. Pilar Académico',
            subtitle: 'Contenido asíncrono de alto valor',
            items: [
              'Curso de Iniciación: Fundamentos cuantitativos y lógica de mercado',
              'Masterclass StrategyQuant: Generación automática de estrategias',
              'Masterclass fxDreema: Programación visual desde básico a avanzado',
              'Curso Avanzado de Robustez: WFA, Montecarlo y gestión de carteras'
            ]
          },
          resources: {
            title: '2. Pilar de Recursos Técnicos',
            subtitle: 'Biblioteca descargable de herramientas',
            items: [
              'Repositorio de Algoritmos: Plantillas .fxd y .sqx listas para usar',
              'Snippets & Blueprints: Gestores de breakeven, filtros, cierres por equidad',
              'Post-Mortem de Sistemas: Análisis de estrategias fallidas',
              'Directorio de Partners: VPS, Data feeds con beneficios exclusivos'
            ]
          },
          interaction: {
            title: '3. Pilar de Interacción',
            subtitle: 'Comunidad y sesiones en vivo',
            items: [
              'Directo Nivel 1: Introducción técnica y dudas básicas (Público/Free)',
              'Directo Nivel 2: Arquitectura compleja y errores avanzados (Exclusivo)',
              'Mentorías Grupales: Seguimiento mensual y coaching técnico',
              'Entrevistas con Expertos: Traders institucionales y casos de éxito'
            ]
          },
          gamification: {
            title: '4. Pilar de Gamificación',
            subtitle: 'Incentivos y mejora continua',
            items: [
              'Competiciones Mensuales: Torneos en demo y cuentas de fondeo',
              'Sala de Peer-Review: Feedback crítico antes de operar en real',
              'Ranking de Performance: Tablero de líderes basado en actividad'
            ]
          },
          premium: {
            title: '5. Servicios Premium',
            subtitle: 'Alto valor personalizado',
            items: [
              'Mentorías 1 a 1: Consultoría en Python, MQL5, PineScript',
              'Revisión Profunda: Auditoría de carteras en Darwinex',
              'Desarrollo Custom: Soluciones a medida para tu trading'
            ]
          }
        },
        levels: {
          title: 'Niveles de Membresía',
          free: {
            title: 'Free',
            badge: 'Gratis',
            features: [
              'Módulo 1 del curso básico',
              'Directo mensual simple',
              'Acceso a recursos básicos',
              'Comunidad Discord'
            ]
          },
          premium: {
            title: 'Premium',
            badge: 'Suscripción',
            features: [
              'Todos los cursos completos',
              'Biblioteca de Robots educativos',
              'Canales de revisión y setups',
              'Directo complejo mensual',
              'Acceso prioritario a eventos'
            ]
          },
          vip: {
            title: 'VIP / Mastermind',
            badge: 'High Ticket',
            features: [
              'Mentorías 1 a 1 ilimitadas',
              'Canal privado con fundadores',
              'Revisión personalizada de sistemas',
              'Acceso anticipado a nuevos contenidos',
              'Sesiones exclusivas de networking'
            ]
          }
        },
        cta: {
          join: 'Unirse a Skool',
          learnMore: 'Más Información'
        }
      },
    },
  },
  en: {
    common: {
      courses: 'Courses',
      mentorships: 'Mentorships',
      portfolios: 'Portfolios',
      rentals: 'Rentals',
      blog: 'Blog',
      login: 'Login',
      register: 'Get Started',
      learnMore: 'Learn More',
      buyNow: 'Buy Now',
      getStarted: 'Get Started',
      viewAll: 'View All',
      readMore: 'Read More',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      backToTop: 'Back to top',
      contactWhatsApp: 'Contact via WhatsApp',
      viewCourse: 'View Course',
      bookMentorship: 'Book Mentorship',
      startFreeTrial: 'Start Free Trial',
      talkToSales: 'Talk to Sales',
      noCreditCard: 'No credit card required',
      cancelAnytime: 'Cancel anytime',
    },
    nav: {
      home: 'Home',
      courses: 'Courses',
      mentorships: 'Mentorships',
      strategyquant: 'StrategyQuant',
      portfolios: 'Portfolios',
      rentals: 'Rentals',
      blog: 'Blog',
      features: 'Features',
      about: 'About',
      contact: 'Contact',
    },
    hero: {
      badge: '🚀 Real results verified by Darwinex',
      title: 'Learn',
      titleHighlight: 'Algorithmic',
      titleSuffix: 'Trading with Experts',
      subtitle: 'Master algorithmic trading from scratch. Practical courses, personalized mentorships, and proven strategies with real results.',
      cta: 'View Courses',
      ctaSecondary: 'Book Mentorship',
      stats: {
        students: 'Students',
        rating: 'Average Rating',
        courses: 'Courses',
      },
      portfolio: 'Live Portfolio',
      winRate: 'Win Rate',
      sharpeRatio: 'Sharpe Ratio',
    },
    courses: {
      title: 'Featured',
      titleHighlight: 'Courses',
      subtitle: 'Learn with structured and practical content',
      level: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
      list: {
        basicAlgo: {
          title: 'Basic Algorithmic Trading Course',
          description: 'This course is designed to guide you from market fundamentals to launching automated systems. You will learn to eliminate emotional factors, validate your strategies with statistical rigor, and master professional tools used by quantitative traders.',
          module1: 'Module 1: Foundations of quantitative approach and microstructure.',
          module2: 'Module 2: Technical operations and platform management (MT5).',
          module3: 'Module 3: Logical construction of strategies and risk management.',
          module4: 'Module 4: Statistical evaluation and performance metrics analysis.',
          module5: 'Module 5: Robustness tests and unseen data validation.',
          module6: 'Module 6: Live implementation, monitoring, and continuous improvement.',
        },
        strategyquant: {
          title: 'StrategyQuant Masterclass',
          description: 'Learn to create algorithmic trading strategies without programming. In this introductory course, you will discover StrategyQuant from scratch: its interface, strategy generation logic, results evaluation, and export to trading platforms.',
          module1: 'Module 1: Fundamentals and Workflow - Introduction to StrategyQuant ecosystem.',
          module2: 'Module 2: Configuration and Data Management - Interface handling and historical data.',
          module3: 'Module 3: Generation Engine - Logic blocks, indicators, and rules.',
          module4: 'Module 4: Evaluation and Robustness - Retester and optimizer functions.',
          module5: 'Module 5: Export and Implementation - Moving to live market.',
        },
        fxdreema: {
          title: 'FXDreema Masterclass',
          description: 'Transform your ideas into professional automated trading systems without complex coding. This comprehensive course guides you step by step through three key levels to master fxDreema.',
          module1: 'Fundamentals and Logic: Learn basic programming concepts, variable types (Bool, Double, Int), and custom indicator development through buffer signals.',
          module2: 'Operational Mechanics: Master fxDreema operations through its events (On Tick, On Trade, On Timer) and essential blocks like time filters, trading actions, and risk management (Trailing Stop and Breakeven).',
          module3: 'Advanced Strategies: Design composite strategies (Trend Follow, Scalping, Grid) with a real market focus, considering critical factors like spread, slippage, and optimization to achieve a solid statistical edge.',
          objective: 'By the end, you will be able to build, connect, and optimize robust EAs ready to operate with technical and realistic foundations in the live market.',
        },
        advancedData: {
          title: 'From Theory to Live Market: Data, Optimization and Robustness',
          description: 'Evolve from simple algorithm development to validated system architecture through statistical rigor and technical robustness processes. This advanced course is designed for traders seeking to professionalize their systems through statistical rigor and data validation.',
          module1: 'Professional Optimization and WFA: Master Walk Forward Analysis to validate your strategies and avoid overfitting, ensuring your system works beyond historical data.',
          module2: 'Data Quality and Robustness: Learn to work with high-precision data and use Monte Carlo Tests to measure success probability and statistical edge resistance.',
          module3: 'Portfolio Management: Use tools like QuantAnalyzer to combine systems, analyze correlations, and build diversified portfolios that minimize risk.',
          module4: 'Live Implementation: Everything needed for the leap to live market: VPS configuration, account auditing, and real-time performance analysis.',
          objective: 'Develop advanced analytical criteria to validate algorithmic strategy viability, mitigating overfitting bias and optimizing portfolio management under professional standards.',
        },
      },
    },
    mentorships: {
      title: 'Personalized Mentorships',
      subtitle: 'Learn directly from professional traders',
      individual: 'Individual Session',
      pack: '4-Session Pack',
      club: 'Premium Club',
      from: 'From',
      perSession: 'per session',
      perMonth: 'per month',
    },
    footer: {
      description: 'Learn algorithmic trading with experts and real results.',
      products: 'Products',
      company: 'Company',
      legal: 'Legal',
      aboutUs: 'About Us',
      contact: 'Contact',
      faqs: 'FAQs',
      terms: 'Terms and Conditions',
      riskDisclosure: 'Risk Disclosure',
      privacy: 'Privacy Policy',
      cookies: 'Cookies',
      regulatoryNotice: 'Important Regulatory Notice',
      regulatoryText: 'PQ Trader is NOT registered as a CTA with the CFTC/NFA. The services offered are exclusively educational and do not constitute investment advice. Trading involves high risk of loss.',
      regulatoryDisclaimer: 'CFDs prohibited for U.S. residents • For educational purposes only • Trade responsibly',
      rights: '© 2026 PQ Trader. All rights reserved.',
    },
    chat: {
      title: 'Virtual Assistant',
      subtitle: 'Instant response',
      placeholder: 'Type your question...',
      online: 'Online',
      available: 'Available 24/7',
      instant: 'Instant answers',
    },
    testimonials: {
      title: 'What Our Students Say',
      subtitle: 'More than 1,000 satisfied traders',
    },
    cta: {
      title: 'Ready to transform your trading?',
      subtitle: 'Join hundreds of traders already automating their strategies and achieving consistent results. Start your free trial today.',
      start: 'Start Free Trial',
      sales: 'Talk to Sales',
      noCreditCard: '✓ No credit card required',
      cancelAnytime: '✓ Cancel anytime',
    },
    features: {
      title: 'Why choose',
      titleHighlight: 'PQ Trader',
      subtitle: 'Everything you need to master algorithmic trading in one place',
      list: {
        courses: {
          title: 'Complete Courses',
          description: 'From beginner to advanced, learn at your own pace with structured material.',
        },
        mentorships: {
          title: '1-on-1 Mentorships',
          description: 'Personalized sessions with experienced traders to solve your specific questions.',
        },
        results: {
          title: 'Real Results',
          description: 'View our real-time portfolios integrated with Darwinex.',
        },
        payment: {
          title: 'Secure Payment',
          description: 'Payments protected with Stripe. Cancel your subscription anytime.',
        },
        access: {
          title: 'Immediate Access',
          description: 'Start learning immediately after your subscription.',
        },
        certificates: {
          title: 'Certificates',
          description: 'Get certificates upon course completion and prove your skills.',
        },
      },
    },
    darwinex: {
      title: 'Verified',
      titleHighlight: 'Results',
      subtitle: 'Our live portfolios integrated with Darwinex. Total transparency.',
      annualReturn: 'Annual Return',
      drawdown: 'Drawdown',
      sharpeRatio: 'Sharpe Ratio',
      winRate: 'Win Rate',
      trades: 'Trades',
      live: 'LIVE',
      tradingNow: 'Trading now',
    },
    trackRecords: {
      title: 'Track Records',
      subtitle: 'Real performance history',
      period: 'Period',
      totalReturn: 'Total Return',
      maxDrawdown: 'Max Drawdown',
      sharpeRatio: 'Sharpe Ratio',
      winRate: 'Win Rate',
      monthly: 'Monthly Returns',
      yearly: 'Yearly Returns',
    },
    checkout: {
      title: 'Checkout',
      paymentInfo: 'Payment Information',
      completeData: 'Complete your details to finalize the purchase',
      orderSummary: 'Order Summary',
      productDetails: 'Product Details',
      paymentMethod: 'Payment Method',
      paymentCurrency: 'Payment Currency',
      detected: 'Detected',
      detectingLocation: 'Detecting your location...',
      card: 'Card',
      paypal: 'PayPal',
      googlePay: 'Google Pay',
      applePay: 'Apple Pay',
      sepa: 'SEPA',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      country: 'Country',
      cardInfo: 'Card Information',
      cardNumber: 'Card Number',
      expiry: 'Expiry Date',
      cvv: 'CVV',
      paypalInfo: 'PayPal Information',
      paypalEmail: 'PayPal Email',
      bankingInfo: 'Banking Information',
      iban: 'IBAN',
      billingAddress: 'Billing Address',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      processing: 'Processing...',
      pay: 'Pay',
      sslSecure: 'SSL Secure',
      encrypted: 'Encrypted',
      required: '*',
    },
    whatsapp: {
      message: 'Hello, I would like to get more information about PQ Trader courses.',
    },
    cookies: {
      title: 'We Use Cookies',
      description: 'We use cookies to improve your experience. You can customize your preferences or accept all.',
      acceptAll: 'Accept All',
      acceptNecessary: 'Only Necessary',
      customize: 'Customize',
      savePreferences: 'Save Preferences',
      necessary: 'Necessary Cookies',
      necessaryDesc: 'Essential for site functionality',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Help us improve the site with anonymous statistics',
      marketing: 'Marketing Cookies',
      marketingDesc: 'Personalize ads based on your interests',
      learnMore: 'Learn more about our',
      privacyPolicy: 'Privacy Policy',
    },
    privacyPolicy: {
      title: 'Privacy Policy',
      subtitle: 'How we collect, use, and protect your personal information',
      lastUpdated: 'Last updated',
      january: 'January',
      intro: {
        title: 'Introduction',
        p1: 'At PQ Trader, we value and respect your privacy. This Privacy Policy describes how we collect, use, store, and protect your personal information when you use our algorithmic trading education platform.',
        p2: 'By accessing or using our services, you accept the practices described in this policy. If you do not agree with any aspect of this policy, we recommend that you do not use our services.',
      },
      dataCollection: {
        title: 'Information We Collect',
        personal: {
          title: '1. Personal Information',
          name: 'Full name',
          email: 'Email address',
          phone: 'Phone number',
          address: 'Mailing address',
          payment: 'Payment information (securely processed by third parties)',
        },
        usage: {
          title: '2. Usage Information',
          ip: 'IP address',
          browser: 'Browser type',
          device: 'Device information',
          navigation: 'Pages visited and browsing time',
          interactions: 'Interactions with the platform',
        },
      },
      dataUsage: {
        title: 'How We Use Your Information',
        services: 'Provide, maintain, and improve our services',
        communication: 'Communicate with you about your account and services',
        improvements: 'Analyze platform usage for improvements',
        security: 'Detect, prevent, and address technical and security issues',
        legal: 'Comply with legal obligations',
        marketing: 'Send information about new courses, promotions, and updates (only with your consent)',
      },
      cookies: {
        title: 'Use of Cookies',
        description: 'We use cookies and similar technologies to improve your experience on our platform.',
        types: {
          title: 'Types of Cookies We Use:',
          necessary: 'Necessary Cookies:',
          necessaryDesc: 'Essential for basic site functionality (user session, language preferences)',
          analytics: 'Analytics Cookies:',
          analyticsDesc: 'Help us understand how you interact with our platform (Google Analytics)',
          marketing: 'Marketing Cookies:',
          marketingDesc: 'Allow us to display relevant ads based on your interests',
        },
      },
      sharing: {
        title: 'Information Sharing',
        intro: 'We do not sell your personal information. We only share information in the following cases:',
        providers: 'Trusted service providers who help us operate the platform',
        payment: 'Payment processors (Stripe, PayPal) for secure transactions',
        analytics: 'Analytics services (Google Analytics) to improve our services',
        legal: 'When required by law or to protect our legal rights',
      },
      security: {
        title: 'Data Security',
        description: 'We implement technical and organizational security measures to protect your information:',
        encryption: 'SSL/TLS encryption for all data transmissions',
        access: 'Strict access controls to personal information',
        monitoring: 'Continuous system monitoring to detect vulnerabilities',
        updates: 'Regular security updates and audits',
      },
      rights: {
        title: 'Your Rights',
        access: 'Access: Request a copy of your personal data',
        correction: 'Rectification: Correct inaccurate or incomplete information',
        deletion: 'Deletion: Request deletion of your data ("right to be forgotten")',
        portability: 'Portability: Receive your data in a structured format',
        restriction: 'Restriction: Limit the processing of your data',
        objection: 'Objection: Object to the processing of your data',
        withdraw: 'Withdraw consent: Withdraw your consent at any time',
      },
      retention: {
        title: 'Data Retention',
        description: 'We retain your personal information only as long as necessary for the purposes described in this policy, or as required by law. Active account data is maintained while you use our services. After cancellation, we retain certain information for the period required by law (generally 5-7 years for financial records).',
      },
      international: {
        title: 'International Transfers',
        description: 'Your data may be transferred and processed in countries outside your residence. We ensure that these transfers comply with applicable data protection laws through standard contractual clauses and other appropriate safeguards.',
      },
      minors: {
        title: 'Minors',
        description: 'Our services are intended for persons over 18 years of age. We do not intentionally collect information from minors. If we discover that we have collected data from a minor, we will delete such information immediately.',
      },
      changes: {
        title: 'Changes to This Policy',
        description: 'We may update this Privacy Policy occasionally. We will notify you of significant changes by email or through a prominent notice on our platform. We recommend that you review this policy periodically.',
      },
      contact: {
        title: 'Contact',
        description: 'If you have questions, concerns, or wish to exercise your rights regarding your personal data, you can contact us at:',
        support: 'Support',
      },
    },
    cookiesPolicy: {
      title: 'Cookies Policy',
      subtitle: 'How we use cookies and similar technologies',
      what: {
        title: 'What are Cookies?',
        p1: 'Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to site owners.',
        p2: 'Cookies help us improve your experience by remembering your preferences, analyzing how you use our platform, and personalizing the content you see.',
      },
      types: {
        title: 'Types of Cookies We Use',
        necessary: {
          title: 'Necessary Cookies (Required)',
          description: 'These cookies are essential for you to navigate the website and use its features. Without these cookies, services like shopping carts or e-billing cannot function.',
          purpose: 'Authentication, security, language preferences',
          duration: 'Session or up to 1 year',
        },
        analytics: {
          title: 'Analytics Cookies (Optional)',
          description: 'These cookies collect information about how you use the website, such as which pages you visit most often and whether you receive error messages. All information collected is anonymous and used only to improve our services.',
          purpose: 'Traffic analysis, user behavior, performance metrics',
          duration: 'Up to 2 years',
        },
        marketing: {
          title: 'Marketing Cookies (Optional)',
          description: 'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.',
          purpose: 'Personalized advertising, remarketing, conversion tracking',
          duration: 'Up to 2 years',
        },
      },
      purpose: 'Purpose',
      duration: 'Duration',
      examples: 'Examples',
      provider: 'Provider',
      thirdParty: {
        title: 'Third-Party Cookies',
        description: 'We use third-party services that set their own cookies. These companies have their own privacy policies:',
        googleAnalytics: 'Traffic and user behavior analysis',
        googleAds: 'Advertising and remarketing',
        facebook: 'Conversion tracking and advertising',
        stripe: 'Secure payment processing',
        paypal: 'PayPal payment processing',
      },
      manage: {
        title: 'How to Manage Cookies',
        description: 'You have full control over which cookies you accept. You can manage your preferences in two ways:',
        ourSettings: '1. Through Our Preferences Panel',
        ourSettingsDesc: 'Click the button below to open the cookie settings panel and customize your preferences:',
        button: 'Manage Cookie Preferences',
        browserSettings: '2. Through Your Browser',
        instructions: 'View instructions',
        warning: 'Please note that disabling certain cookies may affect website functionality and your user experience.',
      },
      updates: {
        title: 'Updates to This Policy',
        description: 'We may update this Cookies Policy occasionally to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. We recommend reviewing this policy periodically.',
      },
      moreInfo: {
        title: 'More Information',
        description: 'If you have questions about our use of cookies, you can contact us:',
        privacyPolicy: 'View full Privacy Policy',
      },
    },
    regional: {
      title: 'Regulatory Notice',
      cfdWarning: 'CFD Warning',
      cfdContent: 'CFDs are complex instruments with a high risk of rapid loss due to leverage. Between 74-89% of retail investors lose money trading CFDs. Consider whether you understand how CFDs work and whether you can afford the high risk of losing your money.',
    },
    payments: {
      title: 'Available Payment Methods',
      selectMethod: 'Select your preferred payment method',
      card: 'Credit/Debit Card',
      cardDesc: 'Visa, Mastercard, American Express',
      paypal: 'PayPal',
      paypalDesc: 'Secure payment with your PayPal account',
      mercadopago: 'Mercado Pago',
      mercadopagoDesc: 'Available in Latin America',
      pix: 'PIX',
      pixDesc: 'Instant transfer (Brazil)',
      sepa: 'SEPA Transfer',
      sepaDesc: 'Bank transfer (Europe)',
      instant: 'Instant',
      businessDays: 'business days',
      select: 'Select',
    },
    coursesPage: {
      badge: 'Full Catalog',
      title: 'Trading Courses',
      titleHighlight: 'Algorithmic',
      subtitle: 'Learn from professional traders. From basics to advanced quantitative trading strategies.',
      stats: {
        activeCourses: 'Active Courses',
        totalStudents: 'Active Students',
        avgRating: 'Satisfaction',
        contentHours: 'Hours of Content',
      },
      card: {
        students: 'students',
        hours: 'hours',
        details: 'View Details',
        buyNow: 'Buy Now',
        oneTimePayment: 'one-time payment',
        viewCourse: 'View Course',
      },
      filters: {
        level: 'Level',
        topic: 'Topic',
        all: 'All',
      },
      noResults: 'No courses found with the selected filters.',
      clearFilters: 'Clear Filters',
      cta: {
        title: 'Can\'t find what you\'re looking for?',
        subtitle: 'Book a personalized 1-on-1 mentorship with our experts',
        viewMentorships: 'View Mentorships',
      },
      courseContent: 'Course Content',
      duration: 'Duration',
      certificate: 'Certificate',
      included: 'Included',
      instructor: 'Instructor',
      professionalTrader: 'Professional Trader & Educator',
      topicsAndTechnologies: 'Technologies and Topics',
      includedBenefits: 'Included Benefits',
      oneTimePaymentAccess: 'One-time payment - Lifetime access',
      enrollNow: 'Enroll Now',
    },
    mentorshipsPage: {
      badge: 'Personalized Learning',
      title: 'Mentorship',
      titleHighlight: 'Programs',
      subtitle: 'Learn directly from professional traders. Choose between personalized individual sessions or group workshops.',
      benefits: {
        videoHD: 'HD Video Calls',
        continuousSupport: 'Continuous Support',
        flexibleSchedule: 'Flexible Schedule',
        certificate: 'Certificate',
      },
      individual: {
        title: 'Individual',
        titleHighlight: '1-on-1 Mentorships',
        subtitle: 'Personalized attention with your mentor. Choose the plan that best suits your goals',
        topicsTitle: 'Available Mentorship Topics:',
        topics: {
          trading: 'General Trading',
          fxdreema: 'fxDreema',
          sqx: 'StrategyQuant (SQX)',
          mt45: 'MetaTrader 4/5',
          python: 'Python',
          pinescript: 'PineScript & TradingView',
          mql5: 'MQL5',
          performance: 'Performance Review',
          darwinex: 'Darwinex & Darwinex Zero',
        },
      },
      groupSessions: {
        title: 'Group',
        titleHighlight: 'Mentorships',
        subtitle: 'Interactive group sessions. Learn with other traders and share experiences.',
        level: 'Level',
        duration: 'Duration',
        spotsLeft: 'spots available',
        spotsOf: 'of',
        topicsTitle: 'Topics to Cover:',
        soldOut: 'Sold Out',
        reserveButton: 'Reserve Spot',
        whyGroup: 'Why choose group mentorships?',
        whyGroupBenefits: {
          networking: {
            title: 'Networking',
            desc: 'Meet other traders and build your professional network',
          },
          affordable: {
            title: 'Affordable Price',
            desc: 'Up to 70% cheaper than individual sessions',
          },
          recordings: {
            title: 'Recordings',
            desc: 'Lifetime access to all recordings',
          },
        },
      },
      howItWorks: {
        title: 'How Does it Work?',
        subtitle: 'Simple and straightforward process to start your mentorship',
        steps: {
          step1: {
            title: 'Choose Your Mentor',
            desc: 'Select the professional that best fits your goals and level',
          },
          step2: {
            title: 'Book a Date',
            desc: 'Choose the time that works best for you. Flexible availability',
          },
          step3: {
            title: 'Prepare Your Session',
            desc: 'Send your questions, code, or project beforehand to maximize the session',
          },
          step4: {
            title: 'Learn and Grow',
            desc: 'Live 1-on-1 session with personalized feedback and action plan',
          },
        },
      },
      faqs: {
        title: 'Frequently Asked Questions',
        items: {
          q1: {
            q: 'Do I need prior knowledge?',
            a: 'Not necessarily. We have specialized mentors for all levels, from beginners to advanced traders. During the first session, we will assess your level and design a personalized plan.',
          },
          q2: {
            q: 'Are sessions recorded?',
            a: 'Yes, all sessions are automatically recorded and available for you to review anytime. The material is yours forever.',
          },
          q3: {
            q: 'What platforms and tools will I learn?',
            a: 'It depends on your mentor and specialization. Python, TradingView, MetaTrader, QuantConnect, Interactive Brokers API, and more. Everything is tailored to your goals.',
          },
          q4: {
            q: 'Can I change mentors?',
            a: 'Absolutely. If you feel another mentor better suits your needs, you can switch at no additional cost.',
          },
          q5: {
            q: 'Is there a results guarantee?',
            a: 'Trading has inherent risks and we cannot guarantee profitability. What we do guarantee is teaching you the best practices, tools, and strategies used by professionals.',
          },
          q6: {
            q: 'Will I receive a certificate?',
            a: 'Yes, upon completing the monthly mentorship program, you will receive a verifiable certificate that validates your knowledge in algorithmic trading.',
          },
        },
      },
      cta: {
        title: 'Ready to take the next step?',
        subtitle: 'Join more than 5,000 students who are already trading professionally',
        startButton: 'Start Mentorship',
        callButton: 'Schedule Free Call',
      },
      labels: {
        experience: 'Experience',
        students: 'Students',
        rating: 'Rating',
        sessions: 'Sessions',
        session: 'Session',
        priceFrom: 'From',
        specialties: 'Specialties',
        achievements: 'Achievements',
        viewProfile: 'View Profile',
        bookSession: 'Book Session',
      },
      mentors: {
        title: 'Our',
        titleHighlight: 'Professionals',
        subtitle: 'Learn from the best. All our mentors have real market experience and have managed millions of dollars.',
      },
    },
    loginPage: {
      badge: 'Platform Access',
      welcome: 'Welcome to',
      title: 'Sign In',
      subtitle: 'Access your account to continue your learning journey and manage your trading strategies.',
      description: 'Enter your credentials to access',
      form: {
        email: 'Email Address',
        emailPlaceholder: 'your@email.com',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        forgotPassword: 'Forgot password?',
        rememberMe: 'Remember me',
        submit: 'Sign In',
        loading: 'Signing in...',
      },
      benefits: {
        courses: {
          title: 'Access to Courses',
          desc: 'Over 30 hours of premium algorithmic trading content',
        },
        portfolio: {
          title: 'Portfolio Management',
          desc: 'Manage and track the performance of your strategies in real-time',
        },
        community: {
          title: 'Exclusive Community',
          desc: 'Connect with professional traders and share knowledge',
        },
      },
      noAccount: "Don't have an account?",
      signUp: 'Sign up here',
    },
    registerPage: {
      badge: 'Join Today',
      welcome: 'Join',
      title: 'Create Account',
      subtitle: 'Start your algorithmic trading journey with access to professional courses, mentorships, and verified strategies.',
      description: 'Create your free account in seconds',
      form: {
        name: 'Full Name',
        namePlaceholder: 'John Doe',
        email: 'Email Address',
        emailPlaceholder: 'your@email.com',
        password: 'Password',
        passwordPlaceholder: 'Minimum 8 characters',
        passwordHint: 'Use at least 8 characters with letters and numbers',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Enter your password again',
        acceptTerms: 'I accept the',
        terms: 'Terms of Service',
        and: 'and',
        privacy: 'Privacy Policy',
        submit: 'Create Account',
        loading: 'Creating account...',
        passwordMismatch: 'Passwords do not match',
        acceptTermsRequired: 'You must accept the terms and conditions',
      },
      benefits: {
        secure: {
          title: 'Secure Registration',
          desc: 'Your data is protected with bank-level encryption',
        },
        instant: {
          title: 'Instant Access',
          desc: 'Start learning immediately after signing up',
        },
        support: {
          title: '24/7 Support',
          desc: 'Team available to help you anytime',
        },
      },
      stats: {
        students: '+5,000 traders',
        studentsText: 'already trust PQ Trader for their education',
      },
      haveAccount: 'Already have an account?',
      signIn: 'Sign in',
    },
    strategyquantPage: {
      hero: {
        badge: 'Professional Tool',
        title: 'Master',
        titleHighlight: 'StrategyQuant X',
        subtitle: 'The most advanced algorithmic trading platform to create, test, and optimize winning strategies without coding.',
        cta: 'View Course',
      },
      features: {
        title: 'Key Features',
        ai: {
          title: 'Artificial Intelligence',
          description: 'Generate strategies automatically using advanced genetic algorithms',
        },
        noCoding: {
          title: 'No Coding Required',
          description: 'Create complex strategies without writing a single line of code',
        },
        robustness: {
          title: 'Robustness Tests',
          description: 'Validate your strategies with Walk-Forward, Monte Carlo, and more',
        },
        multiMarket: {
          title: 'Multi-Market',
          description: 'Trade Forex, Futures, Stocks, and Cryptocurrencies',
        },
        optimization: {
          title: 'Advanced Optimization',
          description: 'Find the best parameters with multidimensional optimization',
        },
        portfolios: {
          title: 'Portfolio Management',
          description: 'Combine multiple strategies to reduce risk and maximize returns',
        },
      },
      process: {
        title: 'Creation Process',
        step1: {
          title: 'Generation',
          description: 'AI generates thousands of strategies based on your criteria',
        },
        step2: {
          title: 'Validation',
          description: 'Filter and validate using advanced robustness tests',
        },
        step3: {
          title: 'Export',
          description: 'Export to MT4/MT5, NinjaTrader, TradingView, and more',
        },
        step4: {
          title: 'Management',
          description: 'Monitor and manage your live strategies',
        },
      },
      benefits: {
        title: 'Why StrategyQuant X?',
        subtitle: 'The preferred tool for professional traders',
      },
    },
    portafoliosPage: {
      hero: {
        badge: 'Algorithmic Trading',
        title: 'Quantitative',
        titleHighlight: 'Trading Portfolios',
        subtitle: 'Proven professional strategies with real results. Follow our portfolios or learn to create your own.',
      },
      stats: {
        totalReturn: 'Total Return',
        sharpeRatio: 'Sharpe Ratio',
        maxDrawdown: 'Max Drawdown',
        winRate: 'Win Rate',
      },
      performance: {
        title: 'Monthly Performance',
        year: 'Year',
        month: 'Month',
        return: 'Return',
      },
      benefits: {
        title: 'Why Our Portfolios?',
        subtitle: 'Transparency and verifiable results',
      },
      globalStats: {
        title: 'Global Statistics',
        subtitle: 'Summary of all our systems performance',
        avgReturn: 'Average Return',
        lastYear: 'Last year',
        sharpe: 'Sharpe Ratio',
        average: 'Average',
        maxDD: 'Max Drawdown',
        winRate: 'Win Rate',
      },
      transparency: {
        title: 'Full Transparency',
        text1: 'All track records shown are verified by Darwinex, a platform regulated by the FCA (Financial Conduct Authority) of the United Kingdom.',
        text2: 'Past results do not guarantee future returns. Trading involves risks and may result in capital losses.',
      },
      access: {
        title: 'Access Our',
        titleHighlight: 'Portfolios',
        subtitle: 'Algorithmic trading systems with verified track record. Choose the plan that fits your capital.',
        verifiedDarwinex: 'Verified Darwinex',
        compatibleMT: 'Compatible MetaTrader',
        fundingReady: 'Funding Ready',
      },
      purchase: {
        button: 'Purchase',
      },
      pricing: {
        rentLabel: 'Rental Price (1 year)',
        buyLabel: 'Purchase Price (Lifetime)',
        rentButton: 'Rent',
      },
      features: {
        monthlyOptimization: 'Monthly optimization',
        riskManagement: 'Risk management',
        support247: '24/7 Support',
        profitability: 'Profitability',
        drawdown: 'Drawdown',
      },
      additional: {
        title: 'Suitable for Darwinex and Funded Accounts',
        subtitle: 'All our portfolios are optimized to operate on verified real accounts.',
        optimization: 'Monthly optimization included in rental',
      },
    },
    alquileresPage: {
      hero: {
        badge: 'Premium Access',
        title: 'Strategy',
        titleHighlight: 'Rentals',
        subtitle: 'Access our best algorithmic trading strategies without developing them yourself.',
        cta: 'View Plans',
      },
      plans: {
        title: 'Rental Plans',
        subtitle: 'Choose the plan that best fits your needs',
        individual: {
          name: 'Individual',
          price: '50',
          period: 'month',
          description: 'Perfect to start with rentals',
          features: [
            '1 strategy of your choice',
            'Updates included',
            'Email support',
            'Complete documentation',
            'No commitment',
          ],
          cta: 'Rent Now',
        },
        portfolioFondeo: {
          name: 'Funding Portfolio',
          price: '120',
          period: 'month',
          description: 'For traders seeking diversification',
          popular: 'Most Popular',
          features: [
            '7 strategies included',
            'Optimized portfolio',
            'Priority support',
            'Automatic updates',
            'Assisted setup',
            'Risk analysis',
          ],
          cta: 'Rent Portfolio',
          savings: 'Save €230/month',
        },
        portfolioDarwinex: {
          name: 'Darwinex Portfolio',
          price: '200',
          period: 'month',
          description: 'Maximum diversification and performance',
          features: [
            '15 premium strategies',
            'Elite portfolio',
            '24/7 dedicated support',
            'Monthly rebalancing',
            'Access to new strategies',
            '1-on-1 setup session',
            'Monthly reports',
          ],
          cta: 'Rent Elite Portfolio',
          savings: 'Save €550/month',
        },
      },
      benefits: {
        title: 'Rental Benefits',
        subtitle: 'Everything you need to trade with confidence',
        benefit1: {
          title: 'Verified Track Record',
          description: 'All systems have verifiable real results on Darwinex',
        },
        benefit2: {
          title: 'Continuous Updates',
          description: 'Robots are constantly optimized according to market conditions',
        },
        benefit3: {
          title: 'Optimized for Funding',
          description: 'Specific configurations to pass funding challenges',
        },
        benefit4: {
          title: 'Professional Support',
          description: 'Technical team available 24/7 to solve any questions',
        },
      },
      whyRent: {
        title: 'Why rent instead of buying?',
      },
      stats: {
        title: 'Performance Statistics',
        subtitle: 'Verified results from our trading systems',
        fromMonth: 'From /month',
        verified: 'Verified',
        support: 'Support',
        winRate: 'Win Rate',
      },
      pricing: {
        bestValue: 'Best value',
        selectPeriod: 'Select a period above to continue',
      },
      cta: {
        title: 'Need help choosing?',
        subtitle: 'Schedule a free consultation with our experts',
        button: 'Talk to an Expert',
      },
    },
    blogPage: {
      hero: {
        badge: 'Educational Resources',
        title: 'Algorithmic',
        titleHighlight: 'Trading Blog',
        subtitle: 'Learn about quantitative trading, tools, strategies, and best practices.',
      },
      categories: {
        all: 'All',
        beginners: 'Beginners',
        ml: 'Machine Learning',
        risk: 'Risk Management',
        tools: 'Tools',
        apis: 'APIs & Automation',
      },
      filters: {
        search: 'Search articles...',
        category: 'Category',
      },
      post: {
        readMore: 'Read more',
        readTime: 'min read',
        by: 'By',
      },
      featured: {
        title: 'Featured',
        subtitle: 'The most popular article of the week',
      },
      latest: {
        title: 'Latest Articles',
      },
      posts: {
        post1: {
          title: 'How to Start with Algorithmic Trading in 2025',
          excerpt: 'Complete guide for beginners who want to dive into the world of algorithmic trading.',
          author: 'Carlos Martinez',
        },
        post2: {
          title: 'Python vs R: Which is Better for Trading?',
          excerpt: 'Detailed comparison between Python and R for quantitative analysis and strategy development.',
          author: 'Ana Garcia',
        },
        post3: {
          title: 'Machine Learning in Trading: Real Cases',
          excerpt: 'We explore 5 real ML use cases in algorithmic trading with code examples.',
          author: 'Roberto Silva',
        },
        post4: {
          title: 'Risk Management: The Pillar of Successful Trading',
          excerpt: 'Why 90% of traders fail due to poor risk management and how to avoid it.',
          author: 'Laura Fernandez',
        },
        post5: {
          title: 'Backtesting: Common Mistakes and How to Avoid Them',
          excerpt: 'The 7 most common backtesting mistakes that can ruin your results.',
          author: 'Miguel Torres',
        },
        post6: {
          title: 'Broker APIs: Integration Guide',
          excerpt: 'How to connect your strategy to Interactive Brokers, Alpaca and Binance.',
          author: 'David Lopez',
        },
        skoolPost: {
          title: 'Join Our Skool Community',
          excerpt: 'Discover our complete educational platform with courses, resources, mentorships and an active community of algorithmic traders.',
          author: 'PQ Trader Team',
        },
      },
      skool: {
        title: 'Skool Community: Algorithmic Trading',
        subtitle: 'Complete operational structure for quantitative traders',
        pillars: {
          academic: {
            title: '1. Academic Pillar',
            subtitle: 'High-value asynchronous content',
            items: [
              'Initiation Course: Quantitative fundamentals and market logic',
              'StrategyQuant Masterclass: Automatic strategy generation',
              'fxDreema Masterclass: Visual programming from basic to advanced',
              'Advanced Robustness Course: WFA, Monte Carlo and portfolio management'
            ]
          },
          resources: {
            title: '2. Technical Resources Pillar',
            subtitle: 'Downloadable tools library',
            items: [
              'Algorithm Repository: .fxd and .sqx templates ready to use',
              'Snippets & Blueprints: Breakeven managers, filters, equity closures',
              'Systems Post-Mortem: Analysis of failed strategies',
              'Partners Directory: VPS, Data feeds with exclusive benefits'
            ]
          },
          interaction: {
            title: '3. Interaction Pillar',
            subtitle: 'Community and live sessions',
            items: [
              'Level 1 Live: Technical introduction and basic Q&A (Public/Free)',
              'Level 2 Live: Complex architecture and advanced errors (Exclusive)',
              'Group Mentorships: Monthly follow-up and technical coaching',
              'Expert Interviews: Institutional traders and success cases'
            ]
          },
          gamification: {
            title: '4. Gamification Pillar',
            subtitle: 'Incentives and continuous improvement',
            items: [
              'Monthly Competitions: Tournaments in demo and funding accounts',
              'Peer-Review Room: Critical feedback before live trading',
              'Performance Ranking: Leaderboard based on activity'
            ]
          },
          premium: {
            title: '5. Premium Services',
            subtitle: 'High-value personalization',
            items: [
              '1-on-1 Mentorships: Consulting in Python, MQL5, PineScript',
              'Deep Review: Portfolio audit on Darwinex',
              'Custom Development: Tailored solutions for your trading'
            ]
          }
        },
        levels: {
          title: 'Membership Levels',
          free: {
            title: 'Free',
            badge: 'Free',
            features: [
              'Module 1 of basic course',
              'Simple monthly live session',
              'Access to basic resources',
              'Discord community'
            ]
          },
          premium: {
            title: 'Premium',
            badge: 'Subscription',
            features: [
              'All complete courses',
              'Educational robots library',
              'Review and setup channels',
              'Complex monthly live session',
              'Priority access to events'
            ]
          },
          vip: {
            title: 'VIP / Mastermind',
            badge: 'High Ticket',
            features: [
              'Unlimited 1-on-1 mentorships',
              'Private channel with founders',
              'Personalized systems review',
              'Early access to new content',
              'Exclusive networking sessions'
            ]
          }
        },
        cta: {
          join: 'Join Skool',
          learnMore: 'Learn More'
        }
      },
    },
  },
};

interface LanguageStore {
  language: Locale;
  setLanguage: (lang: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'es',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'pq-trader-language',
      skipHydration: true,
    }
  )
);

export function useLanguage() {
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }
    
    return typeof value === 'string' ? value : key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  // Return default language on server/initial render to avoid hydration errors
  if (!mounted) {
    return { language: 'es' as Locale, setLanguage, toggleLanguage, t, translations: translations['es'] };
  }

  return { language, setLanguage, toggleLanguage, t, translations: translations[language] };
}

export function detectUserLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'es';
}
