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
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      // Error ya manejado en el hook useAuth
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
                <span className="text-sm text-profit font-medium">{t('loginPage.badge')}</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t('loginPage.welcome')} <span className="text-profit">PQ Trader</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                {t('loginPage.subtitle')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-profit/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-profit font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('loginPage.benefits.courses.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('loginPage.benefits.courses.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-profit/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-profit font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('loginPage.benefits.portfolio.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('loginPage.benefits.portfolio.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-profit/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-profit font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('loginPage.benefits.community.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('loginPage.benefits.community.desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <Card className="border-border/40">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">{t('loginPage.title')}</CardTitle>
                <CardDescription>
                  {t('loginPage.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('loginPage.form.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('loginPage.form.emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t('loginPage.form.password')}</Label>
                      <Link href="/forgot-password" className="text-xs text-profit hover:underline">
                        {t('loginPage.form.forgotPassword')}
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={t('loginPage.form.passwordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {t('loginPage.form.rememberMe')}
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="profit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? t('loginPage.form.loading') : t('loginPage.form.submit')}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                  {t('loginPage.noAccount')}{' '}
                  <Link href="/register" className="text-profit hover:underline font-semibold">
                    {t('loginPage.signUp')}
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
