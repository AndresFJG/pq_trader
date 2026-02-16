'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageToggle } from '@/components/theme/LanguageToggle';
import { useLanguage } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-profit" />
            <span className="text-lg sm:text-xl font-bold">PQ Trader</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/cursos" className="text-sm lg:text-base text-foreground hover:text-profit transition" prefetch={true}>
              {t('nav.courses')}
            </Link>
            <Link href="/mentorias" className="text-sm lg:text-base text-foreground hover:text-profit transition" prefetch={true}>
              {t('nav.mentorships')}
            </Link>
            <Link href="/strategyquant" className="text-sm lg:text-base text-foreground hover:text-profit transition" prefetch={true}>
              {t('nav.strategyquant')}
            </Link>
            <Link href="/portafolios" className="text-sm lg:text-base text-foreground hover:text-profit transition" prefetch={true}>
              {t('nav.portfolios')}
            </Link>
            <Link href="/alquileres" className="text-sm lg:text-base text-foreground hover:text-profit transition" prefetch={true}>
              {t('nav.rentals')}
            </Link>
            <Link href="/blog" className="text-sm lg:text-base text-foreground hover:text-profit transition" prefetch={true}>
              {t('nav.blog')}
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <LanguageToggle />
            <ThemeToggle />
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="h-10 w-24 bg-secondary/50 animate-pulse rounded-md" />
                <div className="h-10 w-32 bg-secondary/50 animate-pulse rounded-md" />
              </div>
            ) : user ? (
              <>
                {user.role === 'admin' ? (
                  <Link href="/admin">
                    <Button variant="profit">Admin Panel</Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button variant="profit">Dashboard</Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">{t('common.login')}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="profit">{t('common.register')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/cursos"
              className="block py-2 text-foreground hover:text-profit transition"
              onClick={() => setIsOpen(false)}
            >
              Cursos
            </Link>
            <Link
              href="/mentorias"
              className="block py-2 text-foreground hover:text-profit transition"
              onClick={() => setIsOpen(false)}
            >
              Mentorías
            </Link>
            <Link
              href="/strategyquant"
              className="block py-2 text-foreground hover:text-profit transition"
              onClick={() => setIsOpen(false)}
            >
              StrategyQuant
            </Link>
            <Link
              href="/portafolios"
              className="block py-2 text-foreground hover:text-profit transition"
              onClick={() => setIsOpen(false)}
            >
              Portafolios
            </Link>
            <Link
              href="/alquileres"
              className="block py-2 text-foreground hover:text-profit transition"
              onClick={() => setIsOpen(false)}
            >
              Alquileres
            </Link>
            <Link
              href="/blog"
              className="block py-2 text-foreground hover:text-profit transition"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <div className="pt-4 space-y-2">
              {loading ? (
                <>
                  <div className="h-10 w-full bg-secondary/50 animate-pulse rounded-md" />
                  <div className="h-10 w-full bg-secondary/50 animate-pulse rounded-md" />
                </>
              ) : user ? (
                <>
                  {user.role === 'admin' ? (
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <Button variant="profit" className="w-full">
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="profit" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="profit" className="w-full">
                      Comenzar Ahora
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
