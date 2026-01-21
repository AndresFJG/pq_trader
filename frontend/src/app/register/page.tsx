'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, TrendingUp, Shield } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(t('registerPage.form.passwordMismatch'));
      return;
    }

    if (!acceptTerms) {
      alert(t('registerPage.form.acceptTermsRequired'));
      return;
    }

    setIsLoading(true);
    
    try {
      const { register } = await import('@/contexts/AuthContext');
      // TODO: Usar useAuth hook
      console.log('Registration attempt:', formData);
      // await register(formData.name, formData.email, formData.password);
      alert('Registro exitoso. Por favor inicia sesión.');
      window.location.href = '/login';
    } catch (error: any) {
      alert(error.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="hidden md:block">
              <div className="inline-flex items-center gap-2 bg-profit/10 border border-profit/20 rounded-full px-4 py-2 mb-6">
                <TrendingUp className="h-4 w-4 text-profit" />
                <span className="text-sm text-profit font-medium">{t('registerPage.badge')}</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t('registerPage.welcome')} <span className="text-profit">PQ Trader</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                {t('registerPage.subtitle')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-profit/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-profit" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('registerPage.benefits.secure.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('registerPage.benefits.secure.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-profit/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-profit font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('registerPage.benefits.instant.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('registerPage.benefits.instant.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-profit/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-profit font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('registerPage.benefits.support.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('registerPage.benefits.support.desc')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-profit/5 border border-profit/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-profit">{t('registerPage.stats.students')}</span> {t('registerPage.stats.studentsText')}
                </p>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <Card className="border-border/40">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">{t('registerPage.title')}</CardTitle>
                <CardDescription>
                  {t('registerPage.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('registerPage.form.name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={t('registerPage.form.namePlaceholder')}
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('registerPage.form.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('registerPage.form.emailPlaceholder')}
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('registerPage.form.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder={t('registerPage.form.passwordPlaceholder')}
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{t('registerPage.form.passwordHint')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('registerPage.form.confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder={t('registerPage.form.confirmPasswordPlaceholder')}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground cursor-pointer leading-tight"
                    >
                      {t('registerPage.form.acceptTerms')}{' '}
                      <Link href="/terms" className="text-profit hover:underline">
                        {t('registerPage.form.terms')}
                      </Link>{' '}
                      {t('registerPage.form.and')}{' '}
                      <Link href="/privacy" className="text-profit hover:underline">
                        {t('registerPage.form.privacy')}
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="profit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? t('registerPage.form.loading') : t('registerPage.form.submit')}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                  {t('registerPage.haveAccount')}{' '}
                  <Link href="/login" className="text-profit hover:underline font-semibold">
                    {t('registerPage.signIn')}
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
