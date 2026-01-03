'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { detectUserLocation, convertPrice, formatPrice } from '@/lib/currency';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [detectedCurrency, setDetectedCurrency] = useState('EUR');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [isDetecting, setIsDetecting] = useState(true);
  
  // Obtener parámetros de la URL
  const productType = searchParams.get('type') as 'mentoria' | 'portafolio' | 'curso' | 'mentoria-grupal' || 'mentoria';
  const productName = searchParams.get('name') || 'Producto';
  const productPrice = parseFloat(searchParams.get('price') || '0');
  const productDescription = searchParams.get('description') || '';
  const productId = searchParams.get('id') || '';

  // Detectar ubicación al cargar
  useEffect(() => {
    const detect = async () => {
      setIsDetecting(true);
      const location = await detectUserLocation();
      if (location) {
        setDetectedCurrency(location.currency);
        setSelectedCurrency(location.currency);
      }
      setIsDetecting(false);
    };
    detect();
  }, []);

  const getConvertedPrice = () => {
    return convertPrice(productPrice, selectedCurrency);
  };

  const getFormattedPrice = (price: number) => {
    return formatPrice(price, selectedCurrency);
  };

  const formatProductType = (type: string) => {
    const types: { [key: string]: string } = {
      'mentoria': 'Mentoría Individual',
      'mentoria-grupal': 'Mentoría Grupal',
      'portafolio': 'Portafolio de Trading',
      'curso': 'Curso',
    };
    return types[type] || type;
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Finalizar <span className="text-profit">Compra</span>
            </h1>
            <p className="text-muted-foreground">
              Estás a un paso de comenzar tu transformación como trader profesional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario de Checkout */}
            <div className="lg:col-span-2">
              <CheckoutForm
                productType={productType}
                productName={productName}
                productPrice={productPrice}
                productDescription={productDescription}
                productId={productId}
                initialCurrency={detectedCurrency}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
              />
            </div>

            {/* Resumen del Pedido */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Producto */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-lg bg-profit/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-6 w-6 text-profit" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {productName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatProductType(productType)}
                          </p>
                        </div>
                      </div>
                      {productDescription && (
                        <p className="text-sm text-muted-foreground">
                          {productDescription}
                        </p>
                      )}
                    </div>

                    {/* Precios */}
                    <div className="border-t border-border/40 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground font-medium">
                          {getFormattedPrice(getConvertedPrice())}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">IVA (21%)</span>
                        <span className="text-foreground font-medium">
                          {getFormattedPrice(getConvertedPrice() * 0.21)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/40">
                        <span className="text-foreground">Total</span>
                        <span className="text-profit">
                          {getFormattedPrice(getConvertedPrice() * 1.21)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border/40">
                      <h4 className="font-semibold text-sm text-foreground">Qué incluye:</h4>
                      <ul className="space-y-2">
                        {productType === 'mentoria' && (
                          <>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Sesiones 1-a-1 personalizadas</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Grabación de sesiones</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Material exclusivo</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Soporte por email</span>
                            </li>
                          </>
                        )}
                        {productType === 'mentoria-grupal' && (
                          <>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Taller en vivo</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Networking con traders</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Grabación de por vida</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Material complementario</span>
                            </li>
                          </>
                        )}
                        {productType === 'portafolio' && (
                          <>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Robots verificados</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Optimización mensual</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Soporte 24/7</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Actualizaciones incluidas</span>
                            </li>
                          </>
                        )}
                        {productType === 'curso' && (
                          <>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Acceso de por vida</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Videos HD</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Código fuente</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">Certificado</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Garantía */}
                <Card className="bg-profit/5 border-profit/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-8 w-8 text-profit flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Garantía de 14 días
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Si no estás satisfecho, te devolvemos el 100% de tu dinero. Sin preguntas.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Acceso Inmediato */}
                <Card className="bg-gradient-to-br from-profit/10 to-background border-profit/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-8 w-8 text-profit flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Acceso Inmediato
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Recibirás acceso al contenido instantáneamente después del pago.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Cargando...</p>
    </div>}>
      <CheckoutContent />
    </Suspense>
  );
}
