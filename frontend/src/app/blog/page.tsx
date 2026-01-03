import { Metadata } from 'next';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog de Trading Algorítmico | Guías, Estrategias y Análisis',
  description: 'Artículos sobre trading algorítmico, estrategias cuantitativas, Python para trading, backtesting y análisis de mercados. Contenido actualizado semanalmente por traders profesionales.',
  keywords: [
    'blog trading algorítmico',
    'artículos trading',
    'estrategias trading blog',
    'guías trading',
    'tutoriales python trading',
    'análisis mercados',
    'trading cuantitativo blog'
  ],
  openGraph: {
    title: 'Blog de Trading Algorítmico | PQ Trader',
    description: 'Guías, estrategias y análisis de trading algorítmico. Contenido actualizado semanalmente por expertos.',
    url: 'https://pqtrader.com/blog',
    type: 'website',
    images: ['/og-blog.jpg'],
  },
};

// Mock blog posts
const posts = [
  {
    id: '1',
    title: 'Cómo Empezar con Trading Algorítmico en 2025',
    excerpt: 'Guía completa para principiantes que quieren adentrarse en el mundo del trading algorítmico. Desde conceptos básicos hasta tu primera estrategia.',
    author: 'Carlos Martínez',
    date: '2025-12-10',
    category: 'Principiantes',
    readTime: '8 min',
    image: '📚',
  },
  {
    id: '2',
    title: 'Python vs R: ¿Cuál es Mejor para Trading?',
    excerpt: 'Comparativa detallada entre Python y R para análisis cuantitativo y desarrollo de estrategias de trading.',
    author: 'Ana García',
    date: '2025-12-08',
    category: 'Herramientas',
    readTime: '6 min',
    image: '🐍',
  },
  {
    id: '3',
    title: 'Machine Learning en Trading: Casos Reales',
    excerpt: 'Exploramos 5 casos de uso reales de ML en trading algorítmico con ejemplos de código y resultados verificables.',
    author: 'Roberto Silva',
    date: '2025-12-05',
    category: 'Machine Learning',
    readTime: '12 min',
    image: '🤖',
  },
  {
    id: '4',
    title: 'Gestión de Riesgo: El Pilar del Trading Exitoso',
    excerpt: 'Por qué el 90% de los traders fallan por mala gestión de riesgo y cómo evitarlo con métodos probados.',
    author: 'Laura Fernández',
    date: '2025-12-03',
    category: 'Risk Management',
    readTime: '10 min',
    image: '🛡️',
  },
  {
    id: '5',
    title: 'Backtesting: Errores Comunes y Cómo Evitarlos',
    excerpt: 'Los 7 errores más comunes al hacer backtesting que pueden arruinar tus resultados y cómo prevenirlos.',
    author: 'Miguel Torres',
    date: '2025-12-01',
    category: 'Backtesting',
    readTime: '9 min',
    image: '📊',
  },
  {
    id: '6',
    title: 'APIs de Brokers: Guía de Integración',
    excerpt: 'Cómo conectar tu estrategia a Interactive Brokers, Alpaca y Binance. Tutorial paso a paso con código.',
    author: 'David López',
    date: '2025-11-28',
    category: 'APIs',
    readTime: '15 min',
    image: '🔌',
  },
];

const categories = ['Todos', 'Principiantes', 'Machine Learning', 'Risk Management', 'Herramientas', 'APIs'];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Blog de <span className="text-profit">Trading</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Artículos, tutoriales y análisis sobre trading algorítmico, 
            machine learning y estrategias cuantitativas.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 border-b border-border/40">
        <div className="container mx-auto max-w-7xl">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === 'Todos'
                    ? 'bg-profit text-background'
                    : 'bg-surface/50 text-muted-foreground hover:text-profit hover:bg-profit/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Destacado</h2>
            <p className="text-muted-foreground">El artículo más popular de la semana</p>
          </div>

          <Card className="group hover:border-profit/40 transition-all overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-profit/20 to-background flex items-center justify-center p-12">
                <span className="text-9xl">{posts[0].image}</span>
              </div>
              
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-profit/10 text-profit text-xs font-bold px-3 py-1 rounded-full">
                    {posts[0].category}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(posts[0].date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{posts[0].readTime}</span>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-profit transition-colors">
                  {posts[0].title}
                </h3>

                <p className="text-muted-foreground mb-6 text-lg">
                  {posts[0].excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{posts[0].author}</span>
                  </div>

                  <Link 
                    href={`/blog/${posts[0].id}`}
                    className="flex items-center gap-2 text-profit font-semibold hover:gap-3 transition-all"
                  >
                    Leer Artículo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Últimos Artículos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <Card key={post.id} className="group hover:border-profit/40 transition-all">
                <div className="bg-gradient-to-br from-profit/10 to-background flex items-center justify-center p-12 rounded-t-lg">
                  <span className="text-6xl">{post.image}</span>
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-profit/10 text-profit text-xs font-bold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <CardTitle className="group-hover:text-profit transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>

                    <Link 
                      href={`/blog/${post.id}`}
                      className="text-xs text-profit font-semibold hover:underline flex items-center gap-1"
                    >
                      Leer más
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-profit/5 to-background border-profit/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Suscríbete al Newsletter
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Recibe los mejores artículos sobre trading algorítmico directamente en tu email. 
                Sin spam, solo contenido de calidad.
              </p>

              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:border-profit focus:outline-none"
                />
                <button className="px-6 py-3 bg-profit text-background font-semibold rounded-lg hover:bg-profit/90 transition-colors">
                  Suscribirse
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                5,234+ traders ya reciben nuestro newsletter semanal
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
