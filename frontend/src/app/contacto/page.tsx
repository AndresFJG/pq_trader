'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageCircle, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Implementar envío de email con backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('¡Mensaje enviado! Te responderemos pronto.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contacta con <span className="text-profit">Nosotros</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte en tu camino hacia el trading algorítmico profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Email */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-profit/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-profit" />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription>Respuesta en menos de 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="mailto:info@pqtrader.com" className="text-profit hover:underline">
                  info@pqtrader.com
                </a>
              </CardContent>
            </Card>

            {/* Telegram */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-profit/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-profit" />
                </div>
                <CardTitle>Telegram</CardTitle>
                <CardDescription>Soporte instantáneo</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="https://t.me/pqtrader" target="_blank" rel="noopener noreferrer" className="text-profit hover:underline">
                  @pqtrader
                </a>
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-profit/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-profit" />
                </div>
                <CardTitle>Ubicación</CardTitle>
                <CardDescription>Oficina principal</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Madrid, España<br />
                  Zona horaria: GMT+1
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Contacto */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Envíanos un Mensaje</CardTitle>
              <CardDescription>
                Completa el formulario y nuestro equipo te responderá lo antes posible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto</Label>
                  <Input
                    id="subject"
                    placeholder="¿En qué podemos ayudarte?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="profit"
                  disabled={loading}
                >
                  {loading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
