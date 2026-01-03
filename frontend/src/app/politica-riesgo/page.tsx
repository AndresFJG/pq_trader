import { Metadata } from 'next';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Divulgación de Riesgos | PQ Trader',
  description: 'Divulgación completa de riesgos asociados con el trading algorítmico, futuros y CFDs.',
};

export default function PoliticaRiesgoPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-loss/10 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-loss" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Divulgación de Riesgos
            </h1>
            <p className="text-muted-foreground text-lg">
              Información esencial sobre los riesgos del trading algorítmico
            </p>
          </div>

          <Card className="border-2 border-loss mb-8">
            <CardContent className="p-8">
              <div className="bg-loss/10 border border-loss rounded-lg p-6 mb-6">
                <p className="text-lg font-bold text-loss mb-4">
                  ⚠️ ADVERTENCIA DE ALTO RIESGO
                </p>
                <p className="text-foreground">
                  El trading de futuros, opciones, CFDs y otros derivados financieros conlleva
                  un nivel extremadamente alto de riesgo y puede no ser adecuado para todos los
                  inversores. Existe la posibilidad de que sufra una pérdida de parte o de toda
                  su inversión inicial y, por lo tanto, no debe invertir dinero que no pueda
                  permitirse perder.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Riesgos del Trading de Futuros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">
                  Los contratos de futuros son instrumentos financieros altamente volátiles:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Apalancamiento:</strong> Puede perder más que su inversión inicial debido al efecto del apalancamiento.</li>
                  <li>• <strong>Volatilidad:</strong> Los precios pueden cambiar rápida y drásticamente.</li>
                  <li>• <strong>Margin Calls:</strong> Puede ser requerido a depositar fondos adicionales inmediatamente.</li>
                  <li>• <strong>Gaps de Mercado:</strong> Los precios pueden abrir significativamente diferentes al cierre anterior.</li>
                  <li>• <strong>Liquidación Forzada:</strong> Sus posiciones pueden ser cerradas sin su consentimiento.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Riesgos de los CFDs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="bg-loss/5 border border-loss/20 rounded p-3 mb-3">
                  <p className="text-loss font-semibold">
                    Nota: Los CFDs están prohibidos para residentes de Estados Unidos.
                  </p>
                </div>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Productos Complejos:</strong> Los CFDs son instrumentos complejos de alto riesgo.</li>
                  <li>• <strong>Pérdidas Rápidas:</strong> El apalancamiento puede amplificar tanto ganancias como pérdidas.</li>
                  <li>• <strong>Costos de Financiación:</strong> Mantener posiciones overnight tiene costos.</li>
                  <li>• <strong>Riesgo de Contraparte:</strong> Depende de la solvencia del broker.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Riesgos del Trading Algorítmico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Los sistemas automatizados de trading presentan riesgos adicionales:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Fallos Tecnológicos:</strong> Errores de software, fallos de conectividad o problemas de hardware.</li>
                  <li>• <strong>Sobre-Optimización:</strong> Sistemas ajustados a datos históricos pueden fallar en vivo.</li>
                  <li>• <strong>Cambios de Mercado:</strong> Condiciones que funcionaron en el pasado pueden no repetirse.</li>
                  <li>• <strong>Ejecución:</strong> Slippage, recotizaciones y latencia pueden afectar resultados.</li>
                  <li>• <strong>Supervisión Inadecuada:</strong> Los sistemas automáticos requieren monitoreo constante.</li>
                  <li>• <strong>Eventos Imprevistos:</strong> Noticias, eventos geopolíticos pueden causar comportamientos inesperados.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Limitaciones del Backtesting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">
                  Los resultados de backtesting tienen limitaciones inherentes:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Datos Históricos:</strong> No garantizan rendimientos futuros.</li>
                  <li>• <strong>Simulación vs Realidad:</strong> El backtesting no replica perfectamente el trading en vivo.</li>
                  <li>• <strong>Costos Simulados:</strong> Comisiones, slippage y spreads pueden ser estimaciones.</li>
                  <li>• <strong>Sesgos:</strong> Look-ahead bias, survivorship bias y otros pueden inflar resultados.</li>
                  <li>• <strong>Liquidez:</strong> El backtesting puede asumir liquidez ilimitada.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Ninguna Garantía de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  PQ Trader NO garantiza, representa ni implica que:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Obtendrá ganancias utilizando nuestros sistemas o estrategias.</li>
                  <li>• Los resultados pasados se repetirán en el futuro.</li>
                  <li>• Nuestros sistemas funcionarán en todas las condiciones de mercado.</li>
                  <li>• No experimentará pérdidas significativas.</li>
                  <li>• Los resultados mostrados son típicos o esperables.</li>
                </ul>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4 mt-4">
                  <p className="font-semibold text-yellow-600 dark:text-yellow-500">
                    Los resultados hipotéticos tienen muchas limitaciones inherentes y no representan trading real.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">
                  Antes de operar, considere lo siguiente:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Eduquese completamente sobre los mercados y productos que operará.</li>
                  <li>• Consulte con asesores financieros y legales calificados.</li>
                  <li>• Opere solo con capital que pueda permitirse perder completamente.</li>
                  <li>• Comience con cuentas demo antes de operar con dinero real.</li>
                  <li>• Implemente gestión de riesgo estricta en todas las operaciones.</li>
                  <li>• Monitoree constantemente sus posiciones y sistemas.</li>
                  <li>• Mantenga expectativas realistas sobre rendimientos.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Regulación y Registro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                  <p className="font-semibold text-foreground mb-2">
                    Información Regulatoria:
                  </p>
                  <ul className="space-y-2">
                    <li>• PQ Trader NO está registrado como CTA ante la CFTC/NFA.</li>
                    <li>• NO proporcionamos asesoramiento de inversión personalizado.</li>
                    <li>• Nuestros servicios son exclusivamente educativos.</li>
                    <li>• Para asesoramiento regulado, consulte con profesionales registrados.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-profit/20 bg-profit/5">
              <CardContent className="p-6 text-center">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Al utilizar nuestros servicios, reconoce que:
                </p>
                <p className="text-sm text-muted-foreground">
                  Ha leído, entendido y acepta esta divulgación de riesgos en su totalidad.
                  Comprende que el trading conlleva riesgos sustanciales y puede resultar en
                  pérdidas significativas. Acepta la plena responsabilidad por todas sus
                  decisiones de trading.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
