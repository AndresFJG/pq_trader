'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Cookie, Settings } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

export function CookieBanner() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
    
    // Activar analytics si acepta
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const acceptNecessary = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const savePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
    setShowSettings(false);

    // Actualizar consent de Google
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <Card className="mx-auto max-w-5xl border-2 border-profit/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <div className="p-6">
          {!showSettings ? (
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Cookie className="h-8 w-8 text-profit flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">
                      {t('cookies.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('cookies.description')}{' '}
                      {t('cookies.learnMore')}{' '}
                      <Link href="/politica-privacidad" className="text-profit hover:underline">
                        {t('cookies.privacyPolicy')}
                      </Link>.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={acceptNecessary}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="profit"
                  onClick={acceptAll}
                  className="flex-1"
                >
                  {t('cookies.acceptAll')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t('cookies.customize')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={acceptNecessary}
                  className="flex-1"
                >
                  {t('cookies.acceptNecessary')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">{t('cookies.customize')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('cookies.description')}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{t('cookies.necessary')}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t('cookies.necessaryDesc')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">{t('cookies.acceptNecessary')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{t('cookies.analytics')}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t('cookies.analyticsDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-profit"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{t('cookies.marketing')}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t('cookies.marketingDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-profit"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="profit"
                  onClick={savePreferences}
                  className="flex-1"
                >
                  {t('cookies.savePreferences')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="flex-1"
                >
                  {t('common.back')}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
