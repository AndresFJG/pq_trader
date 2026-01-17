'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const chatResponses = {
  es: {
    welcome: '¡Hola! 👋 Soy el asistente virtual de PQ Trader. Estoy aquí para ayudarte con:\n\n• Información sobre cursos y mentorías\n• Detalles de precios y planes\n• Requisitos y metodología\n• Proceso de inscripción\n\n¿En qué puedo ayudarte hoy?',
    courses: {
      general: '📚 **Nuestros Cursos de Trading Algorítmico:**\n\n🐍 **Python para Trading** - $299\n→ 40 horas | Nivel: Principiante-Intermedio\n→ Aprende a crear bots desde cero\n→ Incluye: Backtesting + Live Trading\n\n📊 **StrategyQuant Masterclass** - $249\n→ 30 horas | Sin programación\n→ Genera estrategias automáticamente\n→ Optimización + Walk-Forward Analysis\n\n🛡️ **Gestión de Riesgo Avanzada** - $199\n→ 20 horas | Todos los niveles\n→ Position Sizing + Money Management\n→ Técnicas profesionales de protección\n\n✨ Todos incluyen: Acceso de por vida, certificado, soporte y actualizaciones gratuitas.',
      python: '🐍 **Curso Python para Trading - $299**\n\n**Qué aprenderás:**\n• Fundamentos de Python desde cero\n• Análisis de datos con Pandas/NumPy\n• Indicadores técnicos personalizados\n• Backtesting de estrategias\n• Integración con APIs (Binance, Alpaca)\n• Deploy de bots en la nube\n\n**Duración:** 40 horas\n**Nivel:** Principiante a Intermedio\n**Incluye:** 15 proyectos prácticos + código fuente\n\n¿Te gustaría ver el temario completo o inscribirte?',
      sq: '📊 **StrategyQuant Masterclass - $249**\n\n**Sin programar, resultados profesionales:**\n• Generación automática de estrategias\n• Robustness Testing avanzado\n• Walk-Forward Optimization\n• Monte Carlo Analysis\n• Portfolio Management\n\n**Duración:** 30 horas\n**Club StrategyQuant:** $150/mes (4 webinars + plantillas)\n\n**Ideal para:** Traders que no saben programar pero quieren automatizar\n\n¿Quieres unirte al Club o comprar el curso?',
      risk: '🛡️ **Gestión de Riesgo Avanzada - $199**\n\n**Protege tu capital como los profesionales:**\n• Kelly Criterion aplicado\n• Position Sizing dinámico\n• Drawdown Management\n• Correlación de activos\n• Portfolio Heat Mapping\n\n**Duración:** 20 horas\n**Casos reales:** Análisis de cuentas de $10K a $500K\n\n**Perfecto para:** Traders que quieren preservar capital y crecer consistentemente.\n\nEste curso puede evitarte pérdidas de miles de dólares. ¿Te interesa?'
    },
    mentorships: '👨‍🏫 **Mentorías Personalizadas 1-a-1:**\n\n**Sesión Individual** - $150\n→ 90 minutos de consultoría privada\n→ Revisión de tus estrategias\n→ Plan de acción personalizado\n\n**Pack 4 Sesiones** - $500 ($125 c/u)\n→ Ahorra $100 vs sesiones individuales\n→ Seguimiento mensual\n→ Soporte entre sesiones por email\n\n**Club Mentoría Premium** - $400/mes\n→ 2 sesiones mensuales\n→ Grupo privado de Telegram\n→ Acceso a todas las grabaciones\n\n**Nuestros mentores:**\n• +10 años de experiencia\n• Track record verificado en Darwinex\n• Especialistas en Python, StrategyQuant y Risk\n\n¿Qué tipo de mentoría te interesa?',
    pricing: {
      general: '💰 **Precios PQ Trader:**\n\n**CURSOS:**\n📚 Python Trading: $299\n📊 StrategyQuant: $249\n🛡️ Gestión Riesgo: $199\n🎁 Pack 3 Cursos: $599 (ahorra $148)\n\n**MENTORÍAS:**\n👤 Sesión Individual: $150\n📦 Pack 4 Sesiones: $500\n⭐ Club Premium: $400/mes\n\n**MEMBRESÍAS:**\n🎯 Club StrategyQuant: $150/mes\n💎 Acceso Total (todos los cursos): $997/año\n\n**ALQUILER ESTRATEGIAS:**\n🤖 Desde $99/mes (según rendimiento)\n\n💳 Aceptamos: Tarjeta, PayPal, Mercado Pago, PIX\n🎁 Garantía 30 días: No te gusta, te devolvemos el dinero\n\n¿Qué opción te interesa más?',
      discounts: '🎁 **Promociones Activas:**\n\n✨ **Primera Compra:** 15% OFF con código WELCOME15\n📚 **Pack 3 Cursos:** $599 (ahorra $148)\n👥 **Referidos:** 20% de comisión por cada venta\n🎓 **Estudiantes:** 25% descuento (con credencial)\n\n💡 **Ofertas Especiales:**\n• Compra 1 curso → 2do curso a 50%\n• Club anual → 2 meses gratis\n• Mentorías grupales → desde $75/persona\n\n⏰ **Oferta limitada:** Expira en 48 horas\n\n¿Quieres aplicar algún descuento?'
    },
    requirements: '📋 **Requisitos para empezar:**\n\n**Cursos:**\n✅ No necesitas experiencia previa en trading\n✅ Computadora con Windows/Mac/Linux\n✅ Conexión a internet estable\n✅ 5-10 horas semanales de dedicación\n\n**Curso Python:**\n✅ No necesitas saber programar\n✅ Te enseñamos desde cero\n\n**StrategyQuant:**\n✅ Cero código requerido\n✅ Interface visual intuitiva\n\n**Ideal si:**\n• Quieres dejar de perder dinero en trading manual\n• Buscas ingresos pasivos con bots\n• Tienes cuenta de trading (demo o real)\n\n¿Cumples con los requisitos? ¡Empecemos!',
    support: '🤝 **Soporte y Garantías:**\n\n**Incluido en todos los cursos:**\n✅ Soporte por email (respuesta <24h)\n✅ Grupo privado de Discord\n✅ Sesiones Q&A mensuales en vivo\n✅ Actualizaciones de contenido gratis\n\n**Garantía 30 días:**\n💯 No te gusta el curso → Reembolso 100%\n📧 Sin preguntas, sin complicaciones\n\n**Certificación:**\n🎓 Al completar el curso\n🌐 Verificable en LinkedIn\n📜 Reconocido internacionalmente\n\n**Acceso:**\n♾️ De por vida a los materiales\n📱 Desde cualquier dispositivo\n⬇️ Descarga de recursos\n\n¿Tienes alguna duda específica sobre el soporte?',
    schedule: '📅 **Modalidad de Estudio:**\n\n**Cursos Online:**\n🎥 100% grabado, ve a tu ritmo\n⏰ Acceso 24/7\n📱 Desde PC, tablet o móvil\n⏸️ Pausa y retoma cuando quieras\n\n**Tiempo estimado:**\n• 2-3 meses (ritmo normal)\n• 1 mes (ritmo intensivo)\n• 6 meses (ritmo tranquilo)\n\n**Webinars en vivo:**\n📍 Último viernes de cada mes\n🕐 20:00 h (horario España)\n🌎 Grabaciones disponibles\n\n**Mentorías:**\n📆 Agendar según disponibilidad\n🌍 Zoom/Google Meet\n⏰ Flexibilidad horaria\n\n¿Prefieres empezar ya o agendar una demo gratuita?',
    payment: '💳 **Métodos de Pago Disponibles:**\n\n**Internacional:**\n💳 Tarjetas (Visa, Mastercard, Amex)\n💰 PayPal\n🏦 Transferencia bancaria\n\n**América Latina:**\n🛒 Mercado Pago\n🇧🇷 PIX (Brasil)\n\n**Europa:**\n🏦 SEPA\n💶 Transferencia IBAN\n\n**Opciones de pago:**\n✅ Pago único\n✅ 3 cuotas sin interés (cursos)\n✅ Suscripción mensual (Club)\n\n**Seguridad:**\n🔒 Encriptación SSL 256-bit\n✅ PCI-DSS Compliant\n🛡️ No guardamos datos de tarjeta\n\n¿Listo para procesar el pago?',
    results: '📊 **Resultados Verificados:**\n\n**Track Records Reales (Darwinex):**\n📈 PSI Strategy: +39.88% (3 años)\n📈 QM2 Strategy: +22.71% (2 años)\n📈 RiskPro: +18.34% (18 meses)\n\n**Todos con:**\n✅ Drawdown <10%\n✅ Sharpe Ratio >2.0\n✅ Win Rate >60%\n\n**Testimonios de Alumnos:**\n⭐⭐⭐⭐⭐ 4.9/5 (482 reviews)\n\n💬 "En 3 meses recuperé la inversión" - Carlos M.\n💬 "Mejor curso de trading que he tomado" - Ana L.\n💬 "El soporte es excepcional" - David R.\n\n🎥 Ver casos de éxito: pqtrader.com/testimonios\n\n¿Quieres ver más detalles de rendimiento?',
    contact: '📞 **Contacto Directo:**\n\n**WhatsApp:**\n📱 +34 XXX XXX XXX\n⏰ Lun-Vie 9:00-18:00 h\n\n**Email:**\n📧 info@pqtrader.com\n⚡ Respuesta <24h\n\n**Redes Sociales:**\n📸 Instagram: @pqtrader\n🐦 Twitter: @pqtrader\n💼 LinkedIn: PQ Trader\n📺 YouTube: PQ Trader Academy\n\n**Agendar llamada gratuita:**\n🗓️ calendly.com/pqtrader\n⏱️ 15 minutos de consultoría gratis\n\n¿Prefieres que te contactemos nosotros?',
    fallback: '🤔 Interesante pregunta. Para darte la respuesta más precisa y personalizada, te recomiendo:\n\n1️⃣ **WhatsApp:** Respuesta inmediata de nuestro equipo\n2️⃣ **Email:** info@pqtrader.com\n3️⃣ **Llamada gratuita:** 15 min de consultoría\n\n📚 También puedes:\n• Ver catálogo completo de cursos\n• Leer testimonios de alumnos\n• Explorar nuestro blog educativo\n\n¿Hay algo más en lo que pueda ayudarte ahora?'
  },
  en: {
    welcome: '¡Hello! 👋 I\'m PQ Trader\'s virtual assistant. I\'m here to help you with:\n\n• Course and mentorship information\n• Pricing and plans details\n• Requirements and methodology\n• Enrollment process\n\nHow can I help you today?',
    courses: {
      general: '📚 **Our Algorithmic Trading Courses:**\n\n🐍 **Python for Trading** - $299\n→ 40 hours | Level: Beginner-Intermediate\n→ Learn to create bots from scratch\n→ Includes: Backtesting + Live Trading\n\n📊 **StrategyQuant Masterclass** - $249\n→ 30 hours | No coding required\n→ Auto-generate strategies\n→ Optimization + Walk-Forward Analysis\n\n🛡️ **Advanced Risk Management** - $199\n→ 20 hours | All levels\n→ Position Sizing + Money Management\n→ Professional protection techniques\n\n✨ All include: Lifetime access, certificate, support and free updates.',
      python: '🐍 **Python for Trading Course - $299**\n\n**What you\'ll learn:**\n• Python fundamentals from zero\n• Data analysis with Pandas/NumPy\n• Custom technical indicators\n• Strategy backtesting\n• API integration (Binance, Alpaca)\n• Cloud bot deployment\n\n**Duration:** 40 hours\n**Level:** Beginner to Intermediate\n**Includes:** 15 practical projects + source code\n\nWould you like to see the full syllabus or enroll?',
      sq: '📊 **StrategyQuant Masterclass - $249**\n\n**No coding, professional results:**\n• Automatic strategy generation\n• Advanced Robustness Testing\n• Walk-Forward Optimization\n• Monte Carlo Analysis\n• Portfolio Management\n\n**Duration:** 30 hours\n**StrategyQuant Club:** $150/month (4 webinars + templates)\n\n**Perfect for:** Traders who can\'t code but want to automate\n\nWant to join the Club or buy the course?',
      risk: '🛡️ **Advanced Risk Management - $199**\n\n**Protect your capital like the pros:**\n• Applied Kelly Criterion\n• Dynamic Position Sizing\n• Drawdown Management\n• Asset Correlation\n• Portfolio Heat Mapping\n\n**Duration:** 20 hours\n**Real cases:** Account analysis from $10K to $500K\n\n**Perfect for:** Traders who want to preserve capital and grow consistently.\n\nThis course could save you thousands of dollars in losses. Interested?'
    },
    mentorships: '👨‍🏫 **Personalized 1-on-1 Mentorships:**\n\n**Individual Session** - $150\n→ 90 minutes private consulting\n→ Review your strategies\n→ Personalized action plan\n\n**4-Session Pack** - $500 ($125 each)\n→ Save $100 vs individual sessions\n→ Monthly follow-up\n→ Email support between sessions\n\n**Premium Mentorship Club** - $400/month\n→ 2 monthly sessions\n→ Private Telegram group\n→ Access to all recordings\n\n**Our mentors:**\n• 10+ years of experience\n• Verified track record on Darwinex\n• Specialists in Python, StrategyQuant and Risk\n\nWhich type of mentorship interests you?',
    pricing: {
      general: '💰 **PQ Trader Pricing:**\n\n**COURSES:**\n📚 Python Trading: $299\n📊 StrategyQuant: $249\n🛡️ Risk Management: $199\n🎁 3-Course Bundle: $599 (save $148)\n\n**MENTORSHIPS:**\n👤 Individual Session: $150\n📦 4-Session Pack: $500\n⭐ Premium Club: $400/month\n\n**MEMBERSHIPS:**\n🎯 StrategyQuant Club: $150/month\n💎 Total Access (all courses): $997/year\n\n**STRATEGY RENTAL:**\n🤖 From $99/month (based on performance)\n\n💳 We accept: Card, PayPal, Mercado Pago, PIX\n🎁 30-day guarantee: Don\'t like it, we refund you\n\nWhich option interests you most?',
      discounts: '🎁 **Active Promotions:**\n\n✨ **First Purchase:** 15% OFF with code WELCOME15\n📚 **3-Course Bundle:** $599 (save $148)\n👥 **Referrals:** 20% commission per sale\n🎓 **Students:** 25% discount (with ID)\n\n💡 **Special Offers:**\n• Buy 1 course → 2nd course 50% off\n• Annual club → 2 months free\n• Group mentorships → from $75/person\n\n⏰ **Limited offer:** Expires in 48 hours\n\nWant to apply a discount?'
    },
    requirements: '📋 **Requirements to start:**\n\n**Courses:**\n✅ No prior trading experience needed\n✅ Computer with Windows/Mac/Linux\n✅ Stable internet connection\n✅ 5-10 hours weekly dedication\n\n**Python Course:**\n✅ No coding knowledge required\n✅ We teach from scratch\n\n**StrategyQuant:**\n✅ Zero code required\n✅ Intuitive visual interface\n\n**Ideal if:**\n• Want to stop losing money in manual trading\n• Looking for passive income with bots\n• Have trading account (demo or real)\n\nDo you meet the requirements? Let\'s start!',
    support: '🤝 **Support and Guarantees:**\n\n**Included in all courses:**\n✅ Email support (response <24h)\n✅ Private Discord group\n✅ Monthly live Q&A sessions\n✅ Free content updates\n\n**30-day guarantee:**\n💯 Don\'t like the course → 100% refund\n📧 No questions, no complications\n\n**Certification:**\n🎓 Upon course completion\n🌐 Verifiable on LinkedIn\n📜 Internationally recognized\n\n**Access:**\n♾️ Lifetime access to materials\n📱 From any device\n⬇️ Resource downloads\n\nAny specific questions about support?',
    schedule: '📅 **Study Mode:**\n\n**Online Courses:**\n🎥 100% recorded, go at your pace\n⏰ 24/7 access\n📱 From PC, tablet or mobile\n⏸️ Pause and resume whenever\n\n**Estimated time:**\n• 2-3 months (normal pace)\n• 1 month (intensive pace)\n• 6 months (relaxed pace)\n\n**Live Webinars:**\n📍 Last Friday of each month\n🕐 20:00 h (Spain time)\n🌎 Recordings available\n\n**Mentorships:**\n📆 Schedule by availability\n🌍 Zoom/Google Meet\n⏰ Flexible schedule\n\nPrefer to start now or schedule a free demo?',
    payment: '💳 **Available Payment Methods:**\n\n**International:**\n💳 Cards (Visa, Mastercard, Amex)\n💰 PayPal\n🏦 Bank transfer\n\n**Latin America:**\n🛒 Mercado Pago\n🇧🇷 PIX (Brazil)\n\n**Europe:**\n🏦 SEPA\n💶 IBAN transfer\n\n**Payment options:**\n✅ One-time payment\n✅ 3 interest-free installments (courses)\n✅ Monthly subscription (Club)\n\n**Security:**\n🔒 256-bit SSL encryption\n✅ PCI-DSS Compliant\n🛡️ We don\'t store card data\n\nReady to process payment?',
    results: '📊 **Verified Results:**\n\n**Real Track Records (Darwinex):**\n📈 PSI Strategy: +39.88% (3 years)\n📈 QM2 Strategy: +22.71% (2 years)\n📈 RiskPro: +18.34% (18 months)\n\n**All with:**\n✅ Drawdown <10%\n✅ Sharpe Ratio >2.0\n✅ Win Rate >60%\n\n**Student Testimonials:**\n⭐⭐⭐⭐⭐ 4.9/5 (482 reviews)\n\n💬 "Recovered investment in 3 months" - Carlos M.\n💬 "Best trading course I\'ve taken" - Ana L.\n💬 "Support is exceptional" - David R.\n\n🎥 See success stories: pqtrader.com/testimonials\n\nWant to see more performance details?',
    contact: '📞 **Direct Contact:**\n\n**WhatsApp:**\n📱 +34 XXX XXX XXX\n⏰ Mon-Fri 9:00-18:00 h\n\n**Email:**\n📧 info@pqtrader.com\n⚡ Response <24h\n\n**Social Media:**\n📸 Instagram: @pqtrader\n🐦 Twitter: @pqtrader\n💼 LinkedIn: PQ Trader\n📺 YouTube: PQ Trader Academy\n\n**Schedule free call:**\n🗓️ calendly.com/pqtrader\n⏱️ 15 minutes free consulting\n\nPrefer we contact you?',
    fallback: '🤔 Interesting question. To give you the most accurate and personalized answer, I recommend:\n\n1️⃣ **WhatsApp:** Immediate response from our team\n2️⃣ **Email:** info@pqtrader.com\n3️⃣ **Free call:** 15 min consulting\n\n📚 You can also:\n• View complete course catalog\n• Read student testimonials\n• Explore our educational blog\n\nAnything else I can help you with now?'
  }
};

