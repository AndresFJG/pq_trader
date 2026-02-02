'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular envío de email (implementar con backend más adelante)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSent(true);
      toast.success('Correo de recuperación enviado');
    } catch (error) {
      toast.error('Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-md">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-profit transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-profit/10 flex items-center justify-center">
                {sent ? (
                  <CheckCircle className="h-8 w-8 text-profit" />
                ) : (
                  <Mail className="h-8 w-8 text-profit" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {sent ? '¡Correo Enviado!' : 'Recuperar Contraseña'}
              </CardTitle>
              <CardDescription>
                {sent 
                  ? 'Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.'
                  : 'Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu cuenta.'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    variant="profit"
                  >
                    {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center mt-4">
                    ¿Recordaste tu contraseña?{' '}
                    <Link href="/login" className="text-profit hover:underline">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-profit/5 border border-profit/20 rounded-lg p-4 text-sm">
                    <p className="text-muted-foreground">
                      Se ha enviado un correo a <strong className="text-foreground">{email}</strong> con instrucciones para restablecer tu contraseña.
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Si no recibes el correo en unos minutos, revisa tu carpeta de spam o{' '}
                    <button 
                      onClick={() => setSent(false)} 
                      className="text-profit hover:underline"
                    >
                      intenta nuevamente
                    </button>
                    .
                  </p>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <Link href="/login">
                      Volver al inicio de sesión
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
