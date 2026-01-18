'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, Eye, BarChart3, Target, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

export default function PoliticaCookiesPage() {
  const { t } = useLanguage();

  const manageCookies = () => {
    // Limpiar consent actual para forzar que aparezca el banner
    localStorage.removeItem('cookie-consent');
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-profit/10 rounded-full mb-4">
              <Cookie className="h-8 w-8 text-profit" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('cookiesPolicy.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('cookiesPolicy.subtitle')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('privacyPolicy.lastUpdated')}: 17 {t('privacyPolicy.january')} 2026
            </p>
          </div>

          <div className="space-y-6">
            {/* Qué son las cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-profit" />
                  {t('cookiesPolicy.what.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('cookiesPolicy.what.p1')}
                </p>
                <p className="text-muted-foreground">
                  {t('cookiesPolicy.what.p2')}
                </p>
              </CardContent>
            </Card>

            {/* Tipos de cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-profit" />
                  {t('cookiesPolicy.types.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cookies Necesarias */}
                <div className="border-l-4 border-profit pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-profit" />
                    <h3 className="font-semibold text-lg">{t('cookiesPolicy.types.necessary.title')}</h3>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {t('cookiesPolicy.types.necessary.description')}
                  </p>
                  <div className="bg-surface/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm"><strong>{t('cookiesPolicy.purpose')}:</strong> {t('cookiesPolicy.types.necessary.purpose')}</p>
                    <p className="text-sm"><strong>{t('cookiesPolicy.duration')}:</strong> {t('cookiesPolicy.types.necessary.duration')}</p>
                    <p className="text-sm"><strong>{t('cookiesPolicy.examples')}:</strong> cookie-consent, session-id, language-preference</p>
                  </div>
                </div>

                {/* Cookies de Análisis */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-lg">{t('cookiesPolicy.types.analytics.title')}</h3>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {t('cookiesPolicy.types.analytics.description')}
                  </p>
                  <div className="bg-surface/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm"><strong>{t('cookiesPolicy.purpose')}:</strong> {t('cookiesPolicy.types.analytics.purpose')}</p>
                    <p className="text-sm"><strong>{t('cookiesPolicy.duration')}:</strong> {t('cookiesPolicy.types.analytics.duration')}</p>
                    <p className="text-sm"><strong>{t('cookiesPolicy.provider')}:</strong> Google Analytics</p>
                    <p className="text-sm"><strong>{t('cookiesPolicy.examples')}:</strong> _ga, _gid, _gat</p>
                  </div>
                </div>

                {/* Cookies de Marketing */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold text-lg">{t('cookiesPolicy.types.marketing.title')}</h3>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {t('cookiesPolicy.types.marketing.description')}
                  </p>
                  <div className="bg-surface/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm"><strong>{t('cookiesPolicy.purpose')}:</strong> {t('cookiesPolicy.types.marketing.purpose')}</p>
                    <p className="text-sm"><strong>{t('cookiesPolicy.duration')}:</strong> {t('cookiesPolicy.types.marketing.duration')}</p>
                    <p className="text-sm"><strong>{t('cookiesPolicy.provider')}:</strong> Google Ads, Facebook Pixel, LinkedIn Insight</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies de terceros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-profit" />
                  {t('cookiesPolicy.thirdParty.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('cookiesPolicy.thirdParty.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Google Analytics:</strong> {t('cookiesPolicy.thirdParty.googleAnalytics')}</li>
                  <li><strong>Google Ads:</strong> {t('cookiesPolicy.thirdParty.googleAds')}</li>
                  <li><strong>Facebook Pixel:</strong> {t('cookiesPolicy.thirdParty.facebook')}</li>
                  <li><strong>Stripe:</strong> {t('cookiesPolicy.thirdParty.stripe')}</li>
                  <li><strong>PayPal:</strong> {t('cookiesPolicy.thirdParty.paypal')}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cómo gestionar cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-profit" />
                  {t('cookiesPolicy.manage.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('cookiesPolicy.manage.description')}
                </p>
                
                <div className="bg-profit/10 border border-profit/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{t('cookiesPolicy.manage.ourSettings')}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('cookiesPolicy.manage.ourSettingsDesc')}
                  </p>
                  <Button onClick={manageCookies} variant="profit">
                    <Settings className="h-4 w-4 mr-2" />
                    {t('cookiesPolicy.manage.button')}
                  </Button>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">{t('cookiesPolicy.manage.browserSettings')}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <strong>Google Chrome:</strong>{' '}
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-profit hover:underline">
                        {t('cookiesPolicy.manage.instructions')}
                      </a>
                    </li>
                    <li>
                      <strong>Mozilla Firefox:</strong>{' '}
                      <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-profit hover:underline">
                        {t('cookiesPolicy.manage.instructions')}
                      </a>
                    </li>
                    <li>
                      <strong>Safari:</strong>{' '}
                      <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-profit hover:underline">
                        {t('cookiesPolicy.manage.instructions')}
                      </a>
                    </li>
                    <li>
                      <strong>Microsoft Edge:</strong>{' '}
                      <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-profit hover:underline">
                        {t('cookiesPolicy.manage.instructions')}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    ⚠️ {t('cookiesPolicy.manage.warning')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actualizaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-profit" />
                  {t('cookiesPolicy.updates.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('cookiesPolicy.updates.description')}
                </p>
              </CardContent>
            </Card>

            {/* Más información */}
            <Card className="border-2 border-profit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-profit" />
                  {t('cookiesPolicy.moreInfo.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('cookiesPolicy.moreInfo.description')}
                </p>
                <div className="bg-surface/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <strong>{t('privacyPolicy.contact.support')}:</strong>{' '}
                    <a href="mailto:cookies@pqtrader.com" className="text-profit hover:underline">cookies@pqtrader.com</a>
                  </p>
                  <p className="text-sm">
                    <a href="/politica-privacidad" className="text-profit hover:underline">
                      → {t('cookiesPolicy.moreInfo.privacyPolicy')}
                    </a>
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
