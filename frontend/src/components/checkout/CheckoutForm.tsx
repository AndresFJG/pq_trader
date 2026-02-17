'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { currencies, convertPrice, formatPrice, detectUserLocation } from '@/lib/currency';
import { useLanguage } from '@/lib/i18n';

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
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [internalSelectedCurrency, setInternalSelectedCurrency] = useState(initialCurrency);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');

  // Generar idempotency key única al montar el componente
  useEffect(() => {
    // Generar UUID v4
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };
    setIdempotencyKey(generateUUID());
  }, []);

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
    const { name, value } = e.target;
    
    // Formateo automático para fecha de vencimiento
    if (name === 'cardExpiry') {
      // Eliminar caracteres no numéricos
      let formatted = value.replace(/\D/g, '');
      
      // Limitar a 4 dígitos
      if (formatted.length > 4) {
        formatted = formatted.slice(0, 4);
      }
      
      // Agregar "/" después de los primeros 2 dígitos
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
      }
      
      setFormData({
        ...formData,
        [name]: formatted,
      });
      return;
    }
    
    // Formateo automático para número de tarjeta
    if (name === 'cardNumber') {
      // Eliminar caracteres no numéricos
      let formatted = value.replace(/\D/g, '');
      
      // Limitar a 16 dígitos
      if (formatted.length > 16) {
        formatted = formatted.slice(0, 16);
      }
      
      // Agregar espacios cada 4 dígitos
      formatted = formatted.match(/.{1,4}/g)?.join(' ') || formatted;
      
      setFormData({
        ...formData,
        [name]: formatted,
      });
      return;
    }
    
    // Formateo para CVV (solo números)
    if (name === 'cardCVV') {
      const formatted = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: formatted,
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenir doble submit
    if (loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validaciones básicas
      if (!formData.name || !formData.email) {
        setError(t('checkout.fillRequired'));
        setLoading(false);
        return;
      }

      // Procesar pago con Stripe (tarjeta)
      await handleStripePayment();
    } catch (err: any) {
      setError(err.message || 'Hubo un error procesando tu pago');
      setLoading(false);
    }
  };

  /**
   * Manejar pago con Stripe (redirige a Stripe Checkout)
   */
  const handleStripePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError(t('checkout.loginRequired') || 'Debes iniciar sesión');
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
        setLoading(false);
        return;
      }

      // Calcular monto total con IVA
      const convertedPrice = getConvertedPrice();
      const totalWithTax = convertedPrice * 1.21;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          productName,
          productType: productType || 'curso', // Asegurar que siempre se envíe
          amount: totalWithTax,
          currency: selectedCurrency.toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creando sesión de pago');
      }

      const data = await response.json();

      if (data.success && data.data.url) {
        // Redirigir a Stripe Checkout
        window.location.href = data.data.url;
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (error: any) {
      console.error('Stripe payment error:', error);
      setError(error.message || 'Error al procesar el pago con Stripe');
      setLoading(false);
    }
  };

  if (isLoadingLocation) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-profit mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('checkout.detectingLocation')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('checkout.paymentInfo')}</CardTitle>
          <CardDescription>
            {t('checkout.completeData')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de Moneda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">{t('checkout.paymentCurrency')}</Label>
              {detectedLocation && (
                <Badge variant="outline" className="text-xs">
                  {t('checkout.detected')}: {detectedLocation}
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
            <Label className="text-base font-semibold">{t('checkout.paymentMethod')}</Label>
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('card')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedPaymentMethod === 'card'
                    ? 'border-profit bg-profit/5'
                    : 'border-border hover:border-profit/50'
                }`}
              >
                <CreditCard className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{t('checkout.card')}</div>
                <div className="text-xs text-muted-foreground mt-1">Stripe - Secure Payment</div>
              </button>
            </div>
          </div>

          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('checkout.personalInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('checkout.fullName')} {t('checkout.required')}</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('checkout.fullName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('checkout.email')} {t('checkout.required')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('checkout.email')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('checkout.phone')} {t('checkout.required')}</Label>
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
                <Label htmlFor="country">{t('checkout.country')} {t('checkout.required')}</Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  placeholder={t('checkout.country')}
                />
              </div>
            </div>
          </div>

          {/* Información de Tarjeta */}
          {selectedPaymentMethod === 'card' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('checkout.cardInfo')}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">{t('checkout.cardNumber')} {t('checkout.required')}</Label>
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
                    <Label htmlFor="cardExpiry">{t('checkout.expiry')} {t('checkout.required')}</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      type="text"
                      inputMode="numeric"
                      required
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      placeholder="12/34"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCVV">{t('checkout.cvv')} {t('checkout.required')}</Label>
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
              <h3 className="text-lg font-semibold">{t('checkout.paypalInfo')}</h3>
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">{t('checkout.paypalEmail')} {t('checkout.required')}</Label>
                <Input
                  id="paypalEmail"
                  name="paypalEmail"
                  type="email"
                  required
                  value={formData.paypalEmail}
                  onChange={handleChange}
                  placeholder={t('checkout.paypalEmail')}
                />
              </div>
            </div>
          )}

          {/* SEPA IBAN */}
          {selectedPaymentMethod === 'sepa' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('checkout.bankingInfo')}</h3>
              <div className="space-y-2">
                <Label htmlFor="sepaIBAN">{t('checkout.iban')} {t('checkout.required')}</Label>
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
            <h3 className="text-lg font-semibold">{t('checkout.billingAddress')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">{t('checkout.address')} {t('checkout.required')}</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t('checkout.address')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t('checkout.city')} {t('checkout.required')}</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t('checkout.city')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">{t('checkout.postalCode')} {t('checkout.required')}</Label>
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
            {t('checkout.processing')}
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            {t('checkout.pay')} {getCurrentPrice()}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4" />
          <span>{t('checkout.sslSecure')}</span>
        </div>
        <div className="flex items-center gap-1">
          <CreditCard className="h-4 w-4" />
          <span>Stripe</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="h-4 w-4" />
          <span>{t('checkout.encrypted')}</span>
        </div>
      </div>
    </form>
  );
}
