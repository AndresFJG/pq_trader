'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-profit" />
            <span className="text-xl font-bold">PQ Trader</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/cursos" className="text-foreground hover:text-profit transition">
              Cursos
            </Link>
            <Link href="/mentorias" className="text-foreground hover:text-profit transition">
              Mentorías
            </Link>
            <Link href="/strategyquant" className="text-foreground hover:text-profit transition">
              StrategyQuant
            </Link>
            <Link href="/portafolios" className="text-foreground hover:text-profit transition">
              Portafolios
            </Link>
            <Link href="/alquileres" className="text-foreground hover:text-profit transition">
              Alquileres
            </Link>
            <Link href="/blog" className="text-foreground hover:text-profit transition">
              Blog
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="profit">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button variant="profit">Comenzar Ahora</Button>
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
              {user ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="profit" className="w-full">
                    Dashboard
                  </Button>
                </Link>
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
