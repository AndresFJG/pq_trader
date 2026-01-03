import Link from 'next/link';
import { TrendingUp, Mail, Twitter, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-profit" />
              <span className="text-xl font-bold">PQ Trader</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Aprende trading algorítmico con expertos y resultados reales.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-profit transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-profit transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-profit transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold mb-4">Productos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cursos" className="text-muted-foreground hover:text-profit transition">
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="/mentorias" className="text-muted-foreground hover:text-profit transition">
                  Mentorías
                </Link>
              </li>
              <li>
                <Link href="/alquileres" className="text-muted-foreground hover:text-profit transition">
                  Alquileres
                </Link>
              </li>
              <li>
                <Link href="/portafolios" className="text-muted-foreground hover:text-profit transition">
                  Portafolios
                </Link>
              </li>
            </ul>
          </div>

          {/* Compañía */}
          <div>
            <h3 className="font-semibold mb-4">Compañía</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre-nosotros" className="text-muted-foreground hover:text-profit transition">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-profit transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-profit transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-muted-foreground hover:text-profit transition">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-profit transition">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/politica-riesgo" className="text-muted-foreground hover:text-profit transition">
                  Divulgación de Riesgos
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-muted-foreground hover:text-profit transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-profit transition">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="text-center text-sm text-muted-foreground mb-4">
            <p className="font-semibold text-foreground mb-2">⚠️ Aviso Regulatorio Importante</p>
            <p className="max-w-3xl mx-auto mb-2">
              PQ Trader NO está registrado como CTA ante la CFTC/NFA. Los servicios ofrecidos son exclusivamente 
              educativos y no constituyen asesoramiento de inversión. El trading conlleva riesgos elevados de pérdida.
            </p>
            <p className="text-xs">
              CFDs prohibidos para residentes de EE.UU. • Solo para fines educativos • Opere con responsabilidad
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2026 PQ Trader. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