export function AIChat() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: chatResponses[language].welcome,
      timestamp: new Date(),
      suggestions: [
        language === 'es' ? '¿Qué cursos ofrecen?' : 'What courses do you offer?',
        language === 'es' ? 'Precios y planes' : 'Pricing and plans',
        language === 'es' ? '¿Cómo funcionan las mentorías?' : 'How do mentorships work?',
        language === 'es' ? 'Ver resultados verificados' : 'See verified results'
      ]
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Actualizar mensaje de bienvenida cuando cambia el idioma
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{
        role: 'assistant',
        content: chatResponses[language].welcome,
        timestamp: new Date(),
        suggestions: [
          language === 'es' ? '¿Qué cursos ofrecen?' : 'What courses do you offer?',
          language === 'es' ? 'Precios y planes' : 'Pricing and plans',
          language === 'es' ? '¿Cómo funcionan las mentorías?' : 'How do mentorships work?',
          language === 'es' ? 'Ver resultados verificados' : 'See verified results'
        ]
      }]);
    }
  }, [language]);

  const getAutoResponse = (question: string): { content: string, suggestions?: string[] } => {
    const q = question.toLowerCase();
    const responses = chatResponses[language];

    // Cursos
    if (q.includes('curso') || q.includes('course') || q.includes('cursos') || q.includes('courses')) {
      if (q.includes('python')) {
        return {
          content: responses.courses.python,
          suggestions: language === 'es' 
            ? ['Ver temario completo', 'Inscribirme ahora', 'Hablar con un asesor']
            : ['See full syllabus', 'Enroll now', 'Speak with advisor']
        };
      }
      if (q.includes('strategyquant') || q.includes('sq')) {
        return {
          content: responses.courses.sq,
          suggestions: language === 'es'
            ? ['Unirme al Club', 'Comprar curso', '¿Necesito programar?']
            : ['Join the Club', 'Buy course', 'Do I need to code?']
        };
      }
      if (q.includes('riesgo') || q.includes('risk')) {
        return {
          content: responses.courses.risk,
          suggestions: language === 'es'
            ? ['Me interesa', 'Ver casos de éxito', 'Más información']
            : ['I\'m interested', 'See success cases', 'More info']
        };
      }
      return {
        content: responses.courses.general,
        suggestions: language === 'es'
          ? ['Python', 'StrategyQuant', 'Gestión de Riesgo', 'Pack 3 cursos']
          : ['Python', 'StrategyQuant', 'Risk Management', '3-course bundle']
      };
    }

    // Mentorías
    if (q.includes('mentoría') || q.includes('mentorías') || q.includes('mentor') || q.includes('mentorship')) {
      return {
        content: responses.mentorships,
        suggestions: language === 'es'
          ? ['Sesión individual', 'Pack 4 sesiones', 'Club Premium', 'Agendar llamada']
          : ['Individual session', '4-session pack', 'Premium Club', 'Schedule call']
      };
    }

    // Precios
    if (q.includes('precio') || q.includes('costo') || q.includes('plan') || q.includes('price') || q.includes('pricing')) {
      if (q.includes('descuento') || q.includes('promoción') || q.includes('discount') || q.includes('promo')) {
        return {
          content: responses.pricing.discounts,
          suggestions: language === 'es'
            ? ['Aplicar código WELCOME15', 'Ver pack 3 cursos', 'Programa de referidos']
            : ['Apply code WELCOME15', 'See 3-course bundle', 'Referral program']
        };
      }
      return {
        content: responses.pricing.general,
        suggestions: language === 'es'
          ? ['Ver descuentos', 'Métodos de pago', 'Garantía de reembolso']
          : ['See discounts', 'Payment methods', 'Refund guarantee']
      };
    }

    // Requisitos
    if (q.includes('requisito') || q.includes('necesito') || q.includes('requirement') || q.includes('need')) {
      return {
        content: responses.requirements,
        suggestions: language === 'es'
          ? ['Sí, empecemos', 'Ver cursos para principiantes', 'Agendar demo']
          : ['Yes, let\'s start', 'See beginner courses', 'Schedule demo']
      };
    }

    // Soporte
    if (q.includes('soporte') || q.includes('ayuda') || q.includes('garantía') || q.includes('support') || q.includes('help') || q.includes('guarantee')) {
      return {
        content: responses.support,
        suggestions: language === 'es'
          ? ['Contactar soporte', 'Ver garantía 30 días', 'Unirme a Discord']
          : ['Contact support', 'See 30-day guarantee', 'Join Discord']
      };
    }

    // Horarios
    if (q.includes('horario') || q.includes('cuándo') || q.includes('tiempo') || q.includes('schedule') || q.includes('when') || q.includes('time')) {
      return {
        content: responses.schedule,
        suggestions: language === 'es'
          ? ['Empezar ahora', 'Agendar demo gratuita', 'Ver calendario webinars']
          : ['Start now', 'Schedule free demo', 'See webinar calendar']
      };
    }

    // Pagos
    if (q.includes('pago') || q.includes('pagar') || q.includes('tarjeta') || q.includes('payment') || q.includes('pay') || q.includes('card')) {
      return {
        content: responses.payment,
        suggestions: language === 'es'
          ? ['Pagar con tarjeta', 'Ver cuotas disponibles', 'Mercado Pago / PIX']
          : ['Pay with card', 'See installments', 'Mercado Pago / PIX']
      };
    }

    // Resultados
    if (q.includes('resultado') || q.includes('track record') || q.includes('rendimiento') || q.includes('performance') || q.includes('testimonios') || q.includes('testimonials')) {
      return {
        content: responses.results,
        suggestions: language === 'es'
          ? ['Ver gráficos detallados', 'Leer testimonios', 'Casos de éxito']
          : ['See detailed charts', 'Read testimonials', 'Success stories']
      };
    }

    // Contacto
    if (q.includes('contacto') || q.includes('contactar') || q.includes('llamar') || q.includes('contact') || q.includes('call') || q.includes('whatsapp')) {
      return {
        content: responses.contact,
        suggestions: language === 'es'
          ? ['Enviar WhatsApp', 'Agendar llamada', 'Enviar email']
          : ['Send WhatsApp', 'Schedule call', 'Send email']
      };
    }

    // Python específico
    if (q.includes('python') || q.includes('programar') || q.includes('coding')) {
      return {
        content: responses.courses.python,
        suggestions: language === 'es'
          ? ['Ver proyectos incluidos', 'Inscribirme', '¿Es para principiantes?']
          : ['See included projects', 'Enroll', 'Is it for beginners?']
      };
    }

    // Respuesta por defecto
    return {
      content: responses.fallback,
      suggestions: language === 'es'
        ? ['Ver catálogo completo', 'Hablar con asesor', 'Leer testimonios', 'Ver precios']
        : ['See full catalog', 'Speak with advisor', 'Read testimonials', 'See pricing']
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Simular delay de escritura
    setTimeout(() => {
      const response = getAutoResponse(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      setShowSuggestions(true);
    }, 800);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    // Auto-enviar después de un pequeño delay
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <>
      {/* Chat Toggle Button - Mejorado */}
      {!isOpen && (
        <div className="fixed bottom-16 sm:bottom-20 left-4 z-40">
          <div className="relative">
            {/* Ping animation */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-profit"></span>
            </span>
            
            <button
              onClick={() => setIsOpen(true)}
              className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-profit to-profit/80 hover:from-profit/90 hover:to-profit rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
              aria-label={language === 'es' ? 'Abrir chat' : 'Open chat'}
            >
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-background transition-transform group-hover:scale-110" />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-background border-2 border-profit/40 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] sm:text-xs font-medium pointer-events-none">
                {language === 'es' ? '¿Necesitas ayuda? ¡Pregúntame!' : 'Need help? Ask me!'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-profit/40"></div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Chat Window - Mejorado */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 w-full sm:w-[340px] max-w-[calc(100vw-2rem)]">
          <Card className="border-2 border-profit/40 shadow-2xl bg-background/95 backdrop-blur-xl overflow-hidden">
            {/* Header mejorado con botón de cierre */}
            <div className="p-2 sm:p-2.5 bg-gradient-to-r from-profit/10 via-profit/5 to-transparent border-b border-profit/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-profit to-profit/80 flex items-center justify-center ring-2 ring-profit/20">
                      <Sparkles className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-background" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm">
                      {language === 'es' ? 'Asistente PQ Trader' : 'PQ Trader Assistant'}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      {language === 'es' ? 'Online • Respuesta instantánea' : 'Online • Instant response'}
                    </p>
                  </div>
                </div>
                {/* Botón de cierre prominente */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-loss/10 transition-all duration-200 hover:rotate-90 flex-shrink-0"
                  aria-label="Cerrar chat"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-loss transition-colors" />
                </button>
              </div>
            </div>

            {/* Messages con mejor espaciado */}
            <div className="h-[300px] sm:h-[350px] overflow-y-auto p-2.5 sm:p-3 space-y-2.5 sm:space-y-3 bg-surface/20">
              {messages.map((message, index) => (
                <div key={index}>
                  <div
                    className={`flex gap-2 sm:gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-gradient-to-br from-profit/20 to-profit/10 flex items-center justify-center flex-shrink-0 border border-profit/20">
                        <Bot className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-profit" />
                      </div>
                    )}
                    <div
                      className={`rounded-xl p-2 sm:p-2.5 max-w-[90%] sm:max-w-[85%] ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-profit to-profit/90 text-background shadow-md'
                          : 'bg-background/80 border border-border shadow-sm'
                      }`}
                    >
                      <p className="text-[10px] sm:text-[11px] whitespace-pre-line leading-relaxed">
                        {message.content}
                      </p>
                      <p className={`text-[8px] sm:text-[9px] mt-1 sm:mt-1.5 ${message.role === 'user' ? 'text-background/70' : 'text-muted-foreground'}`}>
                        {message.timestamp.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Suggestions después de mensaje del asistente */}
                  {message.role === 'assistant' && message.suggestions && showSuggestions && index === messages.length - 1 && (
                    <div className="mt-2 sm:mt-2.5 ml-8 sm:ml-9 space-y-1.5">
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">
                        {language === 'es' ? '💡 Sugerencias:' : '💡 Suggestions:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickQuestion(suggestion)}
                            className="text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-background border border-profit/30 hover:border-profit hover:bg-profit/10 transition-all hover:scale-105 shadow-sm font-medium"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 sm:gap-2.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-profit/20 to-profit/10 flex items-center justify-center border border-profit/20 flex-shrink-0">
                    <Bot className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-profit" />
                  </div>
                  <div className="bg-white dark:bg-background/80 border border-border rounded-xl p-2.5 sm:p-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-profit/60 rounded-full animate-bounce" />
                      <div className="w-2.5 h-2.5 bg-profit/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2.5 h-2.5 bg-profit/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input mejorado */}
            <div className="p-2 sm:p-2.5 border-t border-profit/20 bg-background">
              <div className="flex gap-1.5 sm:gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={language === 'es' ? 'Escribe tu pregunta...' : 'Type your question...'}
                  className="flex-1 bg-surface/50 border-2 border-border focus:border-profit rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-[11px] focus:outline-none focus:ring-2 focus:ring-profit/20 transition-all placeholder:text-muted-foreground/60"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-profit to-profit/80 hover:from-profit/90 hover:to-profit px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground mt-1.5 sm:mt-2 text-center flex items-center justify-center gap-2">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {language === 'es' 
                  ? 'Respuestas instantáneas • Disponible 24/7' 
                  : 'Instant answers • Available 24/7'}
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
