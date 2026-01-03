import { Metadata } from 'next';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Scale, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | PQ Trader',
  description: 'Términos y condiciones de uso de la plataforma PQ Trader. Información legal, regulatoria y de cumplimiento.',
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-muted-foreground">
              Última actualización: 3 de enero de 2026
            </p>
          </div>

          {/* Aviso Regulatorio Principal */}
          <Card className="border-2 border-loss bg-loss/5 mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-loss" />
                <CardTitle className="text-loss">Aviso Regulatorio Importante</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-semibold">
                PQ Trader NO está registrado como Asesor de Comercio de Productos Básicos (CTA) ante la CFTC ni como miembro de la NFA.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-loss">•</span>
                  <span>Los sistemas y estrategias ofrecidos son exclusivamente para fines EDUCATIVOS.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-loss">•</span>
                  <span>NO proporcionamos asesoramiento de inversión personalizado.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-loss">•</span>
                  <span>Los resultados pasados NO garantizan rendimientos futuros.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Secciones */}
          <div className="space-y-8">
            {/* 1. Restricciones Geográficas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-profit" />
                  1. Restricciones Geográficas y Regulatorias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">1.1 Residentes de Estados Unidos - CFDs</h3>
                  <p className="mb-2">
                    Los Contratos por Diferencia (CFDs) están <strong className="text-loss">PROHIBIDOS</strong> para 
                    inversores minoristas en Estados Unidos por regulación de la CFTC.
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Los sistemas de CFDs NO están disponibles para residentes de EE.UU.</li>
                    <li>• Al adquirir productos relacionados con CFDs, confirma que NO es residente de EE.UU.</li>
                    <li>• Violar esta restricción puede resultar en consecuencias legales.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">1.2 Residentes de Estados Unidos - Futuros</h3>
                  <p className="mb-2">
                    Los sistemas de trading de futuros ofrecidos son herramientas educativas:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• NO constituyen asesoramiento de inversión personalizado.</li>
                    <li>• NO gestionamos fondos de clientes.</li>
                    <li>• Recomendamos consultar con un CTA registrado ante la CFTC/NFA.</li>
                    <li>• El uso de estos sistemas es bajo su propia responsabilidad.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">1.3 Clientes Internacionales</h3>
                  <p>
                    Los clientes fuera de EE.UU. deben cumplir con las leyes y regulaciones de sus países respectivos.
                    Es responsabilidad del usuario asegurarse de que el uso de nuestros servicios sea legal en su jurisdicción.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Naturaleza de los Servicios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-profit" />
                  2. Naturaleza de los Servicios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">2.1 Propósito Educativo</h3>
                  <p>
                    Todos los cursos, mentorías, sistemas y estrategias son exclusivamente para fines educativos y de investigación.
                    No garantizamos resultados específicos ni rendimientos de inversión.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">2.2 No es Asesoramiento de Inversión</h3>
                  <p>
                    Nada de lo proporcionado en esta plataforma constituye asesoramiento de inversión, asesoramiento financiero,
                    asesoramiento comercial o cualquier otro tipo de asesoramiento. Siempre debe realizar su propia investigación
                    y consultar con asesores financieros registrados.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">2.3 Resultados de Rendimiento</h3>
                  <p>
                    Los resultados de rendimiento mostrados (backtesting, track records) son:
                  </p>
                  <ul className="space-y-1 ml-4 mt-2">
                    <li>• Basados en datos históricos y pueden no reflejar resultados futuros.</li>
                    <li>• No garantizan rendimientos similares en trading en vivo.</li>
                    <li>• Pueden incluir comisiones, slippage y otros costos simulados.</li>
                    <li>• Verificados cuando sea posible, pero sin garantía de exactitud absoluta.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 3. Divulgación de Riesgos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-profit" />
                  3. Divulgación de Riesgos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-semibold text-yellow-600 dark:text-yellow-500 mb-2">
                    ⚠️ ADVERTENCIA DE ALTO RIESGO
                  </p>
                  <ul className="space-y-1">
                    <li>• El trading de futuros, CFDs y derivados conlleva un ALTO RIESGO de pérdida de capital.</li>
                    <li>• Puede perder MÁS de su inversión inicial debido al apalancamiento.</li>
                    <li>• Solo opere con capital que pueda permitirse perder completamente.</li>
                    <li>• El trading algorítmico no elimina el riesgo de pérdida.</li>
                    <li>• Los sistemas automáticos pueden fallar o comportarse de forma inesperada.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 4. Limitación de Responsabilidad */}
            <Card>
              <CardHeader>
                <CardTitle>4. Limitación de Responsabilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  PQ Trader, sus propietarios, empleados y afiliados NO serán responsables de:
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Pérdidas financieras derivadas del uso de nuestros sistemas o servicios.</li>
                  <li>• Errores de software, fallos técnicos o interrupciones del servicio.</li>
                  <li>• Decisiones de trading tomadas basadas en nuestro contenido educativo.</li>
                  <li>• Violaciones de regulaciones locales por parte del usuario.</li>
                  <li>• Cambios en las condiciones del mercado que afecten al rendimiento.</li>
                </ul>
              </CardContent>
            </Card>

            {/* 5. Política de Reembolsos */}
            <Card>
              <CardHeader>
                <CardTitle>5. Política de Reembolsos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">5.1 Cursos Digitales</h3>
                  <p>Reembolso completo dentro de los primeros 14 días si no ha accedido a más del 20% del contenido.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">5.2 Mentorías</h3>
                  <p>Cancelación gratuita hasta 24 horas antes de la sesión programada. No hay reembolsos después de la sesión.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">5.3 Alquileres y Suscripciones</h3>
                  <p>Cancelación en cualquier momento. No hay reembolsos prorrateados por periodos ya pagados.</p>
                </div>
              </CardContent>
            </Card>

            {/* 6. Propiedad Intelectual */}
            <Card>
              <CardHeader>
                <CardTitle>6. Propiedad Intelectual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Todo el contenido, códigos, estrategias y materiales proporcionados son propiedad de PQ Trader.
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Prohibida la reproducción, distribución o venta no autorizada.</li>
                  <li>• Los sistemas alquilados NO pueden ser revendidos o compartidos.</li>
                  <li>• Las estrategias son para uso personal del comprador únicamente.</li>
                  <li>• Violaciones pueden resultar en acciones legales y cancelación inmediata.</li>
                </ul>
              </CardContent>
            </Card>

            {/* 7. Modificaciones */}
            <Card>
              <CardHeader>
                <CardTitle>7. Modificaciones de los Términos</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  PQ Trader se reserva el derecho de modificar estos términos en cualquier momento.
                  Los cambios entrarán en vigor inmediatamente tras su publicación. El uso continuado
                  de nuestros servicios después de las modificaciones constituye su aceptación de los
                  nuevos términos.
                </p>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card className="bg-profit/5 border-profit/20">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-foreground mb-2">¿Preguntas Legales?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Para consultas sobre cumplimiento regulatorio o términos legales, contacte:
                </p>
                <a href="mailto:legal@pqtrader.com" className="text-profit hover:underline font-medium">
                  legal@pqtrader.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
