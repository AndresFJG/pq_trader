'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { currencies, convertPrice, formatPrice, detectUserLocation } from '@/lib/currency';

interface CheckoutFormProps {
  productType: 'mentoria' | 'portafolio' | 'curso' | 'mentoria-grupal';
  productName: string;
  productPrice: number;
  productDescription?: string;
  productId: string;
  initialCurrency?: string;
  selectedCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
}

export function CheckoutForm({ 
  productType, 
  productName, 
  productPrice, 
  productDescription,
  productId,
  initialCurrency = 'EUR',
  selectedCurrency: externalSelectedCurrency,
  onCurrencyChange
}: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [internalSelectedCurrency, setInternalSelectedCurrency] = useState(initialCurrency);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Usar moneda externa si está disponible, sino usar interna
  const selectedCurrency = externalSelectedCurrency || internalSelectedCurrency;
  const setSelectedCurrency = (currency: string) => {
    setInternalSelectedCurrency(currency);
    onCurrencyChange?.(currency);
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    paypalEmail: '',
    sepaIBAN: '',
  });

  // Detectar ubicación al cargar
  useEffect(() => {
    const detectLocation = async () => {
      const location = await detectUserLocation();
      if (location) {
        setSelectedCurrency(location.currency);
        setDetectedLocation(location.countryName);
        setFormData(prev => ({ ...prev, country: location.country }));
      }
      setIsLoadingLocation(false);
    };
    
    // Solo detectar si no hay moneda externa controlada
    if (!externalSelectedCurrency) {
      detectLocation();
    } else {
      setIsLoadingLocation(false);
    }
  }, [externalSelectedCurrency]);

  // Sincronizar con moneda detectada desde el padre
  useEffect(() => {
    if (initialCurrency && initialCurrency !== 'EUR' && !externalSelectedCurrency) {
      setInternalSelectedCurrency(initialCurrency);
    }
  }, [initialCurrency, externalSelectedCurrency]);

  // Funciones de conversión
  const getConvertedPrice = () => {
    return convertPrice(productPrice, selectedCurrency);
  };

  const getFormattedPrice = (price: number) => {
    return formatPrice(price, selectedCurrency);
  };

  const getTotalWithTax = () => {
    const converted = getConvertedPrice();
    return converted * 1.21; // IVA 21%
  };

  const getCurrentPrice = () => {
    const total = getTotalWithTax();
    return formatPrice(total, selectedCurrency);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType,
          productId,
          productName,
          amount: Math.round(getConvertedPrice() * 100), // En centavos
          currency: selectedCurrency,
          paymentMethod: selectedPaymentMethod,
          customerEmail: formData.email,
          customerName: formData.name,
          customerCountry: formData.country,
        }),
      });

      if (!response.ok) {
        throw new Error('Error procesando el pago');
      }

      const data = await response.json();

      // Redirigir a página de éxito
      router.push('/checkout/success');
    } catch (err: any) {
      setError(err.message || 'Hubo un error procesando tu pago');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingLocation) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-profit mx-auto mb-4"></div>
            <p className="text-muted-foreground">Detectando tu ubicación...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Información de Pago</CardTitle>
          <CardDescription>
            Completa tus datos para finalizar la compra
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de Moneda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Moneda de Pago</Label>
              {detectedLocation && (
                <Badge variant="outline" className="text-xs">
                  Detectado: {detectedLocation}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => setSelectedCurrency(currency.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedCurrency === currency.code
                      ? 'border-profit bg-profit/5 text-profit font-semibold'
                      : 'border-border hover:border-profit/50'
                  }`}
                >
                  <div className="text-sm font-mono">{currency.code}</div>
                  <div className="text-xs text-muted-foreground">{currency.symbol}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Métodos de Pago */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Método de Pago</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('card')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPaymentMethod === 'card'
                    ? 'border-profit bg-profit/5'
                    : 'border-border hover:border-profit/50'
                }`}
              >
                <CreditCard className="h-5 w-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Tarjeta</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('paypal')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPaymentMethod === 'paypal'
                    ? 'border-profit bg-profit/5'
                    : 'border-border hover:border-profit/50'
                }`}
              >
                <div className="text-lg font-bold mb-1">PayPal</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('google-pay')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPaymentMethod === 'google-pay'
                    ? 'border-profit bg-profit/5'
                    : 'border-border hover:border-profit/50'
                }`}
              >
                <div className="text-sm font-bold mb-1">Google Pay</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('apple-pay')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPaymentMethod === 'apple-pay'
                    ? 'border-profit bg-profit/5'
                    : 'border-border hover:border-profit/50'
                }`}
              >
                <div className="text-sm font-bold mb-1">Apple Pay</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('sepa')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPaymentMethod === 'sepa'
                    ? 'border-profit bg-profit/5'
                    : 'border-border hover:border-profit/50'
                }`}
              >
                <div className="text-sm font-bold mb-1">SEPA</div>
              </button>
            </div>
          </div>

          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="España"
                />
              </div>
            </div>
          </div>

          {/* Información de Tarjeta */}
          {selectedPaymentMethod === 'card' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información de Tarjeta</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Vencimiento *</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      type="text"
                      required
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCVV">CVV *</Label>
                    <Input
                      id="cardCVV"
                      name="cardCVV"
                      type="text"
                      required
                      value={formData.cardCVV}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PayPal Email */}
          {selectedPaymentMethod === 'paypal' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información de PayPal</h3>
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">Email de PayPal *</Label>
                <Input
                  id="paypalEmail"
                  name="paypalEmail"
                  type="email"
                  required
                  value={formData.paypalEmail}
                  onChange={handleChange}
                  placeholder="tu-email@paypal.com"
                />
              </div>
            </div>
          )}

          {/* SEPA IBAN */}
          {selectedPaymentMethod === 'sepa' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Bancaria</h3>
              <div className="space-y-2">
                <Label htmlFor="sepaIBAN">IBAN *</Label>
                <Input
                  id="sepaIBAN"
                  name="sepaIBAN"
                  type="text"
                  required
                  value={formData.sepaIBAN}
                  onChange={handleChange}
                  placeholder="ES00 0000 0000 0000 0000 0000"
                />
              </div>
            </div>
          )}

          {/* Dirección de Facturación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dirección de Facturación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle Principal 123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Madrid"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Código Postal *</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="28001"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botón de Pago */}
      <Button
        type="submit"
        size="lg"
        className="w-full mt-6 bg-profit hover:bg-profit/90 text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Procesando...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Pagar {getCurrentPrice()}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4" />
          <span>SSL Seguro</span>
        </div>
        <div className="flex items-center gap-1">
          <CreditCard className="h-4 w-4" />
          <span>Stripe</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="h-4 w-4" />
          <span>Encriptado</span>
        </div>
      </div>
    </form>
  );
}
