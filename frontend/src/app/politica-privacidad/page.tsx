'use client';

import { Metadata } from 'next';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck, Mail, AlertCircle, FileText } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function PoliticaPrivacidadPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-profit/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-profit" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('privacyPolicy.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('privacyPolicy.subtitle')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('privacyPolicy.lastUpdated')}: 17 {t('privacyPolicy.january')} 2026
            </p>
          </div>

          <div className="space-y-6">
            {/* Introducción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.intro.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('privacyPolicy.intro.p1')}
                </p>
                <p className="text-muted-foreground">
                  {t('privacyPolicy.intro.p2')}
                </p>
              </CardContent>
            </Card>

            {/* Información que recopilamos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.dataCollection.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t('privacyPolicy.dataCollection.personal.title')}</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>{t('privacyPolicy.dataCollection.personal.name')}</li>
                    <li>{t('privacyPolicy.dataCollection.personal.email')}</li>
                    <li>{t('privacyPolicy.dataCollection.personal.phone')}</li>
                    <li>{t('privacyPolicy.dataCollection.personal.address')}</li>
                    <li>{t('privacyPolicy.dataCollection.personal.payment')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('privacyPolicy.dataCollection.usage.title')}</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>{t('privacyPolicy.dataCollection.usage.ip')}</li>
                    <li>{t('privacyPolicy.dataCollection.usage.browser')}</li>
                    <li>{t('privacyPolicy.dataCollection.usage.device')}</li>
                    <li>{t('privacyPolicy.dataCollection.usage.navigation')}</li>
                    <li>{t('privacyPolicy.dataCollection.usage.interactions')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Uso de la información */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.dataUsage.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>{t('privacyPolicy.dataUsage.services')}</li>
                  <li>{t('privacyPolicy.dataUsage.communication')}</li>
                  <li>{t('privacyPolicy.dataUsage.improvements')}</li>
                  <li>{t('privacyPolicy.dataUsage.security')}</li>
                  <li>{t('privacyPolicy.dataUsage.legal')}</li>
                  <li>{t('privacyPolicy.dataUsage.marketing')}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.cookies.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('privacyPolicy.cookies.description')}
                </p>
                <div>
                  <h3 className="font-semibold mb-2">{t('privacyPolicy.cookies.types.title')}</h3>
                  <ul className="space-y-3 ml-4">
                    <li>
                      <strong className="text-profit">{t('privacyPolicy.cookies.types.necessary')}</strong>
                      <p className="text-sm text-muted-foreground">{t('privacyPolicy.cookies.types.necessaryDesc')}</p>
                    </li>
                    <li>
                      <strong className="text-profit">{t('privacyPolicy.cookies.types.analytics')}</strong>
                      <p className="text-sm text-muted-foreground">{t('privacyPolicy.cookies.types.analyticsDesc')}</p>
                    </li>
                    <li>
                      <strong className="text-profit">{t('privacyPolicy.cookies.types.marketing')}</strong>
                      <p className="text-sm text-muted-foreground">{t('privacyPolicy.cookies.types.marketingDesc')}</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Compartir información */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.sharing.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('privacyPolicy.sharing.intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>{t('privacyPolicy.sharing.providers')}</li>
                  <li>{t('privacyPolicy.sharing.payment')}</li>
                  <li>{t('privacyPolicy.sharing.analytics')}</li>
                  <li>{t('privacyPolicy.sharing.legal')}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Seguridad */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.security.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('privacyPolicy.security.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>{t('privacyPolicy.security.encryption')}</li>
                  <li>{t('privacyPolicy.security.access')}</li>
                  <li>{t('privacyPolicy.security.monitoring')}</li>
                  <li>{t('privacyPolicy.security.updates')}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Tus derechos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.rights.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>{t('privacyPolicy.rights.access')}</li>
                  <li>{t('privacyPolicy.rights.correction')}</li>
                  <li>{t('privacyPolicy.rights.deletion')}</li>
                  <li>{t('privacyPolicy.rights.portability')}</li>
                  <li>{t('privacyPolicy.rights.restriction')}</li>
                  <li>{t('privacyPolicy.rights.objection')}</li>
                  <li>{t('privacyPolicy.rights.withdraw')}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Retención de datos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.retention.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('privacyPolicy.retention.description')}
                </p>
              </CardContent>
            </Card>

            {/* Transferencias internacionales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.international.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('privacyPolicy.international.description')}
                </p>
              </CardContent>
            </Card>

            {/* Menores de edad */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.minors.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('privacyPolicy.minors.description')}
                </p>
              </CardContent>
            </Card>

            {/* Cambios en la política */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.changes.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('privacyPolicy.changes.description')}
                </p>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card className="border-2 border-profit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-profit" />
                  {t('privacyPolicy.contact.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('privacyPolicy.contact.description')}
                </p>
                <div className="bg-surface/50 p-4 rounded-lg space-y-2">
                  <p className="font-semibold">PQ Trader</p>
                  <p className="text-sm text-muted-foreground">
                    Email: <a href="mailto:privacy@pqtrader.com" className="text-profit hover:underline">privacy@pqtrader.com</a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('privacyPolicy.contact.support')}: <a href="mailto:support@pqtrader.com" className="text-profit hover:underline">support@pqtrader.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
