'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export function AxtralWidget() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Esperar a que el script se cargue
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

    // Intentar inicializar después de que el DOM esté listo
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
