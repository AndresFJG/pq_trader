'use client';

import Link from 'next/link';
import { TrendingUp, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-12">
          {/* Brand */}
          <div className="space-y-4 lg:pr-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <TrendingUp className="h-8 w-8 text-profit group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold">PQ Trader</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-profit transition-colors p-2 hover:bg-profit/10 rounded-lg"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-profit transition-colors p-2 hover:bg-profit/10 rounded-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-profit transition-colors p-2 hover:bg-profit/10 rounded-lg"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t('footer.products')}</h3>
            <ul className="space-y-3 text-sm">
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
            <h3 className="font-semibold mb-4 text-foreground">{t('footer.company')}</h3>
            <ul className="space-y-3 text-sm">
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
                <Link href="/faqs" className="text-muted-foreground hover:text-profit transition-colors inline-block">
                  {t('footer.faqs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t('footer.legal')}</h3>
            <ul className="space-y-3 text-sm">
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
        <div className="border-t border-border/50 pt-8">
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-6 mb-8">
            <div className="text-center">
              <p className="font-semibold text-foreground mb-3 flex items-center justify-center gap-2">
                <span className="text-yellow-500">⚠️</span>
                {t('footer.regulatoryNotice')}
              </p>
              <p className="text-sm text-muted-foreground max-w-4xl mx-auto mb-3 leading-relaxed">
                {t('footer.regulatoryText')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('footer.regulatoryDisclaimer')}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>{t('footer.rights')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
