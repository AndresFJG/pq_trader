'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';
import { getUserCountry, getRegionalDisclaimer, shouldShowCFDWarning } from '@/lib/geolocation';

export function RegionalDisclaimer() {
  const [disclaimer, setDisclaimer] = useState<any>(null);
  const [showCFDWarning, setShowCFDWarning] = useState(false);

  useEffect(() => {
    async function loadDisclaimer() {
      const country = await getUserCountry();
      const regionalDisclaimer = getRegionalDisclaimer(country);
      const needsCFDWarning = shouldShowCFDWarning(country);
      
      setDisclaimer(regionalDisclaimer);
      setShowCFDWarning(needsCFDWarning);
    }

    loadDisclaimer();
  }, []);

  if (!disclaimer) return null;

  return (
    <div className="space-y-4">
      {/* Main Regional Disclaimer */}
      <Card className={`border-2 ${disclaimer.critical ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-border'}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 ${disclaimer.critical ? 'text-yellow-500' : 'text-profit'}`}>
              {disclaimer.critical ? (
                <AlertTriangle className="h-6 w-6" />
              ) : (
                <Shield className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg">{disclaimer.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-surface/50 border border-border">
                  {disclaimer.regulator}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {disclaimer.content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional CFD Warning for EU countries */}
      {showCFDWarning && (
        <Card className="border-2 border-red-500/40 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold mb-1">Advertencia de Riesgo de CFDs</p>
                <p className="text-xs text-muted-foreground">
                  Entre el 74% y 89% de las cuentas de inversores minoristas pierden dinero al operar con CFDs. 
                  Debe considerar si puede permitirse el alto riesgo de perder su dinero.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
