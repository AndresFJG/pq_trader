import { Metadata } from 'next';
import { RegionalDisclaimer } from '@/components/legal/RegionalDisclaimer';
import { KYCVerification } from '@/components/kyc/KYCVerification';
import { PaymentMethods } from '@/components/payments/PaymentMethods';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Globe, Shield, MessageCircle, CreditCard, Languages } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nuevas Funcionalidades',
  description: 'Explorar las nuevas funcionalidades de PQ Trader',
};

export default function NewFeaturesPage() {
  const features = [
    {
      icon: Shield,
      title: 'Disclaimers Regionales',
      description: 'Avisos legales adaptados automáticamente según tu ubicación (CFTC, CNMV, FCA, ESMA)',
      status: 'Implementado',
      color: 'text-profit',
    },
    {
      icon: CheckCircle2,
      title: 'Verificación KYC',
      description: 'Sistema completo de verificación de identidad con carga de documentos',
      status: 'Implementado',
      color: 'text-profit',
    },
    {
      icon: Globe,
      title: 'Cookies y GDPR',
      description: 'Banner de cookies personalizable con preferencias granulares',
      status: 'Implementado',
      color: 'text-profit',
    },
    {
      icon: Languages,
      title: 'Multi-idioma (i18n)',
      description: 'Soporte para Español, Inglés y Portugués con detección automática',
      status: 'Implementado',
      color: 'text-profit',
    },
    {
      icon: CreditCard,
      title: 'Pasarelas de Pago Locales',
      description: 'Mercado Pago, PIX, SEPA además de Stripe y PayPal',
      status: 'Implementado',
      color: 'text-profit',
    },
    {
      icon: MessageCircle,
      title: 'Chatbot con IA',
      description: 'Asistente virtual con respuestas automáticas sobre cursos y servicios',
      status: 'Implementado',
      color: 'text-profit',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-profit/5 to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nuevas Funcionalidades
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hemos implementado 7 nuevas funcionalidades para mejorar la experiencia, 
              cumplir con regulaciones y expandir nuestro alcance global
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 border-border hover:border-profit/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-profit/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {feature.description}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-profit/10 text-profit border border-profit/20">
                        {feature.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Disclaimer Demo */}
      <section className="py-16 px-4 bg-surface/30">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">
              1. Disclaimers Dinámicos por Región
            </h2>
            <p className="text-muted-foreground">
              Detecta automáticamente tu país y muestra el aviso legal correspondiente (CFTC, CNMV, FCA, ESMA, ASIC)
            </p>
          </div>
          <RegionalDisclaimer />
        </div>
      </section>

      {/* Cookie Banner Info */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">
              2. Banner de Cookies y GDPR
            </h2>
            <p className="text-muted-foreground mb-4">
              Cumplimiento GDPR con banner personalizable. Revisa la esquina inferior derecha para verlo.
            </p>
          </div>
          <Card className="border-2 border-border">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-profit flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Cookies Necesarias</p>
                    <p className="text-sm text-muted-foreground">
                      Esenciales para el funcionamiento del sitio (sesión, autenticación)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-profit flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Cookies Analíticas</p>
                    <p className="text-sm text-muted-foreground">
                      Google Analytics para entender el uso del sitio (opcional)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-profit flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Cookies de Marketing</p>
                    <p className="text-sm text-muted-foreground">
                      Para remarketing y anuncios personalizados (opcional)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* KYC Demo */}
      <section className="py-16 px-4 bg-surface/30">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">
              3. Verificación de Identidad (KYC)
            </h2>
            <p className="text-muted-foreground">
              Sistema completo de verificación KYC/AML para cumplimiento regulatorio
            </p>
          </div>
          <KYCVerification />
        </div>
      </section>

      {/* Payment Methods Demo */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">
              4. Pasarelas de Pago Locales
            </h2>
            <p className="text-muted-foreground">
              Métodos de pago adaptados a cada región: Mercado Pago (LATAM), PIX (Brasil), SEPA (EU)
            </p>
          </div>
          <PaymentMethods userCountry="ES" />
        </div>
      </section>

      {/* Multi-language Info */}
      <section className="py-16 px-4 bg-surface/30">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">
              5. Soporte Multi-idioma (i18n)
            </h2>
            <p className="text-muted-foreground mb-4">
              Traducción automática a Español, Inglés y Portugués
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-border">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">🇪🇸</div>
                  <h3 className="font-bold mb-2">Español</h3>
                  <p className="text-sm text-muted-foreground">
                    Idioma principal
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-border">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">🇬🇧</div>
                  <h3 className="font-bold mb-2">English</h3>
                  <p className="text-sm text-muted-foreground">
                    International markets
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-border">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">🇧🇷</div>
                  <h3 className="font-bold mb-2">Português</h3>
                  <p className="text-sm text-muted-foreground">
                    Mercado brasileiro
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Chat Info */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">
              6. Chatbot con IA
            </h2>
            <p className="text-muted-foreground mb-4">
              Asistente virtual disponible 24/7 para responder preguntas. 
              <strong> Revisa la esquina inferior izquierda para probarlo.</strong>
            </p>
          </div>
          <Card className="border-2 border-profit/40 bg-profit/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <MessageCircle className="h-8 w-8 text-profit flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">Funcionalidades del Chatbot</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-profit" />
                      Respuestas automáticas sobre cursos y precios
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-profit" />
                      Información sobre mentorías y Club StrategyQuant
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-profit" />
                      Preguntas frecuentes predefinidas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-profit" />
                      Historial de conversación
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-profit" />
                      Integración con WhatsApp (próximamente)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Theme Toggle Info */}
      <section className="py-16 px-4 bg-surface/30">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">
              7. Modo Claro/Oscuro Automático
            </h2>
            <p className="text-muted-foreground mb-4">
              Detección automática según la hora del día (6:00-20:00 = modo claro)
            </p>
          </div>
          <Card className="border-2 border-border">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <span className="text-2xl">☀️</span>
                    </div>
                    <h3 className="font-semibold">Modo Claro</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Activo de 6:00 AM a 8:00 PM
                  </p>
                </div>
                <div className="p-4 bg-surface/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <span className="text-2xl">🌙</span>
                    </div>
                    <h3 className="font-semibold">Modo Oscuro</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Activo de 8:00 PM a 6:00 AM
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Puedes cambiar manualmente el tema usando el botón en el header
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Próximas Funcionalidades
          </h2>
          <p className="text-muted-foreground mb-8">
            Estas son las funcionalidades que vienen en las próximas semanas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-surface/30 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">🔐 Sistema de Autenticación</h3>
              <p className="text-sm text-muted-foreground">
                Login, registro y dashboard de usuario
              </p>
            </div>
            <div className="p-6 bg-surface/30 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">🤝 Sistema de Afiliados</h3>
              <p className="text-sm text-muted-foreground">
                Gana comisiones recomendando PQ Trader
              </p>
            </div>
            <div className="p-6 bg-surface/30 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">📝 Blog SEO</h3>
              <p className="text-sm text-muted-foreground">
                10+ artículos optimizados para buscadores
              </p>
            </div>
            <div className="p-6 bg-surface/30 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">🎓 LMS Completo</h3>
              <p className="text-sm text-muted-foreground">
                Plataforma de aprendizaje con certificados
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
