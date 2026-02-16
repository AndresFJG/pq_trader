'use client';

import Link from 'next/link';
import { TrendingUp, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-16 mb-8 sm:mb-10 md:mb-12">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4 lg:pr-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-profit group-hover:scale-110 transition-transform" />
              <span className="text-lg sm:text-xl font-bold">PQ Trader</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-3 sm:space-x-4 pt-2">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-profit transition-colors p-1.5 sm:p-2 hover:bg-profit/10 rounded-lg"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-profit transition-colors p-1.5 sm:p-2 hover:bg-profit/10 rounded-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-profit transition-colors p-1.5 sm:p-2 hover:bg-profit/10 rounded-lg"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">{t('footer.products')}</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/cursos" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('common.courses')}
                </Link>
              </li>
              <li>
                <Link href="/mentorias" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('common.mentorships')}
                </Link>
              </li>
              <li>
                <Link href="/alquileres" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('common.rentals')}
                </Link>
              </li>
              <li>
                <Link href="/portafolios" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('common.portfolios')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Compañía */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">{t('footer.company')}</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/sobre-nosotros" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('common.blog')}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">Email: <a href="mailto:info@pqtraders.com" className="text-profit hover:underline">info@pqtraders.com</a></span>
              </li>
              <li>
                <span className="text-muted-foreground">407 LINCOLN ROAD SUITE-12<br/>Miami Beach FL 33139</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">{t('footer.legal')}</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/politica-riesgo" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('footer.riskDisclosure')}
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/politica-cookies" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('footer.cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Notice */}
        <div className="border-t border-border/50 pt-6 sm:pt-8">
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <div className="text-center">
              <p className="font-semibold text-sm sm:text-base text-foreground mb-2 sm:mb-3 flex items-center justify-center gap-2">
                <span className="text-yellow-500">⚠️</span>
                {t('footer.regulatoryNotice')}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-4xl mx-auto mb-2 sm:mb-3 leading-relaxed px-2">
                {t('footer.regulatoryText')}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground px-2">
                {t('footer.regulatoryDisclaimer')}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs sm:text-sm text-muted-foreground px-2">
            <p>{t('footer.rights')}</p>
            <p className="mt-2">
              Página creada por{' '}
              <a href="https://technohouse2025.netlify.app/" target="_blank" rel="noopener noreferrer" className="underline text-profit hover:text-profit/80">
                TechnoHouse
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
